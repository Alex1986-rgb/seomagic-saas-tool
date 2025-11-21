/**
 * Sitemap generator utility
 * Generates XML sitemap for SEO
 */

interface SitemapPage {
  url: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  lastmod?: string;
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

export const generateSitemap = (baseUrl: string = 'https://seomarket.app'): string => {
  const lastmod = new Date().toISOString().split('T')[0];
  
  const urlEntries = pages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
};

export const sitemapPages = pages;
