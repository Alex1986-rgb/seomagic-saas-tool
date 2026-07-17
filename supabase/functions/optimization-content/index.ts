import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { ANTHROPIC_MODEL, Anthropic, anthropicClient, textFromMessage } from "../_shared/anthropic.ts";

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

    const anthropic = anthropicClient();

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
      const message = await anthropic.messages.create({
        model: ANTHROPIC_MODEL,
        max_tokens: 4096,
        thinking: { type: 'adaptive' },
        system: 'You are an SEO expert. Optimize the content for better search engine rankings while maintaining readability and user engagement.',
        messages: [
          {
            role: 'user',
            content: `${prompt}\n\nAudit data: ${JSON.stringify(auditResult.audit_data)}`,
          },
        ],
      });
      optimizedContent = textFromMessage(message);
    } catch (aiError) {
      if (aiError instanceof Anthropic.RateLimitError) {
        throw new Error('Rate limits exceeded, please try again later.');
      }
      console.error('Anthropic API error:', aiError);
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
