import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { assertTaskAccess, AuthError, isAdminUser } from "../_shared/auth.ts";
import { writeApiLog } from "../_shared/api-log.ts";
import {
  assertOptimizationQuota,
  OptimizationLimitError,
  optimizationMaxPages,
} from "../_shared/optimization-limits.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OptimizationOptions {
  fixMetaTags?: boolean;
  improveContent?: boolean;
  fixLinks?: boolean;
  improveStructure?: boolean;
  optimizeSpeed?: boolean;
  contentQuality?: 'standard' | 'premium' | 'ultimate';
  language?: string;
  instructions?: string;
}

/** Ошибка запроса с кодом ответа. */
class RequestError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startedAt = Date.now();
  let userId: string | null = null;
  let requestLog: Record<string, unknown> | null = null;

  // Каждый ответ, в том числе с ошибкой, оставляет запись в журнале вызовов с
  // настоящей длительностью: раньше писался только успех и с duration_ms: 0.
  const reply = async (
    status: number,
    body: Record<string, unknown>,
    logResponse?: Record<string, unknown>,
  ): Promise<Response> => {
    await writeApiLog({
      functionName: 'optimization-start',
      userId,
      statusCode: status,
      startedAt,
      requestData: requestLog,
      responseData: logResponse ?? body,
    });
    return new Response(JSON.stringify(body), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status,
    });
  };

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new RequestError('Missing authorization header', 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new RequestError('Unauthorized', 401);
    }
    userId = user.id;

    const { task_id, options = {} } = await req.json() as {
      task_id?: string;
      options?: OptimizationOptions;
    };
    requestLog = { task_id: task_id ?? null, options };

    if (!task_id) {
      throw new RequestError('task_id is required', 400);
    }

    // Оптимизация тратит деньги на модель — по чужой задаче её не запустить.
    await assertTaskAccess(req, task_id);

    // Оплата не подключена, поэтому запуски ограничены предохранителем:
    // не больше OPTIMIZATION_DAILY_LIMIT за сутки на пользователя. Число
    // страниц за запуск (OPTIMIZATION_MAX_PAGES) ограничивает обработчик —
    // здесь его только сообщаем в ответе. Администратора лимиты не касаются.
    const isAdmin = await isAdminUser(user.id);
    await assertOptimizationQuota(user.id, isAdmin);

    console.log('Starting optimization for task:', task_id);

    // Verify audit exists and is completed
    const { data: auditResult, error: auditError } = await supabase
      .from('audit_results')
      .select('id, page_count')
      .eq('task_id', task_id)
      .single();

    if (auditError || !auditResult) {
      throw new RequestError('Аудит не найден или ещё не завершён', 404);
    }

    // Create optimization job
    const { data: optimizationJob, error: createError } = await supabase
      .from('optimization_jobs')
      .insert({
        user_id: user.id,
        task_id,
        status: 'queued',
        options,
        cost: 0,
      })
      .select()
      .single();

    if (createError || !optimizationJob) {
      throw new Error('Failed to create optimization job');
    }

    console.log('Created optimization job:', optimizationJob.id);

    // Invoke optimization processor asynchronously
    const processorUrl = `${supabaseUrl}/functions/v1/optimization-processor`;

    fetch(processorUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        optimization_id: optimizationJob.id,
        task_id,
        options
      })
    }).catch(error => {
      console.error('Failed to invoke optimization processor:', error);
    });

    return await reply(
      200,
      {
        success: true,
        optimization_id: optimizationJob.id,
        status: 'queued',
        // Сколько страниц обработчик возьмёт за этот запуск; null — без
        // пользовательского ограничения (администратор).
        page_limit: isAdmin ? null : optimizationMaxPages(),
        message: 'Optimization started'
      },
      { optimization_id: optimizationJob.id },
    );
  } catch (error) {
    if (error instanceof AuthError || error instanceof OptimizationLimitError || error instanceof RequestError) {
      return await reply(error.status, { success: false, error: error.message });
    }

    console.error('Optimization start error:', error);

    return await reply(500, {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});
