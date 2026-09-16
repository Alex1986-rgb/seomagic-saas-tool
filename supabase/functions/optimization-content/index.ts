import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { generateText, LlmError } from "../_shared/llm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

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
      throw new Error('Unauthorized');
    }

    const { task_id, prompt } = await req.json();

    if (!task_id || !prompt) {
      throw new Error('task_id and prompt are required');
    }

    console.log(`Optimizing content for task: ${task_id}`);

    // Get audit results
    const { data: auditResult, error: auditError } = await supabaseClient
      .from('audit_results')
      .select('audit_data')
      .eq('task_id', task_id)
      .single();

    if (auditError || !auditResult) {
      throw new Error('Audit results not found');
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

    // Create optimization job record
    await supabaseClient.from('optimization_jobs').insert({
      task_id,
      user_id: user.id,
      status: 'completed',
      options: { type: 'content', prompt },
      result_data: { optimized_content: optimizedContent },
      cost: 0,
    });

    // Log API call
    await supabaseClient.from('api_logs').insert({
      user_id: user.id,
      function_name: 'optimization-content',
      request_data: { task_id, prompt },
      response_data: { success: true },
      status_code: 200,
      duration_ms: 0,
    });

    return new Response(
      JSON.stringify({
        success: true,
        optimized_content: optimizedContent,
        message: 'Content optimized successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in optimization-content:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message === 'Unauthorized' ? 401 : 500,
      }
    );
  }
});
