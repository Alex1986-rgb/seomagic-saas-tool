
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
  images?: {url: string, title?: string, caption?: string}[];
}

interface SitemapOptions {
  includeLastMod?: boolean;
  includeChangeFreq?: boolean;
  includePriority?: boolean;
  splitSize?: number;
  imageSitemap?: boolean;
  includeAlternates?: boolean;
}

export class SitemapGenerator {
  // Generate XML sitemap from URLs
  static generateXmlSitemap(entries: SitemapEntry[], options: SitemapOptions = {}): string {
    const {
      includeLastMod = true,
      includeChangeFreq = true,
      includePriority = true,
      imageSitemap = false,
      includeAlternates = false
    } = options;
    
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    
    if (imageSitemap) {
      sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
                'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' +
                (includeAlternates ? ' xmlns:xhtml="http://www.w3.org/1999/xhtml"' : '') +
                '>\n';
    } else {
      sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' +
                (includeAlternates ? ' xmlns:xhtml="http://www.w3.org/1999/xhtml"' : '') +
                '>\n';
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
      
      // Include image information if available and imageSitemap is true
      if (imageSitemap && entry.images && entry.images.length > 0) {
        for (const image of entry.images) {
          sitemap += `    <image:image>\n`;
          sitemap += `      <image:loc>${this.escapeXml(image.url)}</image:loc>\n`;
          
          if (image.title) {
            sitemap += `      <image:title>${this.escapeXml(image.title)}</image:title>\n`;
          }
          
          if (image.caption) {
            sitemap += `      <image:caption>${this.escapeXml(image.caption)}</image:caption>\n`;
          }
          
          sitemap += `    </image:image>\n`;
        }
      }
      
      sitemap += '  </url>\n';
    }
    
    sitemap += '</urlset>';
    return sitemap;
  }
  
