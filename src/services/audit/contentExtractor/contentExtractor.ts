
import axios from 'axios';
import * as cheerio from 'cheerio';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { ExtractedPage, ExtractedSite, ExtractionOptions } from './types';

class ContentExtractor {
  /**
   * Извлекает содержимое одной страницы
   */
  async extractPageContent(url: string, options: ExtractionOptions = {}): Promise<ExtractedPage> {
    try {
      const response = await axios.get(url, { timeout: 10000 });
      const $ = cheerio.load(response.data);
      
      // Базовые данные о странице
      const page: ExtractedPage = {
        url,
        title: $('title').text(),
        content: this.extractTextContent($),
        html: options.includeHtml ? response.data : '',
        meta: {
          description: options.includeMetaTags ? $('meta[name="description"]').attr('content') || null : null,
          keywords: options.includeMetaTags ? $('meta[name="keywords"]').attr('content') || null : null,
          author: options.includeMetaTags ? $('meta[name="author"]').attr('content') || null : null,
          robots: options.includeMetaTags ? $('meta[name="robots"]').attr('content') || null : null,
        },
        headings: {
          h1: options.includeHeadings ? $('h1').map((_, el) => $(el).text().trim()).get() : [],
          h2: options.includeHeadings ? $('h2').map((_, el) => $(el).text().trim()).get() : [],
          h3: options.includeHeadings ? $('h3').map((_, el) => $(el).text().trim()).get() : [],
        },
        links: {
          internal: [],
          external: [],
        },
        images: [],
      };
      
      // Извлечение ссылок
      if (options.includeLinks) {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        
        $('a').each((_, el) => {
          const href = $(el).attr('href');
          if (!href) return;
          
          try {
            const linkUrl = new URL(href, url);
            
            if (linkUrl.hostname === domain) {
              if (!page.links.internal.includes(linkUrl.href)) {
                page.links.internal.push(linkUrl.href);
              }
            } else {
              if (!page.links.external.includes(linkUrl.href)) {
                page.links.external.push(linkUrl.href);
              }
            }
          } catch (e) {
            // Игнорируем некорректные URL
          }
        });
      }
      
      // Извлечение изображений
      if (options.includeImages) {
        $('img').each((_, el) => {
          const src = $(el).attr('src');
          if (!src) return;
          
          try {
            const imgUrl = new URL(src, url).href;
            
            page.images.push({
              url: imgUrl,
              alt: $(el).attr('alt') || null,
              title: $(el).attr('title') || null,
            });
          } catch (e) {
            // Игнорируем некорректные URL
          }
        });
      }
      
      return page;
    } catch (error) {
      console.error(`Error extracting content from ${url}:`, error);
      
      // Возвращаем минимальную информацию при ошибке
      return {
        url,
        title: `Failed to extract: ${url}`,
        content: '',
        html: '',
        meta: { description: null, keywords: null, author: null, robots: null },
        headings: { h1: [], h2: [], h3: [] },
        links: { internal: [], external: [] },
        images: [],
      };
    }
  }
  
  /**
   * Извлекает чистый текст из HTML
   */
  private extractTextContent($: cheerio.CheerioAPI): string {
    // Удаляем скрипты, стили и комментарии
    $('script, style, comment').remove();
    
    // Извлекаем текст из body
    const text = $('body').text();
    
    // Очищаем текст от лишних пробелов и переносов строк
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();
  }
  
  /**
   * Извлекает содержимое всего сайта
   */
  async extractSiteContent(
    urls: string[], 
    domain: string,
    options: ExtractionOptions = {}
  ): Promise<ExtractedSite> {
    const { maxPages = urls.length, onProgress } = options;
    const pagesToProcess = urls.slice(0, maxPages);
    const total = pagesToProcess.length;
    const pages: ExtractedPage[] = [];
    
    // Для каждого URL извлекаем контент
    for (let i = 0; i < pagesToProcess.length; i++) {
      const url = pagesToProcess[i];
      
      try {
        const page = await this.extractPageContent(url, options);
        pages.push(page);
        
        // Вызываем колбэк прогресса, если он предоставлен
        if (onProgress) {
          onProgress(i + 1, total);
        }
      } catch (error) {
        console.error(`Error processing ${url}:`, error);
      }
    }
    
    return {
      domain,
      extractedAt: new Date().toISOString(),
      pageCount: pages.length,
      pages,
    };
  }
  
