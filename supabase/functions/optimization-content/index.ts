import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { isAdminUser } from "../_shared/auth.ts";
import { writeApiLog } from "../_shared/api-log.ts";
import { generateText, LlmError } from "../_shared/llm.ts";
import { assertOptimizationQuota, OptimizationLimitError } from "../_shared/optimization-limits.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/** Запрос к модели — пожелание, а не текст страницы: длиннее незачем. */
const MAX_PROMPT_LENGTH = 2000;

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

  // Журнал пишется служебным ключом и на каждом ответе, включая ошибки:
  // клиентом на anon-ключе RLS молча отклонял запись, а длительность была 0.
  const reply = async (
    status: number,
    body: Record<string, unknown>,
    logResponse?: Record<string, unknown>,
  ): Promise<Response> => {
    await writeApiLog({
      functionName: 'optimization-content',
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new RequestError('Unauthorized', 401);
    }
    userId = user.id;

    const { task_id, prompt } = await req.json();
    requestLog = {
      task_id: task_id ?? null,
      prompt: typeof prompt === 'string' ? prompt.slice(0, 500) : null,
    };

    if (!task_id || !prompt || typeof prompt !== 'string') {
      throw new RequestError('task_id and prompt are required', 400);
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
      throw new RequestError(`Слишком длинный запрос: не больше ${MAX_PROMPT_LENGTH} знаков`, 400);
    }

    // Каждый вызов — запрос к модели за счёт сервиса. Пока оплата не
    // подключена, он входит в тот же суточный лимит, что и запуск оптимизации.
    const isAdmin = await isAdminUser(user.id);
    await assertOptimizationQuota(user.id, isAdmin);

    console.log(`Optimizing content for task: ${task_id}`);

    // Get audit results
    const { data: auditResult, error: auditError } = await supabaseClient
      .from('audit_results')
      .select('audit_data')
      .eq('task_id', task_id)
      .single();

    if (auditError || !auditResult) {
      throw new RequestError('Audit results not found', 404);
    }

    // Call the Anthropic API (Claude) for content optimization
    let optimizedContent: string;
    try {
      const result = await generateText({
        system: 'You are an SEO expert. Optimize the content for better search engine rankings while maintaining readability and user engagement.',
        prompt: `${prompt}\n\nAudit data: ${JSON.stringify(auditResult.audit_data)}`,
        maxTokens: 4096,
      });
      optimizedContent = result.text;
    } catch (aiError) {
      // Отсутствие ключа и отказ поставщика — разные вещи: первое чинится
      // настройкой, второе повтором позже.
      if (aiError instanceof LlmError) {
        throw new Error(aiError.message);
      }
      console.error('Ошибка обращения к языковой модели:', aiError);
      throw new Error('AI request failed');
    }

    // Запись о работе — служебным ключом: у optimization_jobs нет политики на
    // вставку для пользователя, и клиент на anon-ключе молча её терял.
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    const { error: jobError } = await serviceClient.from('optimization_jobs').insert({
      task_id,
      user_id: user.id,
      status: 'completed',
      options: { type: 'content', prompt },
      result_data: { optimized_content: optimizedContent },
      cost: 0,
    });
    if (jobError) {
      console.error('Не удалось сохранить задание оптимизации контента:', jobError.message);
    }

    return await reply(
      200,
      {
        success: true,
        optimized_content: optimizedContent,
        message: 'Content optimized successfully',
      },
      { success: true },
    );
  } catch (error) {
    if (error instanceof RequestError || error instanceof OptimizationLimitError) {
      return await reply(error.status, { success: false, error: error.message });
    }

    console.error('Error in optimization-content:', error);

    return await reply(500, {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
