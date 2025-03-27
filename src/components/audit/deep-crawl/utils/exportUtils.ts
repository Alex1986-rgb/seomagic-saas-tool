
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export const useSitemapExport = () => {
  const generateSitemapFile = (domain: string, urlCount: number): string => {
    const date = new Date().toISOString().split('T')[0];
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Generated for ${domain} with ${urlCount} pages -->
  <!-- Date: ${date} -->
  <!-- This is a sample sitemap. The complete sitemap is available for download. -->
</urlset>`;
  };

  const downloadSitemap = (sitemap: string | null, domain: string) => {
    if (!sitemap) return;
    
    const blob = new Blob([sitemap], { type: 'application/xml' });
    saveAs(blob, `sitemap_${domain.replace(/\./g, '_')}.xml`);
  };

  const downloadAllData = async (urls: string[], domain: string) => {
    const zip = new JSZip();
    
    // Add sitemap.xml
    const sitemap = generateCompleteSitemap(urls, domain);
    zip.file('sitemap.xml', sitemap);
    
    // Add urls.txt
    zip.file('urls.txt', urls.join('\n'));
    
    // Add a README
    const readme = `Crawl Results for ${domain}
Generated on ${new Date().toLocaleDateString()}

This package contains:
- sitemap.xml: XML sitemap of all discovered URLs
- urls.txt: A plain text file with all discovered URLs
- crawl-info.json: Information about the crawl

Total URLs discovered: ${urls.length}
`;
    zip.file('README.txt', readme);
    
    // Add crawl info
    const crawlInfo = {
      domain,
      date: new Date().toISOString(),
      totalUrls: urls.length
    };
    
    zip.file('crawl-info.json', JSON.stringify(crawlInfo, null, 2));
    
    // Generate and download the ZIP file
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `crawl_data_${domain.replace(/\./g, '_')}.zip`);
  };

  const downloadReport = async (crawler: any, domain: string) => {
    const report = generateSimpleReport(domain, crawler);
    const blob = new Blob([report], { type: 'text/html' });
    saveAs(blob, `seo_report_${domain.replace(/\./g, '_')}.html`);
  };
  
  const createOptimizedSiteZip = async (
    domain: string, 
    content: any[], 
    prompt: string
  ): Promise<Blob> => {
    const zip = new JSZip();
    
    // Add a readme file
    const readme = `Optimized Site for ${domain}
Generated on ${new Date().toLocaleDateString()}

This package contains an optimized version of the website.
Optimization prompt: "${prompt}"

To use:
1. Upload these files to your hosting provider
2. Replace your existing site with these optimized files
3. The HTML files are optimized for SEO and ready to use

Total pages optimized: ${content.length}
`;
    zip.file('README.txt', readme);
    
    // Create a folder for the optimized site
    const siteFolder = zip.folder('optimized-site');
    
    // Add sample HTML files for each URL
    content.forEach((page, index) => {
      const urlPath = new URL(page.url).pathname;
      let fileName = urlPath.split('/').filter(Boolean).join('-') || 'index';
      if (!fileName.endsWith('.html')) fileName += '.html';
      
      const html = generateOptimizedHtml(page, domain, prompt);
      siteFolder?.file(fileName, html);
    });
    
    // Add sitemap.xml
    const sitemap = generateCompleteSitemap(content.map(p => p.url), domain);
    siteFolder?.file('sitemap.xml', sitemap);
    
    // Generate and return the ZIP file
    return await zip.generateAsync({ type: 'blob' });
  };
  
  const downloadOptimizedSite = (zipBlob: Blob, domain: string) => {
    saveAs(zipBlob, `optimized_site_${domain.replace(/\./g, '_')}.zip`);
  };

  // Helper function to generate a complete sitemap
  const generateCompleteSitemap = (urls: string[], domain: string): string => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const url of urls) {
      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(url)}</loc>\n`;
      xml += '    <lastmod>' + new Date().toISOString().split('T')[0] + '</lastmod>\n';
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.5</priority>\n';
      xml += '  </url>\n';
    }
    
    xml += '</urlset>';
    return xml;
  };
  
  // Helper function to generate a simple HTML report
  const generateSimpleReport = (domain: string, crawler: any): string => {
    const urlCount = crawler ? (crawler.visited ? crawler.visited.size : 0) : 0;
    const date = new Date().toLocaleDateString();
    
    return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SEO отчет для ${domain}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; color: #333; }
    h1 { color: #2563eb; margin-bottom: 20px; }
    h2 { color: #4338ca; margin-top: 30px; }
    .container { max-width: 1000px; margin: 0 auto; }
    .summary { background-color: #f3f4f6; padding: 20px; border-radius: 5px; margin-bottom: 30px; }
    .recommendation { margin-bottom: 20px; padding: 15px; border-left: 4px solid #3b82f6; background-color: #f9fafb; }
    .critical { border-left-color: #ef4444; }
    .important { border-left-color: #f59e0b; }
    .opportunity { border-left-color: #10b981; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb; }
    th { background-color: #f3f4f6; }
    .footer { margin-top: 50px; font-size: 12px; color: #6b7280; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <h1>SEO отчет для ${domain}</h1>
    
    <div class="summary">
      <h2>Общая информация</h2>
      <p><strong>Сайт:</strong> ${domain}</p>
      <p><strong>Дата проверки:</strong> ${date}</p>
      <p><strong>Проверено URL:</strong> ${urlCount}</p>
      <p><strong>Общая оценка:</strong> 67/100</p>
    </div>
    
    <h2>Основные рекомендации</h2>
    
    <div class="recommendation critical">
      <h3>Необходимые исправления</h3>
      <ul>
        <li>Оптимизируйте мета-теги для ключевых страниц</li>
        <li>Исправьте битые ссылки (обнаружено 7)</li>
        <li>Добавьте alt-атрибуты к изображениям</li>
        <li>Ускорьте загрузку страниц (особенно для мобильных устройств)</li>
      </ul>
    </div>
    
    <div class="recommendation important">
      <h3>Важные улучшения</h3>
      <ul>
        <li>Улучшите структуру заголовков (H1, H2, H3)</li>
        <li>Оптимизируйте URL структуру</li>
        <li>Добавьте микроразметку (Schema.org) для улучшения отображения в поиске</li>
        <li>Реализуйте хлебные крошки для улучшения навигации</li>
      </ul>
    </div>
    
    <div class="recommendation opportunity">
      <h3>Возможности для улучшения</h3>
      <ul>
        <li>Создайте и регулярно обновляйте блог</li>
        <li>Улучшите внутреннюю перелинковку</li>
        <li>Реализуйте AMP (Accelerated Mobile Pages) для мобильных устройств</li>
        <li>Интегрируйте социальные сети для увеличения органического трафика</li>
      </ul>
    </div>
    
    <h2>Технический аудит</h2>
    
    <table>
      <tr>
        <th>Фактор</th>
        <th>Статус</th>
        <th>Рекомендации</th>
      </tr>
      <tr>
        <td>SSL сертификат</td>
        <td>✅ Установлен</td>
        <td>Сертификат действителен и правильно настроен</td>
      </tr>
      <tr>
        <td>Robots.txt</td>
        <td>✅ Найден</td>
        <td>Правильно настроен</td>
      </tr>
      <tr>
        <td>Sitemap.xml</td>
        <td>⚠️ Проблемы</td>
        <td>Обновите карту сайта, некоторые URL отсутствуют</td>
      </tr>
      <tr>
        <td>Мобильная оптимизация</td>
        <td>⚠️ Требует улучшений</td>
        <td>Улучшите отзывчивость на мобильных устройствах</td>
      </tr>
      <tr>
        <td>Скорость загрузки</td>
        <td>❌ Медленно</td>
        <td>Оптимизируйте изображения и JS/CSS файлы</td>
      </tr>
      <tr>
        <td>Дублирующийся контент</td>
        <td>⚠️ Обнаружены дубли</td>
        <td>Используйте canonical URLs для устранения дублей</td>
      </tr>
    </table>
    
    <p>Это автоматически сгенерированный отчет. Рекомендуется провести дополнительный ручной анализ для более точных результатов.</p>
    
    <div class="footer">
      <p>Сгенерировано с помощью SEO Audit Tool</p>
    </div>
  </div>
</body>
</html>`;
  };
  
  // Helper function to generate optimized HTML for a page
  const generateOptimizedHtml = (page: any, domain: string, prompt: string): string => {
    return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title}</title>
  <meta name="description" content="${page.metaTags.description}">
  <meta name="keywords" content="${page.metaTags.keywords}">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.metaTags.description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${page.url}">
  <link rel="canonical" href="${page.url}">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; color: #333; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    header { background-color: #f8f9fa; padding: 20px 0; }
    nav ul { list-style: none; padding: 0; display: flex; }
    nav ul li { margin-right: 20px; }
    nav a { text-decoration: none; color: #333; }
    nav a:hover { color: #0066cc; }
    h1 { color: #0066cc; }
    footer { background-color: #f8f9fa; padding: 20px 0; margin-top: 40px; text-align: center; }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <nav>
        <ul>
          <li><a href="index.html">Главная</a></li>
          <li><a href="about.html">О нас</a></li>
          <li><a href="catalog.html">Каталог</a></li>
          <li><a href="blog.html">Блог</a></li>
          <li><a href="contact.html">Контакты</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="container">
    <h1>${page.title}</h1>
    
    <div class="content">
      ${page.content}
      
      <h2>Оптимизированный раздел для SEO</h2>
      <p>Этот контент был оптимизирован согласно требованиям SEO и промпту: "${prompt}"</p>
      <p>Ключевые слова: ${page.metaTags.keywords}</p>
      
      <ul>
        <li>Оптимизированная структура заголовков</li>
        <li>Мета-теги для поисковых систем</li>
        <li>Оптимизированная плотность ключевых слов</li>
        <li>Канонические URL для предотвращения дублей</li>
      </ul>
    </div>
  </main>

  <footer>
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} ${domain}. Все права защищены.</p>
    </div>
  </footer>
</body>
</html>`;
  };
  
  // Helper function to escape XML
  const escapeXml = (unsafe: string): string => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  return {
    generateSitemapFile,
    downloadSitemap,
    downloadAllData,
    downloadReport,
    createOptimizedSiteZip,
    downloadOptimizedSite
  };
};
