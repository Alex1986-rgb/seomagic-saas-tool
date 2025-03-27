
import React from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AuditData } from '@/types/audit';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { cleanUrl, formatDate, showExportError, showExportSuccess, analyzeSEOErrors, generateErrorReport } from '../export-utils';

interface ExportHTMLProps {
  auditData?: AuditData;
  url: string;
  isExporting: string | null;
  setIsExporting: (state: string | null) => void;
}

const ExportHTML: React.FC<ExportHTMLProps> = ({ 
  auditData, 
  url,
  isExporting,
  setIsExporting
}) => {
  // Generate HTML content for the main page
  const generateMainPageContent = (auditData: AuditData): string => {
    return `<h1>Аудит сайта ${url}</h1>
    <p>Дата проведения: ${formatDate(auditData.date)}</p>
    <p>Общий балл: ${auditData.score}/100</p>
    <h2>Основные показатели</h2>
    <ul>
      <li>SEO: ${auditData.details.seo.score || 0}/100</li>
      <li>Производительность: ${auditData.details.performance.score || 0}/100</li>
      <li>Контент: ${auditData.details.content.score || 0}/100</li>
      <li>Технические аспекты: ${auditData.details.technical.score || 0}/100</li>
    </ul>
    <p><a href="issues.html">Просмотреть все проблемы</a></p>
    <p><a href="recommendations.html">Рекомендации по улучшению</a></p>
    <p><a href="details.html">Подробный анализ</a></p>`;
  };
  
  // Generate HTML content for issues page
  const generateIssuesContent = (auditData: AuditData): string => {
    const criticalCount = auditData.issues.critical;
    const importantCount = auditData.issues.important;
    const opportunitiesCount = auditData.issues.opportunities;
    const totalIssues = criticalCount + importantCount + opportunitiesCount;
    
    return `<h1>Проблемы, обнаруженные на сайте ${url}</h1>
    <p>Всего проблем: ${totalIssues}</p>
    <ul>
      <li>Критические ошибки: ${criticalCount}</li>
      <li>Важные улучшения: ${importantCount}</li>
      <li>Возможности для оптимизации: ${opportunitiesCount}</li>
    </ul>
    <div class="issue-categories">
      <div class="issue-category critical">
        <h2>Критические проблемы</h2>
        <ul>
          ${generateIssuesList(auditData, 'critical')}
        </ul>
      </div>
      <div class="issue-category important">
        <h2>Важные улучшения</h2>
        <ul>
          ${generateIssuesList(auditData, 'important')}
        </ul>
      </div>
      <div class="issue-category opportunities">
        <h2>Возможности для оптимизации</h2>
        <ul>
          ${generateIssuesList(auditData, 'opportunities')}
        </ul>
      </div>
    </div>
    <p><a href="index.html">Вернуться на главную</a></p>`;
  };
  
  // Generate list of issues by category
  const generateIssuesList = (auditData: AuditData, category: 'critical' | 'important' | 'opportunities'): string => {
    // Since we don't have actual issues data, we'll create generic issues based on scores
    const score = category === 'critical' 
      ? auditData.details.technical.score 
      : category === 'important' 
        ? auditData.details.seo.score 
        : auditData.details.content.score;
    
    let issuesHTML = '';
    
    if (category === 'critical' && auditData.details.technical.score < 70) {
      issuesHTML += `<li>Технические проблемы со структурой сайта</li>`;
    }
    if (category === 'important' && auditData.details.seo.score < 70) {
      issuesHTML += `<li>Недостаточная SEO оптимизация</li>`;
    }
    if (category === 'opportunities' && auditData.details.content.score < 70) {
      issuesHTML += `<li>Требуется улучшение контента</li>`;
    }
    
    // If no specific issues, add generic message
    if (!issuesHTML) {
      issuesHTML = `<li>Нет серьезных проблем в этой категории</li>`;
    }
    
    return issuesHTML;
  };
  
  // Generate recommendations content
  const generateRecommendationsContent = (auditData: AuditData): string => {
    let recommendationsContent = `<h1>Рекомендации по улучшению сайта ${url}</h1>
    <p>На основе анализа мы рекомендуем следующие действия:</p>
    <ul>`;
    
    // Add recommendations based on scores
    if (auditData.details.seo.score < 80) {
      recommendationsContent += `<li>
        <strong>Улучшите SEO оптимизацию</strong>
        <p>Добавьте мета-теги, улучшите структуру заголовков и оптимизируйте контент для поисковых систем.</p>
        <div class="recommendation-details">
          <h4>Что нужно сделать:</h4>
          <ul>
            <li>Проверить и обновить мета-теги (title, description) на всех страницах</li>
            <li>Улучшить структуру заголовков (H1, H2, H3)</li>
            <li>Оптимизировать контент с использованием ключевых слов</li>
            <li>Добавить альтернативный текст ко всем изображениям</li>
          </ul>
        </div>
      </li>`;
    }
    
    if (auditData.details.performance.score < 70) {
      recommendationsContent += `<li>
        <strong>Оптимизируйте производительность</strong>
        <p>Сжатие изображений, минимизация CSS и JavaScript, использование кэширования браузера.</p>
        <div class="recommendation-details">
          <h4>Что нужно сделать:</h4>
          <ul>
            <li>Сжать и оптимизировать все изображения</li>
            <li>Минимизировать и объединить файлы CSS и JavaScript</li>
            <li>Настроить кэширование браузера</li>
            <li>Использовать ленивую загрузку для изображений</li>
          </ul>
        </div>
      </li>`;
    }
    
    if (auditData.details.content.score < 80) {
      recommendationsContent += `<li>
        <strong>Улучшите контент</strong>
        <p>Добавьте уникальный и полезный контент, улучшите форматирование и читаемость.</p>
        <div class="recommendation-details">
          <h4>Что нужно сделать:</h4>
          <ul>
            <li>Создать больше уникального контента</li>
            <li>Улучшить форматирование текста для легкости чтения</li>
            <li>Добавить визуальные элементы (изображения, видео, инфографика)</li>
            <li>Обновить устаревшую информацию</li>
          </ul>
        </div>
      </li>`;
    }
    
    if (auditData.details.technical.score < 75) {
      recommendationsContent += `<li>
        <strong>Исправьте технические ошибки</strong>
        <p>Устраните битые ссылки, оптимизируйте структуру сайта, исправьте ошибки валидации.</p>
        <div class="recommendation-details">
          <h4>Что нужно сделать:</h4>
          <ul>
            <li>Проверить и исправить битые ссылки</li>
            <li>Оптимизировать структуру URL</li>
            <li>Исправить ошибки валидации HTML/CSS</li>
            <li>Улучшить мобильную версию сайта</li>
          </ul>
        </div>
      </li>`;
    }
    
    recommendationsContent += `</ul>
    <p><a href="index.html">Вернуться на главную</a></p>`;
    
    return recommendationsContent;
  };
  
  // Generate detailed analysis content
  const generateDetailsContent = (auditData: AuditData): string => {
    return `<h1>Подробный анализ сайта ${url}</h1>
    
    <section class="details-section">
      <h2>SEO анализ</h2>
      <div class="score-badge">${auditData.details.seo.score}/100</div>
      <ul class="details-list">
        ${generateCategoryDetails(auditData.details.seo.items)}
      </ul>
    </section>
    
    <section class="details-section">
      <h2>Анализ производительности</h2>
      <div class="score-badge">${auditData.details.performance.score}/100</div>
      <ul class="details-list">
        ${generateCategoryDetails(auditData.details.performance.items)}
      </ul>
    </section>
    
    <section class="details-section">
      <h2>Анализ контента</h2>
      <div class="score-badge">${auditData.details.content.score}/100</div>
      <ul class="details-list">
        ${generateCategoryDetails(auditData.details.content.items)}
      </ul>
    </section>
    
    <section class="details-section">
      <h2>Технический анализ</h2>
      <div class="score-badge">${auditData.details.technical.score}/100</div>
      <ul class="details-list">
        ${generateCategoryDetails(auditData.details.technical.items)}
      </ul>
    </section>
    
    <p><a href="index.html">Вернуться на главную</a></p>`;
  };
  
  // Generate detail items for each category
  const generateCategoryDetails = (items: any[]): string => {
    if (!items || items.length === 0) {
      return '<li>Нет данных для отображения</li>';
    }
    
    return items.map(item => `
      <li class="detail-item ${item.status}">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        ${item.details ? `<div class="item-details">${item.details}</div>` : ''}
      </li>
    `).join('');
  };
  
  // Generate HTML page with proper structure
  const generateHTMLPage = (title: string, content: string): string => {
    return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Аудит сайта ${url}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="header">
    <h1>Аудит сайта ${url}</h1>
    <div class="nav-links">
      <a href="index.html">Главная</a>
      <a href="issues.html">Проблемы</a>
      <a href="recommendations.html">Рекомендации</a>
      <a href="details.html">Подробности</a>
    </div>
  </div>
  
  <div class="content">
    ${content}
  </div>
  
  <div class="footer">
    <p>Отчет создан: ${new Date().toLocaleDateString()}</p>
  </div>
</body>
</html>`;
  };
  
  // Generate CSS styles
  const generateCSS = (): string => {
    return `
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      h1, h2, h3, h4 {
        color: #2c3e50;
        margin-top: 1.5em;
      }
      a {
        color: #3498db;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      ul {
        padding-left: 20px;
      }
      li {
        margin-bottom: 15px;
      }
      .header {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 5px;
        margin-bottom: 20px;
      }
      .nav-links {
        display: flex;
        gap: 15px;
        margin-top: 10px;
      }
      .footer {
        margin-top: 30px;
        padding-top: 15px;
        border-top: 1px solid #eee;
        text-align: center;
        font-size: 0.9em;
        color: #7f8c8d;
      }
      .issue-categories {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 30px;
      }
      .issue-category {
        border: 1px solid #eee;
        border-radius: 5px;
        padding: 15px;
      }
      .critical {
        border-left: 4px solid #e74c3c;
      }
      .important {
        border-left: 4px solid #f39c12;
      }
      .opportunities {
        border-left: 4px solid #3498db;
      }
      .score-badge {
        display: inline-block;
        padding: 5px 10px;
        background-color: #2c3e50;
        color: white;
        border-radius: 20px;
        font-weight: bold;
        margin-bottom: 15px;
      }
      .details-section {
        margin-bottom: 40px;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
      }
      .detail-item {
        padding: 15px;
        margin-bottom: 15px;
        border-radius: 5px;
        background-color: #f8f9fa;
      }
      .detail-item.good {
        border-left: 4px solid #2ecc71;
      }
      .detail-item.warning {
        border-left: 4px solid #f39c12;
      }
      .detail-item.error {
        border-left: 4px solid #e74c3c;
      }
      .recommendation-details {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 5px;
        margin-top: 10px;
      }
      .item-details {
        background-color: #f0f0f0;
        padding: 10px;
        border-radius: 5px;
        margin-top: 10px;
        font-size: 0.9em;
      }
    `;
  };

  const handleExportHTML = async () => {
    if (!auditData) {
      showExportError();
      return;
    }
    
    try {
      setIsExporting('html');
      
      // Create a ZIP archive with a static HTML version of the site
      const zip = new JSZip();
      
      // Add index.html
      const indexHTML = generateHTMLPage(
        'Главная страница', 
        generateMainPageContent(auditData)
      );
      
      zip.file('index.html', indexHTML);
      
      // Add issues.html
      zip.file('issues.html', generateHTMLPage('Проблемы', generateIssuesContent(auditData)));
      
      // Add recommendations.html
      zip.file('recommendations.html', generateHTMLPage('Рекомендации', generateRecommendationsContent(auditData)));
      
      // Add details.html
      zip.file('details.html', generateHTMLPage('Подробный анализ', generateDetailsContent(auditData)));
      
      // Add styles.css
      zip.file('styles.css', generateCSS());
      
      // Create the zip file
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Save the file
      saveAs(content, `site-audit-${cleanUrl(url)}-${formatDate(auditData.date)}.zip`);
      
      showExportSuccess("HTML экспортирован", "Статическая версия сайта успешно сохранена в ZIP архиве");
    } catch (error) {
      console.error('Ошибка при экспорте HTML:', error);
      showExportError("Не удалось сохранить HTML. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <DropdownMenuItem 
      onClick={handleExportHTML}
      disabled={isExporting !== null || !auditData}
      className="flex items-center gap-2"
    >
      {isExporting === 'html' ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Подготовка HTML...</span>
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          <span>Экспорт HTML версии сайта</span>
        </>
      )}
    </DropdownMenuItem>
  );
};

export default ExportHTML;