  // Generate a sitemap index file for large sites
  static generateSitemapIndex(sitemapUrls: string[], baseUrl?: string): string {
    let index = '<?xml version="1.0" encoding="UTF-8"?>\n';
    index += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    const now = new Date().toISOString().split('T')[0];
    
    for (let i = 0; i < sitemapUrls.length; i++) {
      const url = sitemapUrls[i];
      // If a baseUrl is provided and the url is not absolute, prepend the baseUrl
      const fullUrl = baseUrl && !url.startsWith('http') 
        ? `${baseUrl}/${url}` 
        : url;
        
      index += '  <sitemap>\n';
      index += `    <loc>${this.escapeXml(fullUrl)}</loc>\n`;
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
    .priority { background: #e8f5fb; padding: 2px 6px; border-radius: 3px; font-size: 0.8em; margin-left: 6px; }
    .lastmod { color: #95a5a6; font-size: 0.8em; margin-left: 6px; }
    .search-container { margin-bottom: 20px; }
    #search-input { padding: 8px; width: 300px; border: 1px solid #ddd; border-radius: 4px; }
    .filters { display: flex; gap: 10px; margin-bottom: 20px; }
    .filter-btn { background: #f8f9fa; border: 1px solid #ddd; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
    .filter-btn.active { background: #3498db; color: white; border-color: #2980b9; }
    .collapse-btn { cursor: pointer; color: #3498db; font-size: 0.9em; margin-left: 10px; }
  </style>
</head>
<body>
  <h1>Sitemap for ${domain}</h1>
  <p>Total URLs: ${entries.length}</p>
  
  <div class="search-container">
    <input type="text" id="search-input" placeholder="Search URLs...">
  </div>
  
  <div class="filters">
    <button class="filter-btn active" data-filter="all">All</button>
    <button class="filter-btn" data-filter="high">High Priority</button>
    <button class="filter-btn" data-filter="medium">Medium Priority</button>
    <button class="filter-btn" data-filter="low">Low Priority</button>
  </div>
`;
    
    // Sort sections by name
    const sortedSections = Object.keys(groupedEntries).sort();
    
    for (const section of sortedSections) {
      const sectionEntries = groupedEntries[section];
      
      html += `
  <div class="section" id="section-${section.replace(/[^a-z0-9]/gi, '-')}">
    <h2>${section === 'root' ? 'Main Pages' : section.charAt(0).toUpperCase() + section.slice(1)}
    <span class="count">(${sectionEntries.length})</span>
    <span class="collapse-btn" data-section="${section.replace(/[^a-z0-9]/gi, '-')}">Collapse</span>
    </h2>
    <ul class="url-list">
`;
      
      // Sort URLs alphabetically within section
      sectionEntries.sort((a, b) => a.url.localeCompare(b.url));
      
      for (const entry of sectionEntries) {
        const urlObj = new URL(entry.url);
        const displayUrl = urlObj.pathname || '/';
        
        // Determine priority class
        let priorityClass = 'medium';
        if (entry.priority !== undefined) {
          if (entry.priority >= 0.8) priorityClass = 'high';
          else if (entry.priority < 0.5) priorityClass = 'low';
        }
        
        html += `      <li class="url-item priority-${priorityClass}">
        <a href="${this.escapeHtml(entry.url)}" target="_blank">${this.escapeHtml(displayUrl)}</a>
        ${entry.priority !== undefined ? `<span class="priority">${entry.priority.toFixed(1)}</span>` : ''}
        ${entry.lastmod ? `<span class="lastmod">${entry.lastmod}</span>` : ''}
      </li>\n`;
      }
      
      html += `    </ul>
  </div>
`;
    }
    
    html += `
  <script>
    // Search functionality
    document.getElementById('search-input').addEventListener('input', function(e) {
      const searchText = e.target.value.toLowerCase();
      const urlItems = document.querySelectorAll('.url-item');
      
      urlItems.forEach(item => {
        const url = item.querySelector('a').textContent.toLowerCase();
        if (url.includes(searchText)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
    
    // Filter functionality
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        const urlItems = document.querySelectorAll('.url-item');
        
        urlItems.forEach(item => {
          if (filter === 'all' || item.classList.contains('priority-' + filter)) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
    
    // Collapse functionality
    document.querySelectorAll('.collapse-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const section = this.getAttribute('data-section');
        const list = document.querySelector('#section-' + section + ' .url-list');
        
        if (list.style.display === 'none') {
          list.style.display = '';
          this.textContent = 'Collapse';
        } else {
          list.style.display = 'none';
          this.textContent = 'Expand';
        }
      });
    });
  </script>
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
    
    // Add image sitemap if any entries have images
    const hasImages = entries.some(entry => entry.images && entry.images.length > 0);
    if (hasImages) {
      zip.file('image-sitemap.xml', this.generateXmlSitemap(entries, { imageSitemap: true }));
    }
    
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
    
    // Create robots.txt with sitemap reference
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://${domain}/sitemap.xml
`;
    zip.file('robots.txt', robotsTxt);
    
    // Create README
    const readme = `# Sitemap Package for ${domain}

This package contains the following sitemap files:

- sitemap.xml: Standard XML sitemap for search engines
- sitemap.json: JSON format sitemap for developers
- sitemap.html: HTML sitemap for website visitors
${hasImages ? '- image-sitemap.xml: XML sitemap with image data\n' : ''}
- robots.txt: Sample robots.txt file with sitemap reference

Generated on: ${new Date().toISOString()}
Total URLs: ${entries.length}

## Usage Instructions

- Upload sitemap.xml to your server root
- Add the sitemap URL to Google Search Console and Yandex Webmaster
- Consider linking to the HTML sitemap from your footer
- Add the robots.txt file to your server root (or merge with existing file)

If your site has more than 10,000 URLs, use the split sitemaps in the 'split-sitemaps' folder
and the sitemap-index.xml file.

## Optimization Tips

1. Set appropriate change frequencies and priorities for important pages
2. Update the lastmod date when content changes
3. Include image data for relevant pages
4. Submit your sitemap to search engines regularly
`;
    
    zip.file('README.md', readme);
    
    // Create a basic set of implementation examples
    const implementationFolder = zip.folder('implementation-examples');
    
    // PHP example
    const phpExample = `<?php
// Example of dynamic sitemap generation in PHP

header("Content-Type: application/xml; charset=utf-8");

echo '<?xml version="1.0" encoding="UTF-8"?>';
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

// Connect to your database
$db = new PDO('mysql:host=localhost;dbname=yourdb', 'username', 'password');

// Query your pages table
$query = $db->query("SELECT url, updated_at FROM pages ORDER BY updated_at DESC");

// Output each URL
while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
    $url = htmlspecialchars($row['url']);
    $lastmod = date('Y-m-d', strtotime($row['updated_at']));
    
    echo "<url>";
    echo "<loc>$url</loc>";
    echo "<lastmod>$lastmod</lastmod>";
    echo "<changefreq>monthly</changefreq>";
    echo "<priority>0.8</priority>";
    echo "</url>";
}

echo '</urlset>';
?>`;

    implementationFolder?.file('sitemap.php', phpExample);
    
    // Node.js example
    const nodeExample = `// Example of dynamic sitemap generation in Node.js with Express
const express = require('express');
const app = express();

app.get('/sitemap.xml', async (req, res) => {
  res.header('Content-Type', 'application/xml');
  
  // Start XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  
  // Get URLs from your database
  // const urls = await YourDatabase.getUrls();
  const urls = [
    { url: 'https://example.com', lastmod: '2023-01-01' },
    { url: 'https://example.com/about', lastmod: '2023-01-02' },
    { url: 'https://example.com/contact', lastmod: '2023-01-03' }
  ];
  
  // Add each URL to the sitemap
  urls.forEach(item => {
    xml += '<url>';
    xml += \`<loc>\${item.url}</loc>\`;
    xml += \`<lastmod>\${item.lastmod}</lastmod>\`;
    xml += '<changefreq>monthly</changefreq>';
    xml += '<priority>0.8</priority>';
    xml += '</url>';
  });
  
  xml += '</urlset>';
  res.send(xml);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`;

    implementationFolder?.file('sitemap.js', nodeExample);
    
    return await zip.generateAsync({ type: 'blob' });
  }
  
  // Create a site clone for SEO analysis
  static async createSiteClone(
    domain: string, 
    urls: string[], 
    pageContents: Map<string, string> | {[url: string]: string}
  ): Promise<Blob> {
    const zip = new JSZip();
    
    // Convert pageContents to Map if it's an object
    const contentMap = pageContents instanceof Map 
      ? pageContents 
      : new Map(Object.entries(pageContents));
    
    // Create a folder for each path in the site
    const urlToPathMap = new Map<string, string>();
    
    urls.forEach(url => {
      try {
        const urlObj = new URL(url);
        let path = urlObj.pathname;
        
        // Clean the path
        if (path === '/' || path === '') {
          urlToPathMap.set(url, 'index.html');
        } else {
          // Remove leading slash
          path = path.replace(/^\//, '');
          
          // Handle trailing slash
          if (path.endsWith('/')) {
            path = path + 'index.html';
          } else if (!path.includes('.')) {
            // If no file extension, assume it's a directory and add index.html
            path = path + '/index.html';
          }
          
          urlToPathMap.set(url, path);
        }
      } catch (e) {
        console.warn(`Error processing URL ${url}:`, e);
      }
    });
    
    // Add HTML files
    for (const [url, path] of urlToPathMap.entries()) {
      let content = contentMap.get(url) || `<html><body><h1>Page: ${url}</h1><p>Content not available</p></body></html>`;
      
      // Fix relative links
      urlToPathMap.forEach((targetPath, targetUrl) => {
        // Create relative path between files
        const relLink = this.getRelativePath(path, targetPath);
        content = content.replace(new RegExp(`"${targetUrl}"`, 'g'), `"${relLink}"`);
      });
      
      zip.file(path, content);
    }
    
    // Add CSS and JS folders
    const cssFolder = zip.folder('css');
    cssFolder?.file('style.css', 'body { font-family: Arial, sans-serif; line-height: 1.6; }');
    
    const jsFolder = zip.folder('js');
    jsFolder?.file('script.js', 'console.log("Site clone loaded");');
    
    // Create index of all pages
    let indexContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Site Clone - ${domain}</title>
  <link rel="stylesheet" href="css/style.css">
  <style>
    body { max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1 { color: #2c3e50; }
    .url-list { margin-top: 20px; }
    .url-item { margin-bottom: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px; }
    a { color: #3498db; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Site Clone for ${domain}</h1>
  <p>This archive contains a static HTML copy of ${domain} for SEO analysis.</p>
  
  <div class="url-list">
    <h2>All Pages</h2>`;
    
    // Add links to all pages
    Array.from(urlToPathMap.entries()).sort((a, b) => a[1].localeCompare(b[1])).forEach(([url, path]) => {
      indexContent += `
    <div class="url-item">
      <a href="${path}">${path}</a>
      <div class="original-url">Original: <a href="${url}" target="_blank">${url}</a></div>
    </div>`;
    });
    
    indexContent += `
  </div>
  
  <script src="js/script.js"></script>
</body>
</html>`;
    
    zip.file('_index.html', indexContent);
    
    // Create README.md with instructions
    const readme = `# Static Site Clone for ${domain}

This archive contains a static HTML copy of ${domain} for SEO analysis.

## Contents

- \`_index.html\` - Index of all pages in the clone
- HTML files organized in the same structure as the original site
- \`css/\` - Folder for CSS files
- \`js/\` - Folder for JavaScript files

## Usage

1. Extract the archive to a local folder
2. Open \`_index.html\` in your browser to navigate the site clone
3. Use this clone for SEO analysis, content audits, or offline reference

Created: ${new Date().toISOString()}
`;
    
    zip.file('README.md', readme);
    
    return await zip.generateAsync({ type: 'blob' });
  }
  
  // Get relative path between two file paths
  private static getRelativePath(from: string, to: string): string {
    // Count directory levels in 'from' path
    const fromParts = from.split('/');
    const toParts = to.split('/');
    
    // If 'from' is a file, remove the file part
    const fromDir = fromParts.slice(0, fromParts.length - 1);
    
    // Calculate common prefix length
    let commonLength = 0;
    const minLength = Math.min(fromDir.length, toParts.length - 1);
    
    for (let i = 0; i < minLength; i++) {
      if (fromDir[i] === toParts[i]) {
        commonLength++;
      } else {
        break;
      }
    }
    
    // Build relative path
    const upCount = fromDir.length - commonLength;
    const relativePath = '../'.repeat(upCount) + toParts.slice(commonLength).join('/');
    
    return relativePath || './';
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
  
  // Download site clone
  static async downloadSiteClone(
    domain: string, 
    urls: string[], 
    pageContents: Map<string, string> | {[url: string]: string}
  ): Promise<void> {
    const blob = await this.createSiteClone(domain, urls, pageContents);
    saveAs(blob, `site-clone-${domain}.zip`);
  }
}
