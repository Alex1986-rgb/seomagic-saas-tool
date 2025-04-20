
import axios from 'axios';
import * as cheerio from 'cheerio';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { ExtractedPage, ExtractionOptions, ExtractedSite } from './types';

class ContentExtractor {
  async extractPageContent(url: string, options: ExtractionOptions = {}): Promise<ExtractedPage> {
    try {
      const response = await axios.get(url, { 
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ContentExtractor/1.0; +https://example.com/bot)',
          'Accept': 'text/html,application/xhtml+xml,application/xml',
          'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8'
        }
      });
      
      const $ = cheerio.load(response.data);
      
      const page: ExtractedPage = {
        url,
        title: $('title').text().trim(),
        content: options.includeText ? $('body').text().replace(/\s+/g, ' ').trim() : '',
        html: options.includeHtml ? response.data : '',
        meta: {
          description: $('meta[name="description"]').attr('content') || null,
          keywords: $('meta[name="keywords"]').attr('content') || null,
          author: $('meta[name="author"]').attr('content') || null,
          robots: $('meta[name="robots"]').attr('content') || null,
        },
        headings: {
          h1: [],
          h2: [],
          h3: []
        },
        links: {
          internal: [],
          external: []
        },
        images: []
      };

      if (options.includeHeadings !== false) {
        ['h1', 'h2', 'h3'].forEach(tag => {
          page.headings[tag] = $(tag).map((_, el) => $(el).text().trim()).get();
        });
      }

      if (options.includeLinks !== false) {
        const baseUrl = new URL(url).origin;
        $('a').each((_, el) => {
          const href = $(el).attr('href');
          if (href) {
            try {
              const absoluteUrl = new URL(href, url).href;
              if (absoluteUrl.startsWith(baseUrl)) {
                if (!page.links.internal.includes(absoluteUrl)) {
                  page.links.internal.push(absoluteUrl);
                }
              } else {
                if (!page.links.external.includes(absoluteUrl)) {
                  page.links.external.push(absoluteUrl);
                }
              }
            } catch (e) {
              console.warn('Invalid URL:', href);
            }
          }
        });
      }

      if (options.includeImages !== false) {
        $('img').each((_, el) => {
          const src = $(el).attr('src');
          if (src) {
            try {
              const absoluteUrl = new URL(src, url).href;
              page.images.push({
                url: absoluteUrl,
                alt: $(el).attr('alt') || null,
                title: $(el).attr('title') || null
              });
            } catch (e) {
              console.warn('Invalid image URL:', src);
            }
          }
        });
      }

      return page;
    } catch (error) {
      console.error(`Error extracting content from ${url}:`, error);
      throw error;
    }
  }

  async extractSiteContent(urls: string[], domain: string, options: ExtractionOptions = {}): Promise<ExtractedSite> {
    const pages: ExtractedPage[] = [];
    let completedPages = 0;
    
    const batchSize = 5; // Process 5 pages at once
    
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const batchPromises = batch.map(url => this.extractPageContent(url, options)
        .catch(error => {
          console.error(`Failed to extract content from ${url}:`, error);
          return null;
        })
      );
      
      const batchResults = await Promise.all(batchPromises);
      
      batchResults.forEach(page => {
        if (page) {
          pages.push(page);
        }
        completedPages++;
        
        if (options.onProgress) {
          options.onProgress(completedPages, urls.length);
        }
      });
    }
    
    return {
      domain,
      extractedAt: new Date().toISOString(),
      pageCount: pages.length,
      pages: pages
    };
  }

  async exportToJson(site: ExtractedSite): Promise<void> {
    const blob = new Blob([JSON.stringify(site, null, 2)], { type: 'application/json' });
    saveAs(blob, `${site.domain}-content.json`);
  }

  async exportToHtml(site: ExtractedSite): Promise<string> {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Content Export - ${site.domain}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; }
    .page { margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
    .meta { background: #f5f5f5; padding: 10px; margin: 10px 0; }
    .images { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
    .image-item { padding: 10px; border: 1px solid #eee; }
    .links { columns: 2; }
    nav { position: fixed; top: 0; right: 0; background: white; padding: 10px; border: 1px solid #ccc; max-height: 90vh; overflow-y: auto; }
    nav ul { padding-left: 20px; }
    .page-content { border: 1px solid #eee; padding: 15px; margin: 10px 0; max-height: 300px; overflow-y: auto; }
  </style>
</head>
<body>
  <h1>Content Export - ${site.domain}</h1>
  <div class="meta">
    <p>Extracted at: ${site.extractedAt}</p>
    <p>Total pages: ${site.pageCount}</p>
  </div>
  
  <nav>
    <h3>Table of Contents</h3>
    <ul>
      ${site.pages.map(page => `
        <li><a href="#${encodeURIComponent(page.url)}">${page.title || page.url}</a></li>
      `).join('')}
    </ul>
  </nav>
  
  ${site.pages.map(page => `
    <div class="page" id="${encodeURIComponent(page.url)}">
      <h2><a href="${page.url}" target="_blank">${page.title}</a></h2>
      <div class="meta">
        <p><strong>Description:</strong> ${page.meta.description || 'N/A'}</p>
        <p><strong>Keywords:</strong> ${page.meta.keywords || 'N/A'}</p>
      </div>
      
      <h3>Headers</h3>
      <div>
        ${page.headings.h1.map(h => `<p>H1: ${h}</p>`).join('')}
        ${page.headings.h2.map(h => `<p>H2: ${h}</p>`).join('')}
        ${page.headings.h3.map(h => `<p>H3: ${h}</p>`).join('')}
      </div>
      
      <h3>Links</h3>
      <div class="links">
        <div>
          <h4>Internal Links (${page.links.internal.length})</h4>
          <ul>
            ${page.links.internal.slice(0, 50).map(link => `<li><a href="${link}" target="_blank">${link}</a></li>`).join('')}
            ${page.links.internal.length > 50 ? `<li>... and ${page.links.internal.length - 50} more</li>` : ''}
          </ul>
        </div>
        <div>
          <h4>External Links (${page.links.external.length})</h4>
          <ul>
            ${page.links.external.slice(0, 20).map(link => `<li><a href="${link}" target="_blank">${link}</a></li>`).join('')}
            ${page.links.external.length > 20 ? `<li>... and ${page.links.external.length - 20} more</li>` : ''}
          </ul>
        </div>
      </div>

      ${page.images.length > 0 ? `
        <h3>Images (${page.images.length})</h3>
        <div class="images">
          ${page.images.slice(0, 12).map(img => `
            <div class="image-item">
              <img src="${img.url}" alt="${img.alt || ''}" style="max-width: 100%; height: auto;">
              <p>${img.alt || 'No alt text'}</p>
            </div>
          `).join('')}
          ${page.images.length > 12 ? `<div class="image-item">... and ${page.images.length - 12} more images</div>` : ''}
        </div>
      ` : ''}
      
      ${page.html ? `
        <h3>HTML Content</h3>
        <div class="page-content">
          <pre style="white-space: pre-wrap; font-size: 12px;">${page.html.substring(0, 5000).replace(/</g, '&lt;').replace(/>/g, '&gt;')}${page.html.length > 5000 ? '...' : ''}</pre>
        </div>
      ` : ''}
    </div>
  `).join('')}
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    saveAs(blob, `${site.domain}-content.html`);
    
    return html;
  }

  async exportToMarkdown(site: ExtractedSite): Promise<string> {
    const markdown = `# Content Export - ${site.domain}

Extracted at: ${site.extractedAt}
Total pages: ${site.pageCount}

## Table of Contents

${site.pages.map((page, index) => `${index + 1}. [${page.title}](#${encodeURIComponent(page.url).replace(/%/g, '')})`).join('\n')}

${site.pages.map(page => `
## [${page.title}](${page.url}) {#${encodeURIComponent(page.url).replace(/%/g, '')}}

### Meta Information
- Description: ${page.meta.description || 'N/A'}
- Keywords: ${page.meta.keywords || 'N/A'}
- Author: ${page.meta.author || 'N/A'}
- Robots: ${page.meta.robots || 'N/A'}

### Headers
${page.headings.h1.map(h => `- H1: ${h}`).join('\n')}
${page.headings.h2.map(h => `- H2: ${h}`).join('\n')}
${page.headings.h3.map(h => `- H3: ${h}`).join('\n')}

### Links
Internal Links (${page.links.internal.length}):
${page.links.internal.slice(0, 20).map(link => `- [${link}](${link})`).join('\n')}
${page.links.internal.length > 20 ? `... and ${page.links.internal.length - 20} more` : ''}

External Links (${page.links.external.length}):
${page.links.external.slice(0, 10).map(link => `- [${link}](${link})`).join('\n')}
${page.links.external.length > 10 ? `... and ${page.links.external.length - 10} more` : ''}

### Images
${page.images.slice(0, 10).map(img => `- ![${img.alt || 'Image'}](${img.url})`).join('\n')}
${page.images.length > 10 ? `... and ${page.images.length - 10} more images` : ''}

---
`).join('\n')}`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    saveAs(blob, `${site.domain}-content.md`);
    
    return markdown;
  }

  async exportSitemapXml(site: ExtractedSite): Promise<string> {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="https://www.sitemaps.org/xsl/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${site.pages.map(page => `  <url>
    <loc>${this.escapeXml(page.url)}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

    const blob = new Blob([xml], { type: 'application/xml' });
    saveAs(blob, `${site.domain}-sitemap.xml`);
    
    return xml;
  }

  async exportAll(site: ExtractedSite): Promise<void> {
    const zip = new JSZip();

    // Add JSON export
    zip.file('content.json', JSON.stringify(site, null, 2));

    // Add HTML export
    const htmlContent = await this.exportToHtml(site);
    zip.file('content.html', htmlContent);

    // Add Markdown export
    const markdownContent = await this.exportToMarkdown(site);
    zip.file('content.md', markdownContent);
    
    // Add Sitemap XML
    const sitemapContent = await this.exportSitemapXml(site);
    zip.file('sitemap.xml', sitemapContent);
    
    // Create individual HTML files for each page
    const pagesFolder = zip.folder('pages');
    
    site.pages.forEach((page, index) => {
      const pageHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${page.title}</title>
  <meta name="description" content="${page.meta.description || ''}">
  <meta name="keywords" content="${page.meta.keywords || ''}">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 1000px; margin: 0 auto; padding: 20px; }
    .meta { background: #f5f5f5; padding: 10px; margin: 10px 0; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <h1>${page.title}</h1>
  <div class="meta">
    <p>URL: <a href="${page.url}">${page.url}</a></p>
    <p>Description: ${page.meta.description || 'N/A'}</p>
  </div>
  
  <div class="content">
    ${page.html || '<p>No HTML content available</p>'}
  </div>
  
  <p><a href="../content.html">Back to main index</a></p>
</body>
</html>`;
      
      pagesFolder?.file(`page-${index + 1}.html`, pageHtml);
    });

    // Create the zip file
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `${site.domain}-content-export.zip`);
  }
  
  // Helper function to escape XML
  private escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

export const contentExtractor = new ContentExtractor();
