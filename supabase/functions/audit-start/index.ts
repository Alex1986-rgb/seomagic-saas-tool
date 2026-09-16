import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { assertPublicUrlResolved, UnsafeUrlError } from "../_shared/url-guard.ts";
import { writeApiLog } from "../_shared/api-log.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/** Ошибка запроса с кодом ответа. */
class RequestError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface AuditStartRequest {
  url: string;
  options?: {
    maxPages?: number;
    type?: 'quick' | 'deep';
  };
}

serve(async (req) => {
  console.log('=== AUDIT START CALLED ===');
  console.log('Method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  let userId: string | null = null;
  let requestLog: Record<string, unknown> | null = null;

  // Журнал вызовов пишется служебным ключом и на каждом ответе, включая
  // ошибки: клиентом на anon-ключе RLS молча отклонял запись, и в журнале не
  // было ни одного запуска аудита. Гостевые запуски тоже пишутся — с user_id null.
  const reply = async (
    status: number,
    body: Record<string, unknown>,
    logResponse?: Record<string, unknown>,
  ): Promise<Response> => {
    await writeApiLog({
      functionName: 'audit-start',
      userId,
      statusCode: status,
      startedAt: startTime,
      requestData: requestLog,
      responseData: logResponse ?? body,
    });
    return new Response(JSON.stringify(body), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status,
    });
  };

  // Служебный клиент: запуск обработчика и отметка о сбое. Гостевую задачу
  // клиент пользователя пометить упавшей не может — менять её RLS не даёт.
  const serviceClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { url, options }: AuditStartRequest = await req.json();
    console.log('Request body:', { url, options });
    requestLog = { url: url ?? null, options: options ?? null };

    // Проверять можно только настоящий сайт в интернете. Раньше сюда проходил
    // любой адрес, и нашим сервером можно было постучаться во внутреннюю сеть.
    // Имя сайта резолвится: 127.0.0.1.nip.io и подобные тоже ведут внутрь.
    if (!url) {
      throw new RequestError('Invalid URL provided', 400);
    }
    try {
      await assertPublicUrlResolved(url);
    } catch (err) {
      if (err instanceof UnsafeUrlError) {
        throw new RequestError(err.message, 400);
      }
      throw err;
    }

    const taskType = options?.type || 'quick';
    const maxPages = options?.maxPages || (taskType === 'quick' ? 10 : 100);

    console.log('Task type:', taskType, 'Max pages:', maxPages);

    // Get user if authenticated
    const { data: { user } } = await supabaseClient.auth.getUser();
    console.log('User:', user?.id || 'anonymous');
    
    // For deep audit, require authentication
    if (taskType === 'deep' && !user) {
      throw new RequestError('Authentication required for deep audit', 401);
    }
    
    userId = user?.id || null;

    console.log(`Starting ${taskType} audit for ${url}, max pages: ${maxPages}`);

    // Create audit record first
    const auditData: any = {
      url: url,
      status: 'pending',
      total_pages: maxPages,
    };
    
    if (userId) {
      auditData.user_id = userId;
    }
    
    const { data: audit, error: auditError } = await supabaseClient
      .from('audits')
      .insert(auditData)
      .select()
      .single();

    if (auditError) {
      console.error('Error creating audit:', auditError);
      throw auditError;
    }

    // Create audit task linked to audit
    const taskData: any = {
      audit_id: audit.id,
      url: url,
      status: 'queued',
      task_type: taskType,
      estimated_pages: maxPages,
      stage: 'queued',
      progress: 0,
    };
    
    if (userId) {
      taskData.user_id = userId;
    }
    
    const { data: task, error: taskError } = await supabaseClient
      .from('audit_tasks')
      .insert(taskData)
      .select()
      .single();

    if (taskError) {
      console.error('Error creating task:', taskError);
      throw taskError;
    }

    console.log('✅ Task created with ID:', task.id);

    // Trigger audit processor with error handling
    try {
      console.log('🚀 Triggering audit processor...');
      // Обработчик принимает только служебный ключ: иначе его мог дёрнуть
      // кто угодно по чужому task_id. Задачу выше создал этот же запрос.
      const processorResponse = await serviceClient.functions.invoke('audit-processor', {
        body: { task_id: task.id }
      });
      
      if (processorResponse.error) {
        console.error('❌ Failed to trigger processor:', processorResponse.error);
        throw new Error(`Processor invocation failed: ${processorResponse.error.message}`);
      }
      
      console.log('✅ Processor triggered successfully');
    } catch (procError) {
      console.error('❌ Exception triggering processor:', procError);
      
      // Update task to failed state
      await serviceClient
        .from('audit_tasks')
        .update({ 
          status: 'failed', 
          error_message: `Failed to start processor: ${procError.message}` 
        })
        .eq('id', task.id);
      
      // Update audit to failed as well
      await serviceClient
        .from('audits')
        .update({ 
          status: 'failed', 
          error_message: `Failed to start processor: ${procError.message}` 
        })
        .eq('id', audit.id);
      
      throw new Error(`Failed to start audit processor: ${procError.message}`);
    }

    return await reply(
      200,
      {
        success: true,
        task_id: task.id,
        status: task.status,
        message: 'Audit started successfully',
      },
      { task_id: task.id },
    );
  } catch (error) {
    if (error instanceof RequestError) {
      return await reply(error.status, { success: false, error: error.message });
    }

    console.error('Error in audit-start:', error);
    const message = error instanceof Error ? error.message : String((error as { message?: unknown })?.message ?? error);

    return await reply(message === 'Unauthorized' ? 401 : 500, {
      success: false,
      error: message,
    });
  }
});
