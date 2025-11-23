import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Pricing is now managed in pricing_rules table
// and calculated by issue-classifier function

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('[OPTIMIZATION-CALCULATE] Supabase URL available:', !!supabaseUrl);
    console.log('[OPTIMIZATION-CALCULATE] Service role key available:', !!serviceRoleKey);
    
    const supabaseClient = createClient(
      supabaseUrl ?? '',
      serviceRoleKey ?? ''
    );

    const { task_id } = await req.json();

    console.log('[OPTIMIZATION-CALCULATE] Received task_id:', task_id, 'type:', typeof task_id);

    if (!task_id) {
      console.error('[OPTIMIZATION-CALCULATE] No task_id provided in request');
      throw new Error('task_id is required');
    }

    console.log('[OPTIMIZATION-CALCULATE] Processing task:', task_id);

    // Get audit results
    console.log('[OPTIMIZATION-CALCULATE] Fetching audit results...');
    const { data: result, error: resultError } = await supabaseClient
      .from('audit_results')
      .select('audit_data, page_count')
      .eq('task_id', task_id)
      .maybeSingle();

    if (resultError) {
      console.error('[OPTIMIZATION-CALCULATE] Error fetching audit results:', resultError);
      throw new Error(`Failed to fetch audit results: ${resultError.message}`);
    }

    if (!result) {
      console.error('[OPTIMIZATION-CALCULATE] No audit results found for task:', task_id);
      console.error('[OPTIMIZATION-CALCULATE] This usually means the audit is not completed yet or the task_id is invalid');
      
      // Return a more helpful error response
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Audit results not found. Please ensure the audit has completed before calculating optimization costs.',
          task_id: task_id
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    console.log('[OPTIMIZATION-CALCULATE] Found audit results, reading job estimate...');

    // Fetch estimate from job_estimates
    const { data: estimate, error: estimateError } = await supabaseClient
      .from('job_estimates')
      .select('*')
      .eq('task_id', task_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let items = [];
    let totalCost = 0;

    if (estimate) {
      console.log('[OPTIMIZATION-CALCULATE] Using estimate from job_estimates');
      items = estimate.cost_breakdown || [];
      totalCost = estimate.final_cost || 0;
    } else {
      console.log('[OPTIMIZATION-CALCULATE] No estimate found, using fallback');
      totalCost = 1000;
      items = [{
        name: 'SEO Optimization Package',
        description: 'Complete SEO optimization',
        count: 1,
        pricePerUnit: totalCost,
        totalPrice: totalCost
      }];
    }

    // Get user_id from auth header if available
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    
    if (authHeader) {
      const { data: { user } } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
      userId = user?.id || null;
    }

    // Save calculation results to optimization_jobs table
    const { error: saveError } = await supabaseClient
      .from('optimization_jobs')
      .upsert({
        task_id: task_id,
        user_id: userId,
        status: 'completed',
        cost: totalCost,
        result_data: { 
          estimate_id: estimate?.id || null,
          items,
          total: totalCost
        },
        options: null
      }, {
        onConflict: 'task_id'
      });

    if (saveError) {
      console.error('[OPTIMIZATION-CALCULATE] Failed to save results:', saveError);
      // Don't throw - still return data to user
    } else {
      console.log('[OPTIMIZATION-CALCULATE] Results saved to optimization_jobs');
    }

    // Автоматически генерируем PDF отчёт
    console.log('[OPTIMIZATION-CALCULATE] ✅ Results saved, triggering PDF generation...');
    
    try {
      const { data: pdfData, error: pdfError } = await supabaseClient.functions.invoke('pdf-report-generate', {
        body: { task_id: task_id }
      });
      
      if (pdfError) {
        console.error('[OPTIMIZATION-CALCULATE] ❌ Failed to generate PDF:', pdfError);
      } else {
        console.log('[OPTIMIZATION-CALCULATE] ✅ PDF generated:', pdfData);
      }
    } catch (error) {
      console.error('[OPTIMIZATION-CALCULATE] ❌ Exception in PDF generation:', error);
    }

    return new Response(
      JSON.stringify({
        success: true,
        totalCost: parseFloat(totalCost.toFixed(2)),
        items: items,
        pageCount: pageCount,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('[OPTIMIZATION-CALCULATE] Error occurred:', error);
    console.error('[OPTIMIZATION-CALCULATE] Error message:', error.message);
    console.error('[OPTIMIZATION-CALCULATE] Error stack:', error.stack);
    
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
