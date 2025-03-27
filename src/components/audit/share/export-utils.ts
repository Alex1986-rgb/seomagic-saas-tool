
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

// Analyze SEO errors in audit data - enhanced with more detailed error categories
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

  // Check mobile section - new
  if (auditData.details.mobile.score < 60) {
    errors.important.push({
      title: "Проблемы с мобильной версией",
      description: "Сайт плохо оптимизирован для мобильных устройств, что негативно влияет на ранжирование"
    });
  } else if (auditData.details.mobile.score < 80) {
    errors.minor.push({
      title: "Необходима оптимизация для мобильных устройств",
      description: "Мобильная версия сайта нуждается в доработке"
    });
  }

  // Check for duplicate content issues - new
  if (auditData.issues.critical > 3) {
    errors.critical.push({
      title: "Дублирование контента",
      description: "Обнаружено множество дублирующихся страниц, что может привести к понижению в выдаче"
    });
  } else if (auditData.issues.critical > 0) {
    errors.important.push({
      title: "Возможное дублирование контента",
      description: "Найдены признаки дублирования контента, рекомендуется проверить страницы"
    });
  }

  // Check for broken links - new
  if (auditData.issues.important > 5) {
    errors.important.push({
      title: "Битые ссылки",
      description: "На сайте обнаружено значительное количество нерабочих ссылок"
    });
  } else if (auditData.issues.important > 2) {
    errors.minor.push({
      title: "Несколько битых ссылок",
      description: "Найдено несколько нерабочих ссылок, требующих исправления"
    });
  }

  // Check for meta tag issues - new
  if (auditData.issues.important > 3) {
    errors.important.push({
      title: "Проблемы с мета-тегами",
      description: "Многие страницы имеют отсутствующие или дублирующиеся мета-теги"
    });
  }

  // Check for crawler issues - new
  if (auditData.issues.critical > 2 && auditData.issues.important > 3) {
    errors.critical.push({
      title: "Проблемы индексации",
      description: "Обнаружены препятствия для поисковых роботов, мешающие индексации сайта"
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
  
  // Adding section for duplicate content
  if (auditData.issues.critical > 0) {
    report += "\n## Дубликаты контента\n\n";
    report += `Обнаружено признаков дублирования: ${auditData.issues.critical}\n`;
    report += "Рекомендации по устранению дубликатов:\n";
    report += "- Используйте канонические URL (rel=canonical)\n";
    report += "- Настройте правильные 301 редиректы\n";
    report += "- Объедините страницы с похожим содержимым\n";
    report += "- Проверьте, не индексируются ли фильтры и сортировки товаров\n";
  }
  
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

// New function to detect duplicate content patterns
export const detectDuplicateContentPatterns = (urls: string[]): {
  suspiciousPatterns: string[],
  potentialDuplicates: Record<string, string[]>
} => {
  const suspiciousPatterns: string[] = [];
  const potentialDuplicates: Record<string, string[]> = {};
  
  // Check for pagination patterns
  const paginationRegexes = [
    /page\/\d+\/?$/,
    /p=\d+/,
    /page=\d+/,
    /pg=\d+/
  ];
  
  // Check for filter patterns
  const filterRegexes = [
    /filter=.*/,
    /sort=.*/,
    /order=.*/,
    /category=.*&filter=.*/
  ];
  
  // Check for session IDs
  const sessionRegexes = [
    /sid=.*/,
    /session=.*/,
    /sessionid=.*/
  ];
  
  // Group URLs by patterns
  for (const url of urls) {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      const query = urlObj.search;
      
      // Check pagination patterns
      for (const regex of paginationRegexes) {
        if (regex.test(path) || regex.test(query)) {
          const baseUrl = url.replace(regex, '');
          if (!suspiciousPatterns.includes('Pagination')) {
            suspiciousPatterns.push('Pagination');
          }
          
          if (!potentialDuplicates['Pagination']) {
            potentialDuplicates['Pagination'] = [];
          }
          
          if (!potentialDuplicates['Pagination'].includes(url)) {
            potentialDuplicates['Pagination'].push(url);
          }
        }
      }
      
      // Check filter patterns
      for (const regex of filterRegexes) {
        if (regex.test(query)) {
          const baseUrl = url.replace(regex, '');
          if (!suspiciousPatterns.includes('Filters')) {
            suspiciousPatterns.push('Filters');
          }
          
          if (!potentialDuplicates['Filters']) {
            potentialDuplicates['Filters'] = [];
          }
          
          if (!potentialDuplicates['Filters'].includes(url)) {
            potentialDuplicates['Filters'].push(url);
          }
        }
      }
      
      // Check session IDs
      for (const regex of sessionRegexes) {
        if (regex.test(query)) {
          if (!suspiciousPatterns.includes('Session IDs')) {
            suspiciousPatterns.push('Session IDs');
          }
          
          if (!potentialDuplicates['Session IDs']) {
            potentialDuplicates['Session IDs'] = [];
          }
          
          if (!potentialDuplicates['Session IDs'].includes(url)) {
            potentialDuplicates['Session IDs'].push(url);
          }
        }
      }
      
      // Check for uppercase/lowercase variations
      const lowercasePath = path.toLowerCase();
      if (path !== lowercasePath) {
        if (!suspiciousPatterns.includes('Case Variations')) {
          suspiciousPatterns.push('Case Variations');
        }
        
        if (!potentialDuplicates['Case Variations']) {
          potentialDuplicates['Case Variations'] = [];
        }
        
        if (!potentialDuplicates['Case Variations'].includes(url)) {
          potentialDuplicates['Case Variations'].push(url);
        }
      }
      
    } catch (error) {
      // Skip invalid URLs
      continue;
    }
  }
  
  return { suspiciousPatterns, potentialDuplicates };
};

// New function to estimate duplicate content percentage
export const estimateDuplicateContentPercentage = (auditData: AuditData): number => {
  // This is a simplified estimation based on the available data
  const criticalIssueWeight = 0.8;
  const importantIssueWeight = 0.4;
  
  const criticalContribution = (auditData.issues.critical / 10) * criticalIssueWeight;
  const importantContribution = (auditData.issues.important / 20) * importantIssueWeight;
  
  let percentage = (criticalContribution + importantContribution) * 100;
  
  // Cap at 100%
  percentage = Math.min(percentage, 100);
  
  return Math.round(percentage);
};
