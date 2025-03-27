
import { toast } from "@/hooks/use-toast";
import { saveAs } from 'file-saver';

/**
 * Cleans URL for use in filenames by removing protocol and special characters
 */
export const cleanUrl = (url: string): string => {
  return url.replace(/https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '-');
};

/**
 * Formats date string into YYYY-MM-DD format for filenames
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

/**
 * Shows error toast for export operations
 */
export const showExportError = (message: string = "Нет данных для экспорта") => {
  toast({
    title: "Ошибка",
    description: message,
    variant: "destructive"
  });
};

/**
 * Shows success toast for export operations
 */
export const showExportSuccess = (title: string, description: string) => {
  toast({
    title,
    description,
  });
};

/**
 * Analyzes HTML content to find common SEO errors
 */
export const analyzeSEOErrors = (htmlContent: string): {error: string, description: string}[] => {
  const errors: {error: string, description: string}[] = [];
  
  // Check for missing title tag
  if (!htmlContent.includes('<title>') || htmlContent.includes('<title></title>')) {
    errors.push({
      error: 'Missing title tag',
      description: 'Title tag is missing or empty. Every page should have a unique, descriptive title.'
    });
  }
  
  // Check for missing meta description
  if (!htmlContent.includes('<meta name="description"') || htmlContent.includes('content=""')) {
    errors.push({
      error: 'Missing meta description',
      description: 'Meta description is missing or empty. Add a unique description for better search engine results.'
    });
  }
  
  // Check for missing H1 tag
  if (!htmlContent.includes('<h1>') && !htmlContent.includes('<H1>')) {
    errors.push({
      error: 'Missing H1 tag',
      description: 'H1 heading is missing. Each page should have exactly one H1 tag that describes the page content.'
    });
  }
  
  // Check for multiple H1 tags (simplified check)
  const h1Count = (htmlContent.match(/<h1/gi) || []).length;
  if (h1Count > 1) {
    errors.push({
      error: 'Multiple H1 tags',
      description: `Found ${h1Count} H1 tags. Each page should have exactly one H1 tag for proper SEO.`
    });
  }
  
  // Check for images without alt text
  const imgWithoutAlt = (htmlContent.match(/<img(?!.*alt=["'].*["']).*>/gi) || []).length;
  if (imgWithoutAlt > 0) {
    errors.push({
      error: 'Images without alt text',
      description: `Found ${imgWithoutAlt} images without alt text. All images should have descriptive alt text for accessibility and SEO.`
    });
  }
  
  // Check for canonical URL issues
  if (!htmlContent.includes('<link rel="canonical"')) {
    errors.push({
      error: 'Missing canonical tag',
      description: 'Canonical tag is missing. Use canonical tags to prevent duplicate content issues.'
    });
  }
  
  // Check for language specification
  if (!htmlContent.includes('lang=')) {
    errors.push({
      error: 'Missing language attribute',
      description: 'HTML lang attribute is missing. Specify the language of your page for better accessibility and SEO.'
    });
  }
  
  // Check for viewport meta tag
  if (!htmlContent.includes('viewport')) {
    errors.push({
      error: 'Missing viewport meta tag',
      description: 'Viewport meta tag is missing. This is essential for responsive design and mobile optimization.'
    });
  }
  
  // Check for too many links
  const linkCount = (htmlContent.match(/<a /gi) || []).length;
  if (linkCount > 100) {
    errors.push({
      error: 'Too many links',
      description: `Found ${linkCount} links on the page. Having too many links can dilute PageRank and affect user experience.`
    });
  }
  
  // Check for potential keyword stuffing
  const bodyContent = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] || '';
  const textContent = bodyContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = textContent.split(' ');
  const wordCount = words.length;
  
  // Create a map of word frequency
  const wordFrequency: Record<string, number> = {};
  words.forEach(word => {
    const cleanWord = word.toLowerCase().replace(/[^a-zа-яё0-9]/gi, '');
    if (cleanWord.length > 3) { // Only count words longer than 3 characters
      wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
    }
  });
  
  // Check for words with unusually high frequency
  for (const [word, count] of Object.entries(wordFrequency)) {
    const frequency = count / wordCount;
    if (frequency > 0.05 && count > 5) { // More than 5% of all words and appears more than 5 times
      errors.push({
        error: 'Potential keyword stuffing',
        description: `The word "${word}" appears ${count} times (${(frequency * 100).toFixed(2)}% of total words). This could be seen as keyword stuffing.`
      });
      break; // Only report one instance of potential keyword stuffing
    }
  }
  
  return errors;
};

/**
 * Formats sitemap.xml content with proper indentation and structure
 * Now with support for images and hreflang
 */
export const formatSitemapXml = (urls: string[]): string => {
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  sitemap += '        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n';
  sitemap += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
  
  urls.forEach(url => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${url}</loc>\n`;
    sitemap += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    sitemap += '    <changefreq>monthly</changefreq>\n';
    sitemap += '    <priority>0.8</priority>\n';
    
    // Add sample alternate language versions for demonstration
    const domain = new URL(url).hostname;
    if (Math.random() > 0.7) { // Add hreflang to some URLs for demonstration
      sitemap += `    <xhtml:link rel="alternate" hreflang="en" href="https://${domain}/en${new URL(url).pathname}"/>\n`;
      sitemap += `    <xhtml:link rel="alternate" hreflang="es" href="https://${domain}/es${new URL(url).pathname}"/>\n`;
    }
    
    // Add sample image entries for demonstration
    if (url.includes('product') || url.includes('about') || Math.random() > 0.8) {
      sitemap += '    <image:image>\n';
      sitemap += `      <image:loc>${url.replace(/\/$/, '')}/image1.jpg</image:loc>\n`;
      sitemap += '      <image:title>Sample Image Title</image:title>\n';
      sitemap += '      <image:caption>Sample Image Caption</image:caption>\n';
      sitemap += '    </image:image>\n';
    }
    
    sitemap += '  </url>\n';
  });
  
  sitemap += '</urlset>';
  return sitemap;
};

/**
 * Checks if a URL should be included in sitemap (excludes non-HTML resources)
 */
export const shouldIncludeInSitemap = (url: string): boolean => {
  // Exclude common non-HTML resource extensions
  const excludedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.css', '.js', '.pdf', '.zip', '.ico'];
  for (const ext of excludedExtensions) {
    if (url.endsWith(ext)) return false;
  }
  
  // Exclude common admin paths
  const excludedPaths = ['/admin', '/wp-admin', '/login', '/signup', 'cart', 'checkout'];
  for (const path of excludedPaths) {
    if (url.includes(path)) return false;
  }
  
  return true;
};

/**
 * Generate error report in HTML format
 */
export const generateErrorReport = (
  url: string, 
  errors: {page: string, errors: {error: string, description: string}[]}[]
): string => {
  let html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Отчет об ошибках - ${url}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1, h2 { color: #2c3e50; }
    .page-section { margin-bottom: 30px; padding: 15px; border: 1px solid #eee; border-radius: 5px; }
    .error-item { margin-bottom: 10px; padding: 10px; background-color: #f8f9fa; border-left: 3px solid #e74c3c; }
    .error-title { font-weight: bold; color: #e74c3c; }
    .error-desc { margin-top: 5px; color: #555; }
    .summary { background-color: #f1f8ff; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    .error-severity-high { border-left-color: #e74c3c; }
    .error-severity-medium { border-left-color: #f39c12; }
    .error-severity-low { border-left-color: #3498db; }
    .severity-badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 0.8em; margin-left: 10px; }
    .severity-high { background-color: #e74c3c; color: white; }
    .severity-medium { background-color: #f39c12; color: white; }
    .severity-low { background-color: #3498db; color: white; }
    .error-count { font-weight: bold; }
    .page-link { color: #3498db; }
    .page-errors-toggle { cursor: pointer; user-select: none; }
    .page-errors-toggle::before { content: "▶"; display: inline-block; margin-right: 5px; transition: transform 0.2s; }
    .page-errors-toggle.open::before { transform: rotate(90deg); }
    .error-list { display: none; }
    .error-list.visible { display: block; }
    .chart-container { margin: 20px 0; height: 200px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
    .stat-box { background-color: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; }
    .stat-value { font-size: 1.5em; font-weight: bold; color: #2c3e50; margin: 10px 0; }
    .stat-label { font-size: 0.9em; color: #7f8c8d; }
  </style>
  <script>
    window.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.page-errors-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
          toggle.classList.toggle('open');
          const errorList = toggle.nextElementSibling;
          errorList.classList.toggle('visible');
        });
      });
    });
  </script>
</head>
<body>
  <h1>Отчет об ошибках для сайта ${url}</h1>
  
  <div class="summary">
    <h2>Сводка</h2>
    <p>Всего проверено страниц: ${errors.length}</p>
    <p>Всего найдено ошибок: ${errors.reduce((total, page) => total + page.errors.length, 0)}</p>
    
    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-label">Критические ошибки</div>
        <div class="stat-value">${errors.reduce((count, page) => {
          return count + page.errors.filter(err => 
            err.error.toLowerCase().includes('missing') || 
            err.error.toLowerCase().includes('critical')
          ).length;
        }, 0)}</div>
      </div>
      
      <div class="stat-box">
        <div class="stat-label">Важные предупреждения</div>
        <div class="stat-value">${errors.reduce((count, page) => {
          return count + page.errors.filter(err => 
            err.error.toLowerCase().includes('multiple') || 
            err.error.toLowerCase().includes('too many')
          ).length;
        }, 0)}</div>
      </div>
      
      <div class="stat-box">
        <div class="stat-label">Незначительные проблемы</div>
        <div class="stat-value">${errors.reduce((count, page) => {
          return count + page.errors.filter(err => 
            !err.error.toLowerCase().includes('missing') && 
            !err.error.toLowerCase().includes('critical') &&
            !err.error.toLowerCase().includes('multiple') && 
            !err.error.toLowerCase().includes('too many')
          ).length;
        }, 0)}</div>
      </div>
      
      <div class="stat-box">
        <div class="stat-label">Среднее кол-во ошибок</div>
        <div class="stat-value">${(errors.reduce((total, page) => total + page.errors.length, 0) / errors.length).toFixed(1)}</div>
      </div>
    </div>
  </div>
`;

  // Generate content for each page
  errors.forEach(page => {
    html += `
  <div class="page-section">
    <h2 class="page-errors-toggle">Страница: <a href="${page.page}" target="_blank" class="page-link">${page.page}</a> <span class="error-count">(${page.errors.length} ошибок)</span></h2>
    
    <div class="error-list">`;
    
    page.errors.forEach(error => {
      // Determine severity based on error type
      let severityClass = 'error-severity-medium';
      let severityBadge = '<span class="severity-badge severity-medium">Средняя</span>';
      
      if (error.error.toLowerCase().includes('missing') || error.error.toLowerCase().includes('critical')) {
        severityClass = 'error-severity-high';
        severityBadge = '<span class="severity-badge severity-high">Высокая</span>';
      } else if (error.error.toLowerCase().includes('potential') || error.error.toLowerCase().includes('suggestion')) {
        severityClass = 'error-severity-low';
        severityBadge = '<span class="severity-badge severity-low">Низкая</span>';
      }
      
      html += `
      <div class="error-item ${severityClass}">
        <div class="error-title">${error.error} ${severityBadge}</div>
        <div class="error-desc">${error.description}</div>
      </div>`;
    });
    
    html += `
    </div>
  </div>`;
  });
  
  html += `
  <script>
    // Open the first error section by default
    document.querySelector('.page-errors-toggle')?.click();
  </script>
</body>
</html>`;

  return html;
};

/**
 * Analyzes a list of URLs for broken links and validation issues
 */
export const analyzeUrlsForIssues = async (urls: string[]): Promise<{url: string, status: number, issues: string[]}[]> => {
  // This is a simplified version. In a real implementation, this would make actual HTTP requests
  // to check URL status codes and analyze content.
  return urls.map(url => {
    const issues: string[] = [];
    
    // Simulate random URL statuses for demonstration
    let status = 200;
    
    // Randomly assign some URLs as having issues (for demo purposes)
    if (Math.random() > 0.9) {
      status = 404;
      issues.push("Страница не найдена (404)");
    } else if (Math.random() > 0.95) {
      status = 500;
      issues.push("Внутренняя ошибка сервера (500)");
    } else if (Math.random() > 0.9) {
      status = 301;
      issues.push("Постоянное перенаправление (301)");
    } else if (Math.random() > 0.9) {
      status = 200;
      issues.push("Дублирующийся контент");
    }
    
    // Add other potential issues
    if (Math.random() > 0.85) {
      issues.push("Отсутствует мета-описание");
    }
    
    if (Math.random() > 0.9) {
      issues.push("Отсутствует H1 заголовок");
    }
    
    return { url, status, issues };
  });
};

/**
 * Checks if a URL has issues with mobile-friendliness
 * This is a placeholder/mock implementation
 */
export const checkMobileFriendliness = (url: string): {isMobileFriendly: boolean, issues: string[]} => {
  // In a real implementation, this would use Lighthouse or similar
  const isMobileFriendly = Math.random() > 0.3; // Randomly determine if mobile-friendly
  
  const issues: string[] = [];
  if (!isMobileFriendly) {
    const possibleIssues = [
      "Контент шире экрана",
      "Кнопки/ссылки слишком близко друг к другу",
      "Текст слишком маленький для чтения",
      "Viewport не настроен",
      "Используются несовместимые плагины"
    ];
    
    // Add 1-3 random issues
    const issueCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < issueCount; i++) {
      const randomIssue = possibleIssues[Math.floor(Math.random() * possibleIssues.length)];
      if (!issues.includes(randomIssue)) {
        issues.push(randomIssue);
      }
    }
  }
  
  return { isMobileFriendly, issues };
};