  /**
   * Экспорт в JSON формат
   */
  exportToJson(data: ExtractedSite): string {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, `${data.domain}-content.json`);
    return json;
  }
  
  /**
   * Экспорт в HTML формат
   */
  exportToHtml(data: ExtractedSite): string {
    let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Контент сайта ${data.domain}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1, h2, h3 { color: #333; }
    .page { border: 1px solid #ddd; margin-bottom: 30px; padding: 20px; border-radius: 5px; }
    .meta { background: #f7f7f7; padding: 10px; border-radius: 5px; margin: 15px 0; }
    .links, .images { margin-top: 15px; }
    .internal-link, .external-link, .image-item { margin-bottom: 5px; }
  </style>
</head>
<body>
  <h1>Контент сайта ${data.domain}</h1>
  <p>Извлечено: ${new Date(data.extractedAt).toLocaleString()}</p>
  <p>Всего страниц: ${data.pageCount}</p>
  
  <div class="pages">`;
    
    // Добавляем каждую страницу
    data.pages.forEach(page => {
      html += `
    <div class="page">
      <h2><a href="${page.url}" target="_blank">${page.title}</a></h2>
      <p>URL: ${page.url}</p>
      
      <div class="meta">
        <h3>Метаданные</h3>
        <p>Description: ${page.meta.description || 'Not available'}</p>
        <p>Keywords: ${page.meta.keywords || 'Not available'}</p>
        <p>Author: ${page.meta.author || 'Not available'}</p>
        <p>Robots: ${page.meta.robots || 'Not available'}</p>
      </div>
      
      <div class="headings">
        <h3>Заголовки</h3>
        ${page.headings.h1.length ? '<h4>H1</h4><ul>' + page.headings.h1.map(h => `<li>${h}</li>`).join('') + '</ul>' : ''}
        ${page.headings.h2.length ? '<h4>H2</h4><ul>' + page.headings.h2.map(h => `<li>${h}</li>`).join('') + '</ul>' : ''}
        ${page.headings.h3.length ? '<h4>H3</h4><ul>' + page.headings.h3.map(h => `<li>${h}</li>`).join('') + '</ul>' : ''}
      </div>
      
      <div class="links">
        <h3>Ссылки</h3>
        <h4>Внутренние (${page.links.internal.length})</h4>
        <ul>
          ${page.links.internal.map(link => `<li class="internal-link"><a href="${link}" target="_blank">${link}</a></li>`).join('')}
        </ul>
        <h4>Внешние (${page.links.external.length})</h4>
        <ul>
          ${page.links.external.map(link => `<li class="external-link"><a href="${link}" target="_blank">${link}</a></li>`).join('')}
        </ul>
      </div>
      
      <div class="images">
        <h3>Изображения (${page.images.length})</h3>
        <ul>
          ${page.images.map(img => `<li class="image-item">
            <img src="${img.url}" alt="${img.alt || ''}" style="max-width: 200px; max-height: 150px;">
            <p>URL: ${img.url}</p>
            <p>Alt: ${img.alt || 'Not available'}</p>
            <p>Title: ${img.title || 'Not available'}</p>
          </li>`).join('')}
        </ul>
      </div>
      
      <div class="content">
        <h3>Содержимое</h3>
        <div>${page.content}</div>
      </div>
    </div>`;
    });
    
    html += `
  </div>
</body>
</html>`;
    
    const blob = new Blob([html], { type: 'text/html' });
    saveAs(blob, `${data.domain}-content.html`);
    return html;
  }
  
  /**
   * Экспорт в Markdown формат
   */
  exportToMarkdown(data: ExtractedSite): string {
    let markdown = `# Контент сайта ${data.domain}\n\n`;
    markdown += `Извлечено: ${new Date(data.extractedAt).toLocaleString()}\n\n`;
    markdown += `Всего страниц: ${data.pageCount}\n\n`;
    
    // Добавляем каждую страницу
    data.pages.forEach((page, index) => {
      markdown += `## ${page.title}\n\n`;
      markdown += `URL: [${page.url}](${page.url})\n\n`;
      
      markdown += `### Метаданные\n\n`;
      markdown += `- Description: ${page.meta.description || 'Not available'}\n`;
      markdown += `- Keywords: ${page.meta.keywords || 'Not available'}\n`;
      markdown += `- Author: ${page.meta.author || 'Not available'}\n`;
      markdown += `- Robots: ${page.meta.robots || 'Not available'}\n\n`;
      
      markdown += `### Заголовки\n\n`;
      if (page.headings.h1.length) {
        markdown += `#### H1\n\n`;
        page.headings.h1.forEach(h => markdown += `- ${h}\n`);
        markdown += `\n`;
      }
      if (page.headings.h2.length) {
        markdown += `#### H2\n\n`;
        page.headings.h2.forEach(h => markdown += `- ${h}\n`);
        markdown += `\n`;
      }
      if (page.headings.h3.length) {
        markdown += `#### H3\n\n`;
        page.headings.h3.forEach(h => markdown += `- ${h}\n`);
        markdown += `\n`;
      }
      
      markdown += `### Ссылки\n\n`;
      markdown += `#### Внутренние (${page.links.internal.length})\n\n`;
      page.links.internal.forEach(link => markdown += `- [${link}](${link})\n`);
      markdown += `\n`;
      markdown += `#### Внешние (${page.links.external.length})\n\n`;
      page.links.external.forEach(link => markdown += `- [${link}](${link})\n`);
      markdown += `\n`;
      
      markdown += `### Изображения (${page.images.length})\n\n`;
      page.images.forEach(img => {
        markdown += `- ![${img.alt || ''}](${img.url})\n`;
        markdown += `  - URL: ${img.url}\n`;
        markdown += `  - Alt: ${img.alt || 'Not available'}\n`;
        markdown += `  - Title: ${img.title || 'Not available'}\n`;
      });
      markdown += `\n`;
      
      markdown += `### Содержимое\n\n`;
      markdown += `${page.content}\n\n`;
      
      // Разделитель между страницами
      if (index < data.pages.length - 1) {
        markdown += `---\n\n`;
      }
    });
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    saveAs(blob, `${data.domain}-content.md`);
    return markdown;
  }
  
  /**
   * Экспорт в Sitemap XML формат
   */
  exportSitemapXml(data: ExtractedSite): string {
    // Генерируем XML содержимое
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Добавляем каждую страницу
    data.pages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(page.url)}</loc>\n`;
      xml += `    <lastmod>${data.extractedAt.split('T')[0]}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    
    // Сохраняем в файл
    const blob = new Blob([xml], { type: 'application/xml' });
    saveAs(blob, `${data.domain}-sitemap.xml`);
    return xml;
  }
  
  /**
   * Экспорт всех форматов в ZIP архив
   */
  async exportAll(data: ExtractedSite): Promise<void> {
    // Создаем все форматы
    const json = this.exportToJson(data);
    const html = this.exportToHtml(data);
    const markdown = this.exportToMarkdown(data);
    const sitemap = this.exportSitemapXml(data);
    
    // Создаем ZIP архив
    const zip = new JSZip();
    zip.file(`${data.domain}-content.json`, json);
    zip.file(`${data.domain}-content.html`, html);
    zip.file(`${data.domain}-content.md`, markdown);
    zip.file(`${data.domain}-sitemap.xml`, sitemap);
    
    // Добавляем README
    zip.file("README.txt", `Контент сайта ${data.domain}
Извлечено: ${new Date(data.extractedAt).toLocaleString()}
Всего страниц: ${data.pageCount}

Содержимое архива:
- ${data.domain}-content.json - данные в формате JSON
- ${data.domain}-content.html - данные в формате HTML
- ${data.domain}-content.md - данные в формате Markdown
- ${data.domain}-sitemap.xml - карта сайта в формате XML
`);
    
    // Создаем XLSX файл
    
    // Генерируем и скачиваем ZIP
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${data.domain}-content.zip`);
  }
  
  /**
   * Экранирует специальные символы для XML
   */
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
