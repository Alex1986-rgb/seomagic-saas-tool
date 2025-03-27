
import { saveAs } from 'file-saver';
import axios from 'axios';
import * as cheerio from 'cheerio';
import JSZip from 'jszip';

interface SitemapOptions {
  maxPages: number;
  maxDepth: number;
  includeStylesheet: boolean;
}

export class SimpleSitemapCreator {
  private visited = new Set<string>();
  private queue: { url: string; depth: number }[] = [];
  private domain = '';
  private baseUrl = '';
  private options: SitemapOptions;
  private shouldStop = false;
  private productPatterns: RegExp[] = [
    /\/(product|products|item|items|tovar|tovary|good|goods|produkt|produkty)/i,
    /\/(catalog|katalog)\/.*\/(.*)\/?$/i,
    /\/p\/[a-z0-9-]+\/?$/i,
    /\/category\/.*\/[a-z0-9-]+\/?$/i
  ];

  constructor(options?: Partial<SitemapOptions>) {
    this.options = {
      maxPages: options?.maxPages ?? 500,
      maxDepth: options?.maxDepth ?? 5,
      includeStylesheet: options?.includeStylesheet ?? true
    };
  }

  async crawl(
    url: string,
    progressCallback?: (scanned: number, total: number, currentUrl: string) => void
  ): Promise<string[]> {
    this.shouldStop = false;
    this.visited.clear();
    
    // Normalize URL
    this.baseUrl = url.startsWith('http') ? url : `https://${url}`;
    
    try {
      const urlObj = new URL(this.baseUrl);
      this.domain = urlObj.hostname;
    } catch (error) {
      throw new Error('Invalid URL');
    }
    
    this.queue = [{ url: this.baseUrl, depth: 0 }];
    
    // Start crawling
    while (this.queue.length > 0 && this.visited.size < this.options.maxPages && !this.shouldStop) {
      const { url: currentUrl, depth } = this.queue.shift()!;
      
      if (this.visited.has(currentUrl) || depth > this.options.maxDepth) {
        continue;
      }
      
      this.visited.add(currentUrl);
      
      if (progressCallback) {
        progressCallback(this.visited.size, this.options.maxPages, currentUrl);
      }
      
      try {
        // Fetch the page
        const response = await axios.get(currentUrl, { timeout: 15000 });
        const $ = cheerio.load(response.data);
        
        // Extract links
        $('a').each((_, element) => {
          const href = $(element).attr('href');
          if (!href) return;
          
          try {
            // Normalize URL
            let fullUrl = href;
            if (href.startsWith('/')) {
              fullUrl = new URL(href, this.baseUrl).toString();
            } else if (!href.startsWith('http')) {
              fullUrl = new URL(href, currentUrl).toString();
            }
            
            // Skip non-HTTP(S) URLs
            if (!fullUrl.startsWith('http')) return;
            
            // Skip URLs that don't belong to this domain
            const urlObj = new URL(fullUrl);
            if (urlObj.hostname !== this.domain) return;
            
            // Skip anchor links and query strings to reduce duplication
            const cleanUrl = fullUrl.split('#')[0];
            
            // Skip page resource files
            if (/\.(jpg|jpeg|png|gif|svg|webp|css|js|pdf|zip|rar|gz|tar|mp4|mp3|webm|ogg|avi|mov|wmv|doc|docx|xls|xlsx|ppt|pptx)$/i.test(cleanUrl)) {
              return;
            }
            
            // Prioritize product links
            const isProductLink = this.productPatterns.some(pattern => pattern.test(cleanUrl));
            
            if (isProductLink) {
              this.queue.unshift({ url: cleanUrl, depth: depth + 1 });
            } else {
              this.queue.push({ url: cleanUrl, depth: depth + 1 });
            }
          } catch (error) {
            // Skip invalid URLs
          }
        });
        
        // Delay to avoid overloading the server
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (error) {
        console.warn(`Error fetching ${currentUrl}:`, error);
      }
    }
    
    // Convert set to array and return
    return Array.from(this.visited);
  }

  stop() {
    this.shouldStop = true;
  }

  generateSitemapXml(urls: string[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    
    if (this.options.includeStylesheet) {
      xml += '<?xml-stylesheet type="text/xsl" href="sitemap.xsl"?>\n';
    }
    
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const url of urls) {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(url)}</loc>\n`;
      
      // Add default values
      xml += '    <lastmod>' + new Date().toISOString().split('T')[0] + '</lastmod>\n';
      xml += '    <changefreq>monthly</changefreq>\n';
      
      // Add priority based on URL structure
      const depth = (url.match(/\//g) || []).length - 2;
      const priority = Math.max(0.1, 1.0 - depth * 0.2).toFixed(1);
      xml += `    <priority>${priority}</priority>\n`;
      
      xml += '  </url>\n';
    }
    
    xml += '</urlset>';
    return xml;
  }

  generateSitemapHtml(urls: string[]): string {
    const date = new Date().toLocaleDateString('ru-RU');
    
    let html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Карта сайта ${this.domain}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
    h1 { color: #333; margin-bottom: 20px; }
    .container { max-width: 1200px; margin: 0 auto; }
    .info { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    .sitemap { margin-bottom: 20px; }
    .sitemap a { color: #0066cc; text-decoration: none; display: block; padding: 5px 0; border-bottom: 1px solid #eee; }
    .sitemap a:hover { color: #004499; background-color: #f9f9f9; }
    .footer { font-size: 12px; color: #777; margin-top: 30px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Карта сайта ${this.domain}</h1>
    
    <div class="info">
      <p><strong>Всего URL:</strong> ${urls.length}</p>
      <p><strong>Дата создания:</strong> ${date}</p>
    </div>
    
    <div class="sitemap">`;
    
    // Group URLs by directory structure
    const urlsByCategory: Record<string, string[]> = {};
    for (const url of urls) {
      try {
        const urlObj = new URL(url);
        const path = urlObj.pathname;
        const parts = path.split('/').filter(Boolean);
        
        const category = parts.length > 0 ? parts[0] : 'Главная';
        
        if (!urlsByCategory[category]) {
          urlsByCategory[category] = [];
        }
        
        urlsByCategory[category].push(url);
      } catch (e) {
        // Skip invalid URLs
      }
    }
    
    // Add URLs to HTML grouped by category
    for (const [category, categoryUrls] of Object.entries(urlsByCategory)) {
      html += `      <h2>${category}</h2>\n`;
      
      for (const url of categoryUrls) {
        try {
          const urlObj = new URL(url);
          const displayUrl = url.replace(/^https?:\/\//, '');
          html += `      <a href="${this.escapeHtml(url)}">${this.escapeHtml(displayUrl)}</a>\n`;
        } catch (e) {
          // Skip invalid URLs
        }
      }
    }
    
    html += `    </div>
    
    <div class="footer">
      <p>Сгенерировано с помощью Simple Sitemap Creator</p>
    </div>
  </div>
</body>
</html>`;

    return html;
  }

  generateXslStylesheet(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" doctype-system="about:legacy-compat" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="ru">
      <head>
        <title>Карта сайта XML - ${this.domain}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body { font-family: Arial, sans-serif; font-size: 14px; color: #333; }
          h1 { color: #0066cc; font-size: 24px; margin: 20px 0; }
          table { border-collapse: collapse; width: 100%; margin: 20px 0; }
          th { background-color: #0066cc; color: white; text-align: left; padding: 10px; }
          td { padding: 10px; border-bottom: 1px solid #ddd; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          tr:hover { background-color: #e6e6e6; }
          .url { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 500px; }
          .high { color: green; }
          .medium { color: orange; }
          .low { color: red; }
          @media (max-width: 768px) {
            table { font-size: 12px; }
            th, td { padding: 5px; }
          }
        </style>
      </head>
      <body>
        <h1>Карта сайта XML - ${this.domain}</h1>
        <p>Этот файл содержит <xsl:value-of select="count(sitemap:urlset/sitemap:url)" /> URL.</p>
        <table>
          <tr>
            <th style="width:70%">URL</th>
            <th>Последнее изменение</th>
            <th>Частота изменений</th>
            <th>Приоритет</th>
          </tr>
          <xsl:for-each select="sitemap:urlset/sitemap:url">
            <tr>
              <td class="url">
                <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc" /></a>
              </td>
              <td><xsl:value-of select="sitemap:lastmod" /></td>
              <td><xsl:value-of select="sitemap:changefreq" /></td>
              <td>
                <xsl:choose>
                  <xsl:when test="number(sitemap:priority) >= 0.7">
                    <span class="high"><xsl:value-of select="sitemap:priority" /></span>
                  </xsl:when>
                  <xsl:when test="number(sitemap:priority) >= 0.4">
                    <span class="medium"><xsl:value-of select="sitemap:priority" /></span>
                  </xsl:when>
                  <xsl:otherwise>
                    <span class="low"><xsl:value-of select="sitemap:priority" /></span>
                  </xsl:otherwise>
                </xsl:choose>
              </td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;
  }

  async downloadSitemap(urls: string[], format: 'xml' | 'html' | 'package' = 'xml') {
    if (urls.length === 0) {
      throw new Error('No URLs to download');
    }
    
    if (format === 'package') {
      await this.downloadSitemapPackage(urls);
    } else {
      // Generate the sitemap
      const content = format === 'xml' 
        ? this.generateSitemapXml(urls)
        : this.generateSitemapHtml(urls);
      
      // Create a blob and download
      const blob = new Blob([content], { type: format === 'xml' ? 'application/xml' : 'text/html' });
      saveAs(blob, `sitemap_${this.domain}.${format}`);
    }
  }

  async downloadSitemapPackage(urls: string[]) {
    const zip = new JSZip();
    
    // Add XML sitemap
    const xmlContent = this.generateSitemapXml(urls);
    zip.file('sitemap.xml', xmlContent);
    
    // Add HTML sitemap
    const htmlContent = this.generateSitemapHtml(urls);
    zip.file('sitemap.html', htmlContent);
    
    // Add XSL stylesheet
    const xslContent = this.generateXslStylesheet();
    zip.file('sitemap.xsl', xslContent);
    
    // Add a README
    const readme = `Sitemap Package for ${this.domain}
Generated on ${new Date().toLocaleDateString()}

Files included:
- sitemap.xml: XML sitemap in standard format
- sitemap.html: HTML sitemap for user-friendly browsing
- sitemap.xsl: Stylesheet for rendering the XML sitemap in a browser

Total URLs: ${urls.length}

Created with Simple Sitemap Creator
`;
    zip.file('README.txt', readme);
    
    // Add URL list as a plain text file
    zip.file('urls.txt', urls.join('\n'));
    
    // Generate and download the ZIP file
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `sitemap_package_${this.domain}.zip`);
  }

  private escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
