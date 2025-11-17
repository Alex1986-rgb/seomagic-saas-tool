import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

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

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
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

    // Call OpenAI API for content optimization
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-nano-2025-08-07',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert. Optimize the content for better search engine rankings while maintaining readability and user engagement.',
          },
          {
            role: 'user',
            content: `${prompt}\n\nAudit data: ${JSON.stringify(auditResult.audit_data)}`,
          },
        ],
        max_completion_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const optimizedContent = data.choices[0].message.content;

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
