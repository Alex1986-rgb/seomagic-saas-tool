
import { saveAs } from 'file-saver';
import { CrawlTask } from './types';

/**
 * Generates XML sitemap from a list of URLs
 */
export const generateSitemapXml = (domain: string, urls: string[]): string => {
  const header = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const footer = '</urlset>';
  
  const urlsXml = urls.map(url => `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');
  
  return `${header}${urlsXml}\n${footer}`;
};

/**
 * Generates sample URLs for demonstration purposes
 */
export const generateSampleUrls = (baseUrl: string, count: number): string[] => {
  const urls: string[] = [baseUrl];
  const sections = ['about', 'contact', 'services', 'blog', 'products', 'faq'];
  
  // Add main sections
  for (const section of sections) {
    urls.push(`${baseUrl}/${section}`);
  }
  
  // Add blog pages
  for (let i = 0; i < Math.min(count / 2, 50); i++) {
    urls.push(`${baseUrl}/blog/post-${i + 1}`);
  }
  
  // Add product pages
  for (let i = 0; i < Math.min(count / 2, 200); i++) {
    urls.push(`${baseUrl}/products/product-${i + 1}`);
  }
  
  // Add random pages
  while (urls.length < count) {
    const randomSection = sections[Math.floor(Math.random() * sections.length)];
    const randomPage = `page-${Math.floor(Math.random() * 1000)}`;
    urls.push(`${baseUrl}/${randomSection}/${randomPage}`);
  }
  
  return urls.slice(0, count);
};

/**
 * Handles the download of a sitemap XML file
 */
export const downloadSitemap = async (task: CrawlTask): Promise<void> => {
  if (task.status !== 'completed') {
    throw new Error('Task is not completed yet');
  }
  
  // Используем task.urls или task.results?.urls
  const urls = task.urls || task.results?.urls || [];
  const domain = task.domain || new URL(task.url.startsWith('http') ? task.url : `https://${task.url}`).hostname;
  
  // Generate XML sitemap
  const xml = generateSitemapXml(domain, urls);
  
  // Create and download file
  const blob = new Blob([xml], { type: 'application/xml' });
  saveAs(blob, 'sitemap.xml');
};
