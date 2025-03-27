
/**
 * Simple Sitemap Creator
 * A lightweight module for generating HTML and XML sitemaps
 * Inspired by the open-source Simple Sitemap Creator project
 */

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface SitemapOptions {
  maxPages?: number;
  maxDepth?: number;
  includeStylesheet?: boolean;
  excludePatterns?: string[];
  includeLastMod?: boolean;
  changefreq?: string;
  priority?: number;
}

export class SimpleSitemapCreator {
  private visited = new Set<string>();
  private queue: { url: string; depth: number }[] = [];
  private domain: string = '';
  private baseUrl: string = '';
  private options: SitemapOptions;
  private excludeRegexes: RegExp[] = [];
  private abortController: AbortController | null = null;
  private isRunning: boolean = false;

  constructor(options: SitemapOptions = {}) {
    this.options = {
      maxPages: options.maxPages || 1000,
      maxDepth: options.maxDepth || 10,
      includeStylesheet: options.includeStylesheet !== false,
      excludePatterns: options.excludePatterns || ['\\.jpg$', '\\.jpeg$', '\\.png$', '\\.gif$', '\\.pdf$', '\\.zip$'],
      includeLastMod: options.includeLastMod !== false,
      changefreq: options.changefreq || 'monthly',
      priority: options.priority || 0.5,
    };

    this.excludeRegexes = (this.options.excludePatterns || []).map(pattern => new RegExp(pattern, 'i'));
  }

  public async crawl(url: string, onProgress?: (scanned: number, total: number, currentUrl: string) => void): Promise<string[]> {
    if (this.isRunning) {
      this.stop();
    }

    this.isRunning = true;
    this.abortController = new AbortController();
    this.visited.clear();
    this.queue = [];

    try {
      // Normalize the URL
      if (!url.startsWith('http')) {
        url = 'https://' + url;
      }

      const urlObj = new URL(url);
      this.domain = urlObj.hostname;
      this.baseUrl = urlObj.origin;
      
      // Start with the base URL
      this.queue.push({ url: this.baseUrl, depth: 0 });

      // Process the queue
      while (this.queue.length > 0 && this.visited.size < this.options.maxPages! && this.isRunning) {
        const { url: currentUrl, depth } = this.queue.shift()!;
        
        if (this.visited.has(currentUrl) || depth > this.options.maxDepth!) {
          continue;
        }
        
        this.visited.add(currentUrl);
        
        if (onProgress) {
          onProgress(this.visited.size, this.options.maxPages!, currentUrl);
        }

        // Skip if the URL matches exclude patterns
        if (this.shouldExcludeUrl(currentUrl)) {
          continue;
        }

        try {
          const links = await this.extractLinks(currentUrl);
          
          for (const link of links) {
            if (!this.visited.has(link)) {
              this.queue.push({ url: link, depth: depth + 1 });
            }
          }
        } catch (error) {
          console.error(`Error processing ${currentUrl}:`, error);
        }
      }

      return Array.from(this.visited);
    } finally {
      this.isRunning = false;
      this.abortController = null;
    }
  }

