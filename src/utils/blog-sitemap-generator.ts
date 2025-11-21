import { mockBlogPosts } from '@/data/mockData';

export const generateBlogSitemap = (baseUrl: string = 'https://seomarket.app'): string => {
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
