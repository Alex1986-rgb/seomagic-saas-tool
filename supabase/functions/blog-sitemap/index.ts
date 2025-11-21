import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Mock blog posts data - matches frontend structure
const mockBlogPosts = [
  {
    id: 1,
    title: "Полное руководство по техническому SEO в 2024",
    date: "2024-03-15",
    tags: ["SEO", "Технический SEO", "Гайды"]
  },
  {
    id: 2,
    title: "Как оптимизировать скорость загрузки сайта",
    date: "2024-03-10",
    tags: ["Производительность", "Core Web Vitals"]
  },
  {
    id: 3,
    title: "SEO для e-commerce: Лучшие практики 2024",
    date: "2024-03-05",
    tags: ["E-commerce", "SEO"]
  }
];

const generateBlogSitemap = (baseUrl: string): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${mockBlogPosts.map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.id}</loc>
    <lastmod>${new Date(post.date).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <news:news>
      <news:publication>
        <news:name>SeoMarket</news:name>
        <news:language>ru</news:language>
      </news:publication>
      <news:publication_date>${new Date(post.date).toISOString()}</news:publication_date>
      <news:title>${post.title}</news:title>
      <news:keywords>${post.tags.join(', ')}</news:keywords>
    </news:news>
  </url>`).join('')}
</urlset>`;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    
    const sitemap = generateBlogSitemap(baseUrl);
    
    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      }
    });
  } catch (error) {
    console.error('Error generating blog sitemap:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate blog sitemap' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
