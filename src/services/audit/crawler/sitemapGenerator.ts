
/**
 * Enhanced sitemap generator with various output formats
 */

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Define types for sitemap entry
interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

interface SitemapOptions {
  includeLastMod?: boolean;
  includeChangeFreq?: boolean;
  includePriority?: boolean;
  splitSize?: number;
  imageSitemap?: boolean;
}

export class SitemapGenerator {
  // Generate XML sitemap from URLs
  static generateXmlSitemap(entries: SitemapEntry[], options: SitemapOptions = {}): string {
    const {
      includeLastMod = true,
      includeChangeFreq = true,
      includePriority = true,
      imageSitemap = false
    } = options;
    
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    
    if (imageSitemap) {
      sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
                'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
    } else {
      sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    }
    
    for (const entry of entries) {
      sitemap += `  <url>\n    <loc>${this.escapeXml(entry.url)}</loc>\n`;
      
      if (includeLastMod && entry.lastmod) {
        sitemap += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      }
      
      if (includeChangeFreq && entry.changefreq) {
        sitemap += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      }
      
      if (includePriority && entry.priority !== undefined) {
        sitemap += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
      }
      
      sitemap += '  </url>\n';
    }
    
    sitemap += '</urlset>';
    return sitemap;
  }
  
  // Generate a sitemap index file for large sites
  static generateSitemapIndex(sitemapUrls: string[]): string {
    let index = '<?xml version="1.0" encoding="UTF-8"?>\n';
    index += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    const now = new Date().toISOString().split('T')[0];
    
    for (const url of sitemapUrls) {
      index += '  <sitemap>\n';
      index += `    <loc>${this.escapeXml(url)}</loc>\n`;
      index += `    <lastmod>${now}</lastmod>\n`;
      index += '  </sitemap>\n';
    }
    
    index += '</sitemapindex>';
    return index;
  }
  
  // Split sitemap into multiple files for large sites
  static splitSitemap(entries: SitemapEntry[], options: SitemapOptions = {}): string[] {
    const { splitSize = 10000 } = options;
    const sitemaps: string[] = [];
    
    for (let i = 0; i < entries.length; i += splitSize) {
      const chunk = entries.slice(i, i + splitSize);
      const sitemap = this.generateXmlSitemap(chunk, options);
      sitemaps.push(sitemap);
    }
    
    return sitemaps;
  }
  
  // Generate JSON sitemap
  static generateJsonSitemap(entries: SitemapEntry[]): string {
    return JSON.stringify(entries, null, 2);
  }
  
  // Generate HTML sitemap
  static generateHtmlSitemap(entries: SitemapEntry[], domain: string): string {
    const groupedEntries: Record<string, SitemapEntry[]> = {};
    
    // Group URLs by path
    for (const entry of entries) {
      try {
        const url = new URL(entry.url);
        const path = url.pathname.split('/')[1] || 'root';
        
        if (!groupedEntries[path]) {
          groupedEntries[path] = [];
        }
        
        groupedEntries[path].push(entry);
      } catch (e) {
        // Skip invalid URLs
      }
    }
    
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sitemap for ${domain}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
    h1 { color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px; }
    h2 { color: #3498db; margin-top: 30px; }
    ul { padding-left: 20px; }
    li { margin: 8px 0; }
    a { color: #2980b9; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .section { margin-bottom: 30px; }
    .count { color: #7f8c8d; font-size: 0.9em; margin-left: 10px; }
  </style>
</head>
<body>
  <h1>Sitemap for ${domain}</h1>
  <p>Total URLs: ${entries.length}</p>
`;
    
    // Sort sections by name
    const sortedSections = Object.keys(groupedEntries).sort();
    
    for (const section of sortedSections) {
      const sectionEntries = groupedEntries[section];
      
      html += `
  <div class="section">
    <h2>${section === 'root' ? 'Main Pages' : section.charAt(0).toUpperCase() + section.slice(1)}
    <span class="count">(${sectionEntries.length})</span></h2>
    <ul>
`;
      
      // Sort URLs alphabetically within section
      sectionEntries.sort((a, b) => a.url.localeCompare(b.url));
      
      for (const entry of sectionEntries) {
        const urlObj = new URL(entry.url);
        const displayUrl = urlObj.pathname || '/';
        html += `      <li><a href="${this.escapeHtml(entry.url)}" target="_blank">${this.escapeHtml(displayUrl)}</a></li>\n`;
      }
      
      html += `    </ul>
  </div>
`;
    }
    
    html += `
</body>
</html>`;
    
    return html;
  }
  
  // Create a compressed package with all sitemap formats
  static async createSitemapPackage(entries: SitemapEntry[], domain: string): Promise<Blob> {
    const zip = new JSZip();
    
    // Add XML sitemap
    zip.file('sitemap.xml', this.generateXmlSitemap(entries));
    
    // Add JSON sitemap
    zip.file('sitemap.json', this.generateJsonSitemap(entries));
    
    // Add HTML sitemap
    zip.file('sitemap.html', this.generateHtmlSitemap(entries, domain));
    
    // If there are too many URLs, create split sitemaps
    if (entries.length > 10000) {
      const splitSitemaps = this.splitSitemap(entries);
      const sitemapFolder = zip.folder('split-sitemaps');
      
      splitSitemaps.forEach((sitemap, index) => {
        sitemapFolder?.file(`sitemap-${index + 1}.xml`, sitemap);
      });
      
      // Create sitemap index
      const sitemapUrls = Array.from({ length: splitSitemaps.length }, (_, i) => 
        `https://${domain}/sitemap-${i + 1}.xml`
      );
      
      zip.file('sitemap-index.xml', this.generateSitemapIndex(sitemapUrls));
    }
    
    // Create README
    const readme = `# Sitemap Package for ${domain}

This package contains the following sitemap files:

- sitemap.xml: Standard XML sitemap for search engines
- sitemap.json: JSON format sitemap for developers
- sitemap.html: HTML sitemap for website visitors

Generated on: ${new Date().toISOString()}
Total URLs: ${entries.length}

## Usage Instructions

- Upload sitemap.xml to your server root
- Add the sitemap URL to Google Search Console
- Consider linking to the HTML sitemap from your footer

If your site has more than 10,000 URLs, use the split sitemaps in the 'split-sitemaps' folder
and the sitemap-index.xml file.
`;
    
    zip.file('README.md', readme);
    
    return await zip.generateAsync({ type: 'blob' });
  }
  
  // Utility to escape XML special characters
  private static escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
  
  // Utility to escape HTML special characters
  private static escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  
  // Download sitemap directly
  static downloadSitemap(sitemap: string, filename: string): void {
    const blob = new Blob([sitemap], { type: 'text/xml' });
    saveAs(blob, filename);
  }
  
  // Download sitemap package
  static async downloadSitemapPackage(entries: SitemapEntry[], domain: string): Promise<void> {
    const blob = await this.createSitemapPackage(entries, domain);
    saveAs(blob, `sitemap-package-${domain}.zip`);
  }
}
