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

    const { task_id } = await req.json();

    if (!task_id) {
      throw new Error('task_id is required');
    }

    // Get audit results
    const { data: result, error: resultError } = await supabaseClient
      .from('audit_results')
      .select('audit_data, page_count')
      .eq('task_id', task_id)
      .single();

    if (resultError || !result) {
      throw new Error('Audit results not found');
    }

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
    console.error('Error in optimization-calculate:', error);
    
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
