
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
  
  return errors;
};

/**
 * Formats sitemap.xml content with proper indentation and structure
 */
export const formatSitemapXml = (urls: string[]): string => {
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  urls.forEach(url => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${url}</loc>\n`;
    sitemap += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    sitemap += '    <changefreq>monthly</changefreq>\n';
    sitemap += '    <priority>0.8</priority>\n';
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
  </style>
</head>
<body>
  <h1>Отчет об ошибках для сайта ${url}</h1>
  
  <div class="summary">
    <h2>Сводка</h2>
    <p>Всего проверено страниц: ${errors.length}</p>
    <p>Всего найдено ошибок: ${errors.reduce((total, page) => total + page.errors.length, 0)}</p>
  </div>
`;

  // Generate content for each page
  errors.forEach(page => {
    html += `
  <div class="page-section">
    <h2>Страница: ${page.page}</h2>
    <p>Найдено ошибок: ${page.errors.length}</p>
    
    <div class="errors-list">`;
    
    page.errors.forEach(error => {
      html += `
      <div class="error-item">
        <div class="error-title">${error.error}</div>
        <div class="error-desc">${error.description}</div>
      </div>`;
    });
    
    html += `
    </div>
  </div>`;
  });
  
  html += `
</body>
</html>`;

  return html;
};
