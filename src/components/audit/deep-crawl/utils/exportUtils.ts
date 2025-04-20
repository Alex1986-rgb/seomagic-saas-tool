
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export function useSitemapExport() {
  const generateSitemapFile = (domain: string, pageCount: number): string => {
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <!-- Generated for ${domain} with ${pageCount} pages -->`;
    
    const footer = `</urlset>`;
    
    const urls = localStorage.getItem(`crawl_urls_${domain}`);
    let urlsXml = '';
    
    if (urls) {
      const urlList = JSON.parse(urls) as string[];
      urlsXml = urlList.map(url => `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <priority>0.8</priority>
  </url>`).join('');
    }
    
    return `${header}${urlsXml}
${footer}`;
  };

  const downloadSitemap = (sitemap: string | null, domain: string) => {
    if (!sitemap) {
      const generatedSitemap = generateSitemapFile(domain, 0);
      const blob = new Blob([generatedSitemap], { type: 'application/xml' });
      saveAs(blob, `sitemap_${domain.replace(/\./g, '_')}.xml`);
    } else {
      const blob = new Blob([sitemap], { type: 'application/xml' });
      saveAs(blob, `sitemap_${domain.replace(/\./g, '_')}.xml`);
    }
  };
  
  const downloadAllData = (urls: string[], domain: string) => {
    if (!urls || urls.length === 0) return;
    
    const csvContent = "URL\n" + urls.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `urls_${domain.replace(/\./g, '_')}.csv`);
  };
  
  const downloadReport = async (crawler: any, domain: string) => {
    // Prepare data for report
    const data = {
      domain,
      scanDate: new Date().toISOString(),
      pageCount: crawler?.visited?.size || 0,
      urls: Array.from(crawler?.visited || []).slice(0, 1000),
      stats: crawler?.getStats() || { visited: 0, queued: 0 }
    };
    
    // Convert to JSON
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    saveAs(blob, `crawl_report_${domain.replace(/\./g, '_')}.json`);
  };
  
  const createOptimizedSiteZip = async (domain: string, content: any[], prompt: string): Promise<Blob> => {
    const zip = new JSZip();
    
    // Add README file
    zip.file("README.txt", 
      `Оптимизированная версия сайта ${domain}
Создано: ${new Date().toLocaleString()}
Запрос для оптимизации: "${prompt}"

Эта папка содержит оптимизированную версию вашего сайта.
Для просмотра откройте index.html в вашем браузере.`);
    
    // Add index.html with list of optimized pages
    let indexContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Оптимизированный сайт - ${domain}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; }
    .page-list { margin-top: 20px; }
    .page-item { padding: 10px; border-bottom: 1px solid #eee; }
    .page-title { font-weight: bold; }
    .page-url { color: #0066cc; text-decoration: none; }
    .page-url:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Оптимизированный сайт - ${domain}</h1>
  <p>Ниже представлен список оптимизированных страниц:</p>
  <div class="page-list">`;
    
    // Add each page as HTML
    content.forEach((page, index) => {
      const filename = `pages/page_${index}.html`;
      
      // Add to index
      indexContent += `
    <div class="page-item">
      <div class="page-title">${page.title}</div>
      <a href="${filename}" class="page-url" target="_blank">${page.url}</a>
    </div>`;
      
      // Create HTML for this page
      const pageHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${page.title}</title>
  <meta name="description" content="${page.metaTags?.description || ''}">
  <meta name="keywords" content="${page.metaTags?.keywords || ''}">
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; }
    .content { margin-top: 20px; line-height: 1.6; }
    .back { margin-top: 30px; }
    .back a { color: #0066cc; text-decoration: none; }
    .back a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>${page.title}</h1>
  <div class="content">
    ${page.content}
  </div>
  <div class="back">
    <a href="../index.html">← Вернуться к списку страниц</a>
  </div>
</body>
</html>`;
      
      zip.file(filename, pageHtml);
    });
    
    // Close index.html
    indexContent += `
  </div>
</body>
</html>`;
    
    zip.file("index.html", indexContent);
    
    // Generate ZIP file
    const blob = await zip.generateAsync({ type: "blob" });
    return blob;
  };
  
  const downloadOptimizedSite = (blob: Blob, domain: string) => {
    saveAs(blob, `optimized_site_${domain.replace(/\./g, '_')}.zip`);
  };

  return {
    generateSitemapFile,
    downloadSitemap,
    downloadAllData,
    downloadReport,
    createOptimizedSiteZip,
    downloadOptimizedSite
  };
}
