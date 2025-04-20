
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export function useSitemapExport() {
  const generateSitemapFile = (domain: string, urls: string[]) => {
    const now = new Date().toISOString().split('T')[0];
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<?xml-stylesheet type="text/xsl" href="https://www.sitemaps.org/xsl/sitemap.xsl"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    urls.forEach(url => {
      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(url)}</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    
    return xml;
  };
  
  const downloadSitemap = (sitemap: string, domain: string) => {
    const blob = new Blob([sitemap], { type: 'application/xml' });
    saveAs(blob, `${domain.replace(/[^a-z0-9]/gi, '-')}-sitemap.xml`);
  };
  
  const downloadAllData = (urls: string[], domain: string) => {
    // Generate sitemap
    const sitemap = generateSitemapFile(domain, urls);
    
    // Create CSV of URLs
    const csv = urls.join('\n');
    
    // Create JSON data
    const jsonData = {
      domain,
      scannedAt: new Date().toISOString(),
      totalUrls: urls.length,
      urls
    };
    
    // Create ZIP file
    const zip = new JSZip();
    zip.file("sitemap.xml", sitemap);
    zip.file("urls.csv", csv);
    zip.file("scan-data.json", JSON.stringify(jsonData, null, 2));
    
    // Generate and download ZIP
    zip.generateAsync({ type: "blob" }).then(function(content) {
      saveAs(content, `${domain.replace(/[^a-z0-9]/gi, '-')}-site-data.zip`);
    });
  };
  
  const downloadReport = (crawler: any, domain: string) => {
    // In a real implementation, this would generate a detailed report
    // For now, we'll create a simple JSON report
    
    const report = {
      domain,
      scannedAt: new Date().toISOString(),
      summary: {
        totalPages: crawler ? crawler.getStats().visited : 0,
        crawlTime: "N/A", // Would be calculated in real implementation
        issues: []
      }
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    saveAs(blob, `${domain.replace(/[^a-z0-9]/gi, '-')}-report.json`);
  };
  
  const createOptimizedSiteZip = async (domain: string, content: any[], prompt: string) => {
    const zip = new JSZip();
    
    // Add README
    zip.file("README.txt", `Optimized site for ${domain}\nGenerated on: ${new Date().toISOString()}\nOptimization prompt: ${prompt}`);
    
    // Add a simple index.html
    const indexContent = `<!DOCTYPE html>
<html>
<head>
  <title>Optimized site for ${domain}</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 1000px; margin: 0 auto; padding: 20px; }
    .page-item { border: 1px solid #eee; margin-bottom: 20px; padding: 15px; border-radius: 4px; }
    h1, h2 { color: #333; }
    a { color: #0066cc; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Optimized Site: ${domain}</h1>
    <p>This package contains ${content.length} optimized pages.</p>
    
    <h2>Pages</h2>
    <div class="pages-list">
      ${content.map(page => `
        <div class="page-item">
          <h3><a href="${page.url}" target="_blank">${page.title}</a></h3>
          <p><strong>URL:</strong> ${page.url}</p>
          <p><strong>Meta Description:</strong> ${page.metaTags?.description || 'Not available'}</p>
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>`;
    
    zip.file("index.html", indexContent);
    
    // Create a folder for individual pages
    const pagesFolder = zip.folder("pages");
    
    // Add optimized pages
    content.forEach((page, index) => {
      const pageContent = `<!DOCTYPE html>
<html>
<head>
  <title>${page.title}</title>
  <meta charset="UTF-8">
  <meta name="description" content="${page.metaTags?.description || ''}">
  <meta name="keywords" content="${page.metaTags?.keywords || ''}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <h1>${page.title}</h1>
  ${page.content}
  <p><a href="index.html">Back to index</a></p>
</body>
</html>`;
      
      pagesFolder?.file(`page-${index + 1}.html`, pageContent);
    });
    
    // Generate sitemap
    const sitemap = generateSitemapFile(domain, content.map(page => page.url));
    zip.file("sitemap.xml", sitemap);
    
    return await zip.generateAsync({ type: "blob" });
  };
  
  const downloadOptimizedSite = (blob: Blob, domain: string) => {
    saveAs(blob, `${domain.replace(/[^a-z0-9]/gi, '-')}-optimized.zip`);
  };
  
  // Helper function to escape XML special characters
  const escapeXml = (unsafe: string) => {
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
}
