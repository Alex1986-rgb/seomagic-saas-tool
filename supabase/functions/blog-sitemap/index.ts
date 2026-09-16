import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Карта статей блога.
 *
 * Что было не так:
 *   * в карте стояли три статьи, которых на сайте нет («Полное руководство по
 *     техническому SEO в 2024» и др.), с выдуманными датами и адресами /blog/1–3,
 *     под которыми сайт показывает совсем другие тексты;
 *   * адрес сайта брался из адреса запроса — в карту попадал домен Supabase,
 *     где страниц сайта нет;
 *   * у каждой статьи был блок Google News (news:publication «SeoMarket»), хотя
 *     издание в Google News не зарегистрировано, а статьи не новостные.
 *
 * Теперь в карте ровно те статьи, что показывает сайт: список ниже повторяет
 * src/data/mockData.ts (mockBlogPosts) — номер статьи и дату из её карточки.
 * Импортировать файл напрямую функция не может: он собирается Vite и тянет
 * алиасы «@/», которых в Deno нет. Добавили или убрали статью на сайте —
 * поправьте и этот список. Нет статей — функция честно отдаёт пустую карту.
 *
 * Адрес сайта — из секрета SITE_URL, адреса страниц — со слэшем на конце, как их
 * отдаёт GitHub Pages (правила те же, что в generate-sitemap).
 */
const DEFAULT_SITE_URL = 'https://alex1986-rgb.github.io/seomagic-saas-tool';

interface BlogSitemapEntry {
  /** Номер статьи — часть адреса /blog/<id>/. */
  id: number;
  /** Дата из карточки статьи на сайте, ГГГГ-ММ-ДД. */
  date: string;
}

/** Те же статьи и даты, что в src/data/mockData.ts. */
const blogPosts: BlogSitemapEntry[] = [
  { id: 1, date: '2025-05-15' },
  { id: 2, date: '2025-05-10' },
  { id: 3, date: '2025-05-05' },
  { id: 4, date: '2025-05-01' },
  { id: 5, date: '2025-04-25' },
  { id: 6, date: '2025-04-20' },
];

function siteBaseUrl(): string {
  const raw = (Deno.env.get('SITE_URL') ?? '').trim() || DEFAULT_SITE_URL;
  return raw.replace(/\/+$/, '');
}

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

/** Дата в формате карты или null, если в списке опечатка. */
const lastmodOf = (date: string): string | null =>
  /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)) ? date : null;

const generateBlogSitemap = (baseUrl: string): string => {
  const urlEntries = blogPosts.map((post) => {
    const lastmod = lastmodOf(post.date);
    return `
  <url>
    <loc>${escapeXml(`${baseUrl}/blog/${post.id}/`)}</loc>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ''}
  </url>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}
</urlset>`;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const sitemap = generateBlogSitemap(siteBaseUrl());

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
