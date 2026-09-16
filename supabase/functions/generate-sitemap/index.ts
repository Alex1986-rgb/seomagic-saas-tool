import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Карта нашего сайта.
 *
 * Опубликованный sitemap.xml на GitHub Pages собирает scripts/prerender.cjs по
 * пререндеренным страницам. Правило в public/_redirects, которое вело сюда
 * /sitemap.xml, убрано (на Pages оно не работает); функция пригодится только
 * хостингу, где такое переписывание настроят заново. Правила у них общие:
 *   * адрес сайта — из секрета SITE_URL. Раньше он брался из адреса запроса, то
 *     есть в карту попадал домен Supabase, где страниц сайта нет;
 *   * сайт живёт на подпути, а GitHub Pages отдаёт «/pricing» переадресацией на
 *     «/pricing/», поэтому в карте — конечные адреса со слэшем;
 *   * в карте только открытые для индексации страницы. /channel, /webinars,
 *     /careers, /api-docs, /team закрыты noindex, страницы кабинета и админки — вход
 *     по логину: такие адреса в карте дали бы поисковику противоречивый сигнал.
 */
const DEFAULT_SITE_URL = 'https://alex1986-rgb.github.io/seomagic-saas-tool';

interface SitemapPage {
  url: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

const pages: SitemapPage[] = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/site-audit', priority: 0.9, changefreq: 'daily' },
  { url: '/features', priority: 0.8, changefreq: 'weekly' },
  { url: '/pricing', priority: 0.9, changefreq: 'weekly' },
  { url: '/about', priority: 0.7, changefreq: 'monthly' },
  { url: '/contact', priority: 0.6, changefreq: 'monthly' },
  { url: '/blog', priority: 0.7, changefreq: 'weekly' },
  { url: '/sitemap', priority: 0.5, changefreq: 'monthly' },
];

/** Закрытые от индексации и служебные адреса: в карту не попадают никогда. */
const EXCLUDED_PREFIXES = [
  '/channel', '/webinars', '/careers', '/api-docs', '/team',
  '/admin', '/dashboard', '/profile', '/client-profile', '/settings', '/reports',
  '/audit-history', '/audits', '/optimizations', '/auth', '/shared-estimate',
];

const isExcluded = (path: string): boolean =>
  EXCLUDED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));

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

/** Конечный адрес страницы — со слэшем на конце, как его отдаёт хостинг. */
const pageUrl = (baseUrl: string, path: string): string =>
  path === '/' ? `${baseUrl}/` : `${baseUrl}${encodeURI(path.replace(/\/+$/, ''))}/`;

const generateSitemap = (baseUrl: string): string => {
  const lastmod = new Date().toISOString().split('T')[0];

  const urlEntries = pages
    .filter((page) => !isExcluded(page.url))
    .map(page => `
  <url>
    <loc>${escapeXml(pageUrl(baseUrl, page.url))}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const sitemap = generateSitemap(siteBaseUrl());

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate sitemap' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
