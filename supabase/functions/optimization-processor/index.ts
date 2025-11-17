import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

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
    const { data: pages, error: pagesError } = await supabase
      .from('page_analysis')
      .select('url, title, meta_description, word_count, h1_count')
      .eq('audit_id', task_id)
      .limit(50); // Process up to 50 pages

    if (pagesError) {
      throw new Error('Failed to fetch page analysis');
    }

    console.log(`Processing ${pages?.length || 0} pages for optimization`);

    const optimizedPages = [];
    let totalCost = 0;

    // Process each page with AI
    for (const page of pages || []) {
      try {
        const prompt = buildOptimizationPrompt(page, options);
        
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: 'You are an SEO expert specializing in content optimization. Provide clear, actionable recommendations.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 2000
          }),
        });

        if (!aiResponse.ok) {
          console.error(`AI request failed for ${page.url}:`, await aiResponse.text());
          continue;
        }

        const aiData = await aiResponse.json();
        const recommendations = aiData.choices[0].message.content;

        optimizedPages.push({
          url: page.url,
          original: {
            title: page.title,
            meta_description: page.meta_description,
            word_count: page.word_count,
            h1_count: page.h1_count
          },
          recommendations,
          timestamp: new Date().toISOString()
        });

        // Estimate cost (approximate)
        totalCost += 0.05; // $0.05 per page optimization

      } catch (pageError) {
        console.error(`Error optimizing page ${page.url}:`, pageError);
      }
    }

    console.log(`Optimization complete: ${optimizedPages.length} pages processed`);

    // Calculate metrics
    const resultData = {
      optimized_pages: optimizedPages.length,
      total_pages: pages?.length || 0,
      improvements: optimizedPages,
      total_cost: totalCost,
      estimated_score_improvement: calculateScoreImprovement(optimizedPages.length),
      completed_at: new Date().toISOString(),
      options
    };

    // Update optimization job with results
    const { error: updateError } = await supabase
      .from('optimization_jobs')
      .update({
        status: 'completed',
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
        details: error instanceof Error ? error.stack : undefined
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