  public stop(): void {
    this.isRunning = false;
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  private shouldExcludeUrl(url: string): boolean {
    return this.excludeRegexes.some(regex => regex.test(url));
  }

  private async extractLinks(url: string): Promise<string[]> {
    try {
      const response = await axios.get(url, {
        timeout: 5000,
        signal: this.abortController?.signal
      });
      
      const $ = cheerio.load(response.data);
      const links: string[] = [];
      
      $('a').each((_, element) => {
        const href = $(element).attr('href');
        if (!href) return;
        
        try {
          // Handle relative URLs
          const absoluteUrl = new URL(href, url).href;
          const linkUrlObj = new URL(absoluteUrl);
          
          // Only include links from the same domain
          if (linkUrlObj.hostname === this.domain) {
            // Remove hash and query parameters for cleaner sitemap
            linkUrlObj.hash = '';
            links.push(linkUrlObj.href);
          }
        } catch (e) {
          // Skip invalid URLs
        }
      });
      
      return links;
    } catch (error) {
      return [];
    }
  }

  public generateXmlSitemap(urls: string[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    
    if (this.options.includeStylesheet) {
      xml += '<?xml-stylesheet type="text/xsl" href="sitemap.xsl"?>\n';
    }
    
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add each URL to the sitemap
    for (const url of urls) {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(url)}</loc>\n`;
      
      if (this.options.includeLastMod) {
        xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      }
      
      xml += `    <changefreq>${this.options.changefreq}</changefreq>\n`;
      xml += `    <priority>${this.options.priority}</priority>\n`;
      xml += '  </url>\n';
    }
    
    xml += '</urlset>';
    return xml;
  }

  public generateHtmlSitemap(urls: string[]): string {
    // Group URLs by path segments for better organization
    const urlsByPath: Record<string, string[]> = {};
    
    for (const url of urls) {
      try {
        const urlObj = new URL(url);
        const path = urlObj.pathname.split('/').filter(Boolean)[0] || 'root';
        
        if (!urlsByPath[path]) {
          urlsByPath[path] = [];
        }
        
        urlsByPath[path].push(url);
      } catch (e) {
        // Skip invalid URLs
      }
    }

    // Generate the HTML
    let html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Карта сайта для ${this.domain}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    h1 { color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; }
    h2 { color: #0066cc; margin-top: 30px; }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .path-section { margin-bottom: 40px; }
    .url-list { list-style: none; padding-left: 0; }
    .url-list li { margin-bottom: 8px; padding-left: 20px; position: relative; }
    .url-list li:before { content: "•"; color: #0066cc; position: absolute; left: 0; }
    .summary { background: #f8f8f8; padding: 15px; border-radius: 5px; margin-bottom: 30px; }
    .timestamp { font-size: 0.8em; color: #666; margin-top: 5px; }
  </style>
</head>
<body>
  <h1>Карта сайта для ${this.domain}</h1>
  
  <div class="summary">
    <p>Всего URL: <strong>${urls.length}</strong></p>
    <p>Дата создания: <strong>${new Date().toLocaleDateString('ru-RU')}</strong></p>
    <div class="timestamp">Создано с помощью Simple Sitemap Creator</div>
  </div>
`;

    // Sort paths alphabetically
    const sortedPaths = Object.keys(urlsByPath).sort();
    
    for (const path of sortedPaths) {
      const pathUrls = urlsByPath[path];
      
      html += `  <div class="path-section">
    <h2>${path === 'root' ? 'Корневые страницы' : path}</h2>
    <ul class="url-list">
`;
      
      // Sort URLs within each path
      pathUrls.sort();
      
      for (const url of pathUrls) {
        const urlObj = new URL(url);
        const displayPath = urlObj.pathname || '/';
        html += `      <li><a href="${this.escapeHtml(url)}" target="_blank">${this.escapeHtml(displayPath)}</a></li>\n`;
      }
      
      html += `    </ul>
  </div>
`;
    }
    
    html += `</body>
</html>`;

    return html;
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

  public async generateSitemapPackage(urls: string[]): Promise<Blob> {
    const zip = new JSZip();
    
    // Add XML sitemap
    const xmlSitemap = this.generateXmlSitemap(urls);
    zip.file('sitemap.xml', xmlSitemap);
    
    // Add HTML sitemap
    const htmlSitemap = this.generateHtmlSitemap(urls);
    zip.file('sitemap.html', htmlSitemap);
    
    // Add XSLT stylesheet for XML sitemap
    const xslStylesheet = this.generateXslStylesheet();
    zip.file('sitemap.xsl', xslStylesheet);
    
    // Add README
    const readme = `# Карта сайта для ${this.domain}

Этот архив содержит карту сайта в разных форматах:

- sitemap.xml: XML-формат для поисковых систем
- sitemap.html: HTML-формат для просмотра в браузере
- sitemap.xsl: Таблица стилей для XML-карты сайта

Сгенерировано: ${new Date().toISOString()}
Всего URL: ${urls.length}

## Инструкции по использованию

- Загрузите sitemap.xml в корень вашего сайта
- Добавьте URL карты сайта в Google Search Console
- Ссылку на HTML-карту сайта можно разместить в футере сайта для удобства пользователей
`;
    
    zip.file('README.md', readme);
    
    return await zip.generateAsync({ type: 'blob' });
  }

  private generateXslStylesheet(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  
  <xsl:template match="/">
    <html lang="ru">
      <head>
        <title>Карта сайта XML для <xsl:value-of select="sitemap:urlset/sitemap:url[1]/sitemap:loc"/></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style>
          body { font-family: Arial, sans-serif; font-size: 14px; color: #333; }
          table { border-collapse: collapse; width: 100%; margin: 20px 0; }
          th { background-color: #4CAF50; color: white; text-align: left; padding: 8px; }
          td { border: 1px solid #ddd; padding: 8px; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          h1 { color: #4CAF50; }
          a { color: #0066cc; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .summary { width: 100%; margin: 10px 0; border-spacing: 0; }
          .summary th { background: #f2f2f2; padding: 5px; }
          .summary td { padding: 5px; }
        </style>
      </head>
      <body>
        <h1>XML Карта сайта</h1>
        <p>Эта XML карта сайта создана для передачи данных в поисковые системы.</p>
        
        <table class="summary">
          <tr>
            <th>URL:</th>
            <td><xsl:value-of select="sitemap:urlset/sitemap:url[1]/sitemap:loc"/></td>
          </tr>
          <tr>
            <th>Кол-во URL:</th>
            <td><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></td>
          </tr>
          <tr>
            <th>Дата создания:</th>
            <td><xsl:value-of select="format-date(current-date(),'[D01].[M01].[Y0001]')"/></td>
          </tr>
        </table>
        
        <table>
          <tr>
            <th>URL</th>
            <th>Частота изменений</th>
            <th>Приоритет</th>
            <th>Последнее изменение</th>
          </tr>
          <xsl:for-each select="sitemap:urlset/sitemap:url">
            <tr>
              <td>
                <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
              </td>
              <td><xsl:value-of select="sitemap:changefreq"/></td>
              <td><xsl:value-of select="sitemap:priority"/></td>
              <td><xsl:value-of select="sitemap:lastmod"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;
  }

  public downloadSitemap(urls: string[], format: 'xml' | 'html' | 'package' = 'xml'): void {
    let blob: Blob;
    let filename: string;
    
    switch (format) {
      case 'xml':
        blob = new Blob([this.generateXmlSitemap(urls)], { type: 'text/xml' });
        filename = `sitemap_${this.domain}.xml`;
        break;
      case 'html':
        blob = new Blob([this.generateHtmlSitemap(urls)], { type: 'text/html' });
        filename = `sitemap_${this.domain}.html`;
        break;
      case 'package':
        this.generateSitemapPackage(urls).then(packageBlob => {
          saveAs(packageBlob, `sitemap_package_${this.domain}.zip`);
        });
        return;
    }
    
    saveAs(blob, filename);
  }
}
