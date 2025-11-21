import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Pricing per item
const PRICING = {
  metaTags: 0.50,
  headings: 0.30,
  images: 0.20,
  contentOptimization: 2.00,
  sitemapGeneration: 1.00,
};

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

    console.log('[OPTIMIZATION-CALCULATE] Found audit results, page_count:', result.page_count);

    const pageCount = result.page_count || 1;
    const auditData = result.audit_data;

    // Calculate optimization items and costs
    const items = [];
    let totalCost = 0;

    // Meta tags optimization
    const metaIssues = auditData?.details?.seo?.items?.filter(
      (item: any) => item.id.includes('meta') && item.status !== 'good'
    ).length || 0;
    
    if (metaIssues > 0) {
      const metaCost = metaIssues * PRICING.metaTags;
      totalCost += metaCost;
      items.push({
        name: 'Meta Tags Optimization',
        description: 'Fix missing or incorrect meta tags (title, description)',
        count: metaIssues,
        pricePerUnit: PRICING.metaTags,
        totalPrice: metaCost,
        type: 'meta',
      });
    }

    // Headings optimization
    const headingIssues = auditData?.details?.seo?.items?.filter(
      (item: any) => item.id.includes('heading') && item.status !== 'good'
    ).length || 0;
    
    if (headingIssues > 0) {
      const headingCost = headingIssues * PRICING.headings;
      totalCost += headingCost;
      items.push({
        name: 'Headings Structure',
        description: 'Optimize H1-H6 hierarchy and structure',
        count: headingIssues,
        pricePerUnit: PRICING.headings,
        totalPrice: headingCost,
        type: 'headings',
      });
    }

    // Images optimization
    const imageIssues = auditData?.details?.performance?.items?.filter(
      (item: any) => item.id.includes('image') && item.status !== 'good'
    ).length || 0;
    
    if (imageIssues > 0) {
      const imageCost = imageIssues * PRICING.images;
      totalCost += imageCost;
      items.push({
        name: 'Image Alt Tags',
        description: 'Add missing alt attributes to images',
        count: imageIssues,
        pricePerUnit: PRICING.images,
        totalPrice: imageCost,
        type: 'images',
      });
    }

    // Content optimization
    const contentCost = pageCount * PRICING.contentOptimization;
    totalCost += contentCost;
    items.push({
      name: 'AI Content Optimization',
      description: 'AI-powered SEO content improvements',
      count: pageCount,
      pricePerUnit: PRICING.contentOptimization,
      totalPrice: contentCost,
      type: 'content',
    });

    // Sitemap generation
    totalCost += PRICING.sitemapGeneration;
    items.push({
      name: 'Sitemap Generation',
      description: 'Generate XML sitemap for search engines',
      count: 1,
      pricePerUnit: PRICING.sitemapGeneration,
      totalPrice: PRICING.sitemapGeneration,
      type: 'sitemap',
    });

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
      .insert({
        task_id: task_id,
        user_id: userId, // Now supports NULL for anonymous audits
        status: 'pending',
        cost: parseFloat(totalCost.toFixed(2)),
        result_data: { items, pageCount },
        options: null
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
