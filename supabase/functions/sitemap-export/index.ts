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

    const { task_id, format } = await req.json();

    if (!task_id || !format) {
      throw new Error('task_id and format are required');
    }

    console.log(`Exporting sitemap for task: ${task_id} in ${format} format`);

    // Get audit results
    const { data: auditResult, error: auditError } = await supabaseClient
      .from('audit_results')
      .select('audit_data')
      .eq('task_id', task_id)
      .single();

    if (auditError || !auditResult) {
      throw new Error('Audit results not found');
    }

    // Extract URLs from audit data (simplified)
    const urls = auditResult.audit_data?.pages?.map((page: any) => page.url) || [];

    // Generate sitemap content
    let sitemapContent: string;
    let contentType: string;
    let filename: string;

    if (format === 'xml') {
      sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url: string) => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;
      contentType = 'application/xml';
      filename = `sitemap-${task_id}.xml`;
    } else if (format === 'html') {
      sitemapContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sitemap</title>
</head>
<body>
  <h1>Sitemap</h1>
  <ul>
${urls.map((url: string) => `    <li><a href="${url}">${url}</a></li>`).join('\n')}
  </ul>
</body>
</html>`;
      contentType = 'text/html';
      filename = `sitemap-${task_id}.html`;
    } else {
      throw new Error('Unsupported format. Use xml or html');
    }

    // Save to storage
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('sitemaps')
      .upload(filename, sitemapContent, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error('Failed to save sitemap');
    }

    // Get public URL
    const { data: publicUrlData } = supabaseClient.storage
      .from('sitemaps')
      .getPublicUrl(uploadData.path);

    return new Response(
      JSON.stringify({
        success: true,
        url: publicUrlData.publicUrl,
        storage_path: uploadData.path,
        message: 'Sitemap exported successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in sitemap-export:', error);
    
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
