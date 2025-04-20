
import axios from 'axios';
import * as cheerio from 'cheerio';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { ExtractedPage, ExtractionOptions, ExtractedSite } from './types';

class ContentExtractor {
  async extractPageContent(url: string, options: ExtractionOptions = {}): Promise<ExtractedPage> {
    try {
      const response = await axios.get(url, { timeout: 10000 });
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

      if (options.includeHeadings) {
        ['h1', 'h2', 'h3'].forEach(tag => {
          page.headings[tag] = $(tag).map((_, el) => $(el).text().trim()).get();
        });
      }

      if (options.includeLinks) {
        const baseUrl = new URL(url).origin;
        $('a').each((_, el) => {
          const href = $(el).attr('href');
          if (href) {
            try {
              const absoluteUrl = new URL(href, url).href;
              if (absoluteUrl.startsWith(baseUrl)) {
                page.links.internal.push(absoluteUrl);
              } else {
                page.links.external.push(absoluteUrl);
              }
            } catch (e) {
              console.warn('Invalid URL:', href);
            }
          }
        });
      }

      if (options.includeImages) {
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

  async exportToJson(site: ExtractedSite): Promise<void> {
    const blob = new Blob([JSON.stringify(site, null, 2)], { type: 'application/json' });
    saveAs(blob, `${site.domain}-content.json`);
  }

  async exportToHtml(site: ExtractedSite): Promise<void> {
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
  </style>
</head>
<body>
  <h1>Content Export - ${site.domain}</h1>
  <div class="meta">
    <p>Extracted at: ${site.extractedAt}</p>
    <p>Total pages: ${site.pageCount}</p>
  </div>
  ${site.pages.map(page => `
    <div class="page">
      <h2><a href="${page.url}">${page.title}</a></h2>
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
      ${page.images.length > 0 ? `
        <h3>Images</h3>
        <div class="images">
          ${page.images.map(img => `
            <div class="image-item">
              <img src="${img.url}" alt="${img.alt || ''}" style="max-width: 100%; height: auto;">
              <p>${img.alt || 'No alt text'}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `).join('')}
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    saveAs(blob, `${site.domain}-content.html`);
  }

  async exportToMarkdown(site: ExtractedSite): Promise<void> {
    const markdown = `# Content Export - ${site.domain}

Extracted at: ${site.extractedAt}
Total pages: ${site.pageCount}

${site.pages.map(page => `
## [${page.title}](${page.url})

### Meta Information
- Description: ${page.meta.description || 'N/A'}
- Keywords: ${page.meta.keywords || 'N/A'}

### Headers
${page.headings.h1.map(h => `- H1: ${h}`).join('\n')}
${page.headings.h2.map(h => `- H2: ${h}`).join('\n')}
${page.headings.h3.map(h => `- H3: ${h}`).join('\n')}

### Images
${page.images.map(img => `- ![${img.alt || 'Image'}](${img.url})`).join('\n')}

### Links
Internal Links:
${page.links.internal.map(link => `- ${link}`).join('\n')}

External Links:
${page.links.external.map(link => `- ${link}`).join('\n')}

---
`).join('\n')}`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    saveAs(blob, `${site.domain}-content.md`);
  }

  async exportAll(site: ExtractedSite): Promise<void> {
    const zip = new JSZip();

    // Add JSON export
    zip.file('content.json', JSON.stringify(site, null, 2));

    // Add HTML export
    const html = document.createElement('html');
    html.innerHTML = await this.exportToHtml(site);
    zip.file('content.html', html.innerHTML);

    // Add Markdown export
    const markdown = await this.exportToMarkdown(site);
    zip.file('content.md', markdown);

    // Create the zip file
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `${site.domain}-content-export.zip`);
  }
}

export const contentExtractor = new ContentExtractor();
