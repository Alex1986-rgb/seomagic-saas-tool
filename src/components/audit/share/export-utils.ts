
import { useToast } from "@/hooks/use-toast";
import { AuditData } from "@/types/audit";

// Clean URL for use in filenames
export const cleanUrl = (url: string): string => {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
    .replace(/[^a-zA-Z0-9]/g, '-');
};

// Format date for use in filenames
export const formatDate = (date: string): string => {
  return new Date(date).toISOString().split('T')[0];
};

// Show export error toast
export const showExportError = (message: string = "Не удалось выполнить экспорт") => {
  const { toast } = useToast();
  toast({
    title: "Ошибка экспорта",
    description: message,
    variant: "destructive",
  });
};

// Show export success toast
export const showExportSuccess = (title: string, message: string) => {
  const { toast } = useToast();
  toast({
    title,
    description: message,
  });
};

// Analyze SEO errors in audit data
export const analyzeSEOErrors = (auditData: AuditData) => {
  const errors = {
    critical: [] as { title: string; description: string }[],
    important: [] as { title: string; description: string }[],
    minor: [] as { title: string; description: string }[],
  };

  // Check SEO section
  if (auditData.details.seo.score < 60) {
    errors.critical.push({
      title: "Низкий SEO рейтинг",
      description: "Общий SEO рейтинг сайта ниже 60 баллов, что требует немедленного внимания"
    });
  } else if (auditData.details.seo.score < 80) {
    errors.important.push({
      title: "Средний SEO рейтинг",
      description: "SEO рейтинг сайта нуждается в улучшении для достижения оптимальных результатов"
    });
  }

  // Check performance section
  if (auditData.details.performance.score < 50) {
    errors.critical.push({
      title: "Критические проблемы производительности",
      description: "Низкая скорость загрузки страниц может негативно влиять на позиции в поисковой выдаче"
    });
  } else if (auditData.details.performance.score < 75) {
    errors.important.push({
      title: "Проблемы производительности",
      description: "Скорость загрузки страниц требует оптимизации"
    });
  }

  // Check content section
  if (auditData.details.content.score < 60) {
    errors.important.push({
      title: "Проблемы с контентом",
      description: "Контент сайта нуждается в значительных улучшениях для лучшего ранжирования"
    });
  } else if (auditData.details.content.score < 80) {
    errors.minor.push({
      title: "Возможности улучшения контента",
      description: "Контент хороший, но может быть улучшен"
    });
  }

  // Check technical section
  if (auditData.details.technical.score < 50) {
    errors.critical.push({
      title: "Критические технические проблемы",
      description: "Обнаружены серьезные технические ошибки, требующие немедленного исправления"
    });
  } else if (auditData.details.technical.score < 75) {
    errors.important.push({
      title: "Технические проблемы",
      description: "Найдены технические проблемы, которые могут влиять на индексацию сайта"
    });
  }

  return errors;
};

// Generate detailed error report
export const generateErrorReport = (auditData: AuditData, url: string) => {
  const errors = analyzeSEOErrors(auditData);
  
  let report = `# Отчет об ошибках для ${url}\n\n`;
  report += `**Дата проверки:** ${formatDate(auditData.date)}\n\n`;
  report += `**Общий рейтинг:** ${auditData.score}/100\n\n`;
  
  report += "## Критические ошибки\n\n";
  if (errors.critical.length === 0) {
    report += "Критических ошибок не обнаружено.\n\n";
  } else {
    errors.critical.forEach((error, index) => {
      report += `### ${index + 1}. ${error.title}\n${error.description}\n\n`;
    });
  }
  
  report += "## Важные проблемы\n\n";
  if (errors.important.length === 0) {
    report += "Важных проблем не обнаружено.\n\n";
  } else {
    errors.important.forEach((error, index) => {
      report += `### ${index + 1}. ${error.title}\n${error.description}\n\n`;
    });
  }
  
  report += "## Незначительные замечания\n\n";
  if (errors.minor.length === 0) {
    report += "Незначительных замечаний не обнаружено.\n\n";
  } else {
    errors.minor.forEach((error, index) => {
      report += `### ${index + 1}. ${error.title}\n${error.description}\n\n`;
    });
  }
  
  report += "## Рекомендации\n\n";
  report += "1. Исправьте критические ошибки как можно скорее\n";
  report += "2. Работайте над улучшением SEO и технических аспектов сайта\n";
  report += "3. Следите за изменениями в показателях после внесения правок\n";
  
  return report;
};

// Format sitemap XML
export const formatSitemapXml = (urls: string[]): string => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  urls.forEach(url => {
    xml += '  <url>\n';
    xml += `    <loc>${url}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  return xml;
};

// Determine if URL should be included in sitemap
export const shouldIncludeInSitemap = (url: string): boolean => {
  // Skip URLs with fragments or query parameters
  if (url.includes('#') || url.includes('?')) {
    return false;
  }
  
  // Skip common file types that shouldn't be in sitemaps
  const excludedExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', 
    '.xls', '.xlsx', '.zip', '.rar', '.css', '.js'
  ];
  
  for (const ext of excludedExtensions) {
    if (url.toLowerCase().endsWith(ext)) {
      return false;
    }
  }
  
  // Skip URLs with common admin/login paths
  const excludedPaths = [
    '/admin', '/login', '/wp-login', '/signin', '/signup',
    '/cart', '/checkout', '/my-account', '/download'
  ];
  
  try {
    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname;
    
    for (const excludedPath of excludedPaths) {
      if (path.startsWith(excludedPath)) {
        return false;
      }
    }
    
    return true;
  } catch (error) {
    // If URL parsing fails, skip the URL
    return false;
  }
};
