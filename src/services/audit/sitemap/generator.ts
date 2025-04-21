
export interface SitemapOptions {
  includeStylesheet?: boolean;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Генерирует XML-карту сайта из списка URL
 */
export function generateSitemapXml(urls: string[], options: SitemapOptions = {}): string {
  const {
    includeStylesheet = true,
    lastmod = new Date().toISOString().split('T')[0],
    changefreq = 'monthly',
    priority = 0.8
  } = options;
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  
  // Добавляем XSLT для красивого отображения в браузере
  if (includeStylesheet) {
    xml += '<?xml-stylesheet type="text/xsl" href="https://seomarket.ru/sitemap.xsl"?>\n';
  }
  
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Добавляем все URL в карту сайта
  for (const url of urls) {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXML(url)}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += '  </url>\n';
  }
  
  xml += '</urlset>';
  
  return xml;
}

/**
 * Экранирует специальные символы в XML
 */
function escapeXML(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Генерирует карту сайта для большого количества URL
 * с разделением на несколько файлов
 */
export function generateSitemapIndex(
  sitemapUrls: string[],
  baseUrl: string,
  maxUrlsPerFile: number = 50000
): { index: string; sitemaps: { filename: string; content: string }[] } {
  const sitemaps: { filename: string; content: string }[] = [];
  const today = new Date().toISOString().split('T')[0];
  
  // Разделяем URL на группы
  for (let i = 0; i < sitemapUrls.length; i += maxUrlsPerFile) {
    const urlsChunk = sitemapUrls.slice(i, i + maxUrlsPerFile);
    const filename = `sitemap-${i / maxUrlsPerFile + 1}.xml`;
    
    sitemaps.push({
      filename,
      content: generateSitemapXml(urlsChunk)
    });
  }
  
  // Генерируем индекс карт сайта
  let indexXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  indexXml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  for (const sitemap of sitemaps) {
    indexXml += '  <sitemap>\n';
    indexXml += `    <loc>${baseUrl}${sitemap.filename}</loc>\n`;
    indexXml += `    <lastmod>${today}</lastmod>\n`;
    indexXml += '  </sitemap>\n';
  }
  
  indexXml += '</sitemapindex>';
  
  return {
    index: indexXml,
    sitemaps
  };
}
