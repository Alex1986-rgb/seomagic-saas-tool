/**
 * Переписывание страниц языковой моделью.
 *
 * Страницы обрабатываются параллельно: запрос к модели почти всё время ждёт
 * ответа, поэтому по одному пришлось бы тратить минуты там, где хватает секунд.
 * Результат каждой страницы сохраняется сразу — если обработчик оборвут, уже
 * сделанное (и оплаченное) не пропадёт.
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { generateText } from "../_shared/llm.ts";
import { concurrencyFromEnv, runPool } from "../_shared/pool.ts";

/** Сколько страниц отдаём модели одновременно. */
const CONCURRENCY = concurrencyFromEnv('LLM_CONCURRENCY', 8);
/** За один заход берём столько, сколько успеваем до предела времени функции. */
const PAGES_PER_RUN = 40;

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
}

interface PageContent {
  url: string;
  title: string;
  meta_description: string | null;
  word_count: number;
  h1_count: number;
}

/**
 * Во что обошлась работа модели. Цена за миллион токенов задаётся переменной:
 * у разных поставщиков она разная и со временем меняется.
 */
function estimateCost(totalTokens: number): number {
  const perMillion = Number(Deno.env.get('LLM_PRICE_PER_MTOKENS') ?? '0.3');
  return Number(((totalTokens / 1_000_000) * perMillion).toFixed(4));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { optimization_id, task_id, options = {} } = await req.json() as {
      optimization_id: string;
      task_id: string;
      options: OptimizationOptions;
    };

    console.log('Starting optimization process:', { optimization_id, task_id, options });

    // Update optimization job status to processing
    await supabase
      .from('optimization_jobs')
      .update({ 
        status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', optimization_id);

    // Get audit results
    const { data: auditResult, error: auditError } = await supabase
      .from('audit_results')
      .select('audit_data, page_count')
      .eq('task_id', task_id)
      .single();

    if (auditError || !auditResult) {
      throw new Error('Audit results not found');
    }

    // Get page analysis data
    /**
     * Страницы разбора лежат под идентификатором аудита, а не задачи: это
     * разные значения. Раньше здесь сравнивали audit_id с task_id, поэтому
     * оптимизация не находила ни одной страницы, но отчитывалась «выполнено»
     * и списывала стоимость. Берём настоящий идентификатор у задачи.
     */
    const { data: task } = await supabase
      .from('audit_tasks')
      .select('audit_id')
      .eq('id', task_id)
      .maybeSingle();

    const auditId = task?.audit_id ?? task_id;

    const { data: pages, error: pagesError } = await supabase
      .from('page_analysis')
      .select('id, url, title, meta_description, word_count, h1_count')
      .eq('audit_id', auditId)
      .limit(PAGES_PER_RUN);

    if (pagesError) {
      throw new Error('Failed to fetch page analysis');
    }

    // Обрабатывать нечего — честно говорим об этом, а не рапортуем об успехе.
    if (!pages || pages.length === 0) {
      await supabase
        .from('optimization_jobs')
        .update({
          status: 'failed',
          result_data: {
            error: 'Для этого аудита нет разобранных страниц — оптимизировать нечего',
            optimized_pages: 0,
            total_pages: 0,
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', optimization_id);

      return new Response(
        JSON.stringify({ success: false, error: 'Нет страниц для оптимизации' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    console.log(`Processing ${pages?.length || 0} pages for optimization`);

    const optimizedPages: Array<Record<string, unknown>> = [];
    const failures: Array<{ url: string; error: string }> = [];
    let processed = 0;

    // Страницы идут параллельно, но счётчик обновляем по ходу: пользователю
    // видно движение, а обрыв не выглядит как «ничего не произошло».
    await runPool(
      pages ?? [],
      async (page) => {
        const prompt = buildOptimizationPrompt(page, options);
        const startedAt = Date.now();

        const { text: recommendations, provider, model, usage } = await generateText({
          system: 'You are an SEO expert specializing in content optimization. Provide clear, actionable recommendations.',
          prompt,
          maxTokens: 4096,
        });

        const entry = {
          url: page.url,
          original: {
            title: page.title,
            meta_description: page.meta_description,
            word_count: page.word_count,
            h1_count: page.h1_count,
          },
          recommendations,
          provider,
          model,
          tokens: usage ?? null,
          processing_time_ms: Date.now() - startedAt,
          timestamp: new Date().toISOString(),
        };
        optimizedPages.push(entry);

        // Пишем результат страницы сразу, а не копим до конца работы.
        await supabase.from('fixed_pages').insert({
          audit_id: auditId,
          user_id: user.id,
          page_id: page.id ?? null,
          status: 'completed',
          fixes_applied: entry,
          llm_provider_used: `${provider}:${model}`,
          processing_time_ms: entry.processing_time_ms,
        });

        return entry;
      },
      {
        concurrency: CONCURRENCY,
        onSettled: async () => {
          processed++;
          // Каждые несколько страниц отмечаемся в задании: реже — чтобы не
          // молотить базу, чаще — чтобы счётчик не стоял.
          if (processed % 5 === 0 || processed === (pages?.length ?? 0)) {
            await supabase
              .from('optimization_jobs')
              .update({
                result_data: { processed, total: pages?.length ?? 0, stage: 'processing' },
                updated_at: new Date().toISOString(),
              })
              .eq('id', optimization_id);
          }
        },
      },
    ).then((results) => {
      for (const r of results) {
        if (r.error) {
          const message = r.error instanceof Error ? r.error.message : String(r.error);
          console.error(`Страница не обработана (${(r.item as PageContent).url}):`, message);
          failures.push({ url: (r.item as PageContent).url, error: message });
        }
      }
    });

    // Расход считаем по токенам, которые вернула модель, а не по придуманной
    // ставке за страницу: иначе в счёте клиенту будет неправда.
    const totalTokens = optimizedPages.reduce(
      (sum, page) => sum + Number((page.tokens as { total_tokens?: number } | null)?.total_tokens ?? 0),
      0,
    );
    const totalCost = estimateCost(totalTokens);

    console.log(`Optimization complete: ${optimizedPages.length} pages processed`);

    // Calculate metrics
    const resultData = {
      optimized_pages: optimizedPages.length,
      total_pages: pages?.length || 0,
      improvements: optimizedPages,
      failures,
      total_tokens: totalTokens,
      total_cost: totalCost,
      estimated_score_improvement: calculateScoreImprovement(optimizedPages.length),
      completed_at: new Date().toISOString(),
      options
    };

    // Update optimization job with results
    const { error: updateError } = await supabase
      .from('optimization_jobs')
      .update({
        status: failures.length > 0
          ? (optimizedPages.length > 0 ? 'partial' : 'failed')
          : 'completed',
        result_data: resultData,
        cost: totalCost,
        updated_at: new Date().toISOString()
      })
      .eq('id', optimization_id);

    if (updateError) {
      throw new Error('Failed to update optimization job');
    }

    // Log API usage
    await supabase.from('api_logs').insert({
      function_name: 'optimization-processor',
      user_id: user.id,
      request_data: { optimization_id, task_id, options },
      response_data: { pages_processed: optimizedPages.length, total_cost: totalCost },
      status_code: 200,
      duration_ms: 0
    });

    return new Response(
      JSON.stringify({
        success: true,
        optimization_id,
        pages_optimized: optimizedPages.length,
        total_cost: totalCost,
        estimated_improvement: calculateScoreImprovement(optimizedPages.length)
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Optimization processor error:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        // Стек остаётся в логах функции: наружу его отдавать нельзя —
        // он раскрывает устройство сервиса.
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function buildOptimizationPrompt(page: PageContent, options: OptimizationOptions): string {
  const parts = [];
  
  parts.push(`Analyze and optimize this page for SEO:`);
  parts.push(`URL: ${page.url}`);
  parts.push(`Current Title: ${page.title || 'No title'}`);
  parts.push(`Current Meta Description: ${page.meta_description || 'No meta description'}`);
  parts.push(`Word Count: ${page.word_count}`);
  parts.push(`H1 Count: ${page.h1_count}`);
  parts.push('');
  
  if (options.fixMetaTags) {
    parts.push('- Suggest improved title and meta description');
  }
  
  if (options.improveContent) {
    parts.push('- Recommend content improvements');
  }
  
  if (options.improveStructure) {
    parts.push('- Suggest heading structure improvements');
  }
  
  parts.push('');
  parts.push('Provide specific, actionable recommendations in a structured format.');
  
  return parts.join('\n');
}

function calculateScoreImprovement(pagesOptimized: number): number {
  // Rough estimate: each optimized page contributes to overall score improvement
  const baseImprovement = Math.min(pagesOptimized * 2, 30);
  return Math.round(baseImprovement);
}
