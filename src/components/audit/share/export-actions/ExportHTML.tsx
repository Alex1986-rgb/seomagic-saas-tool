
import React from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AuditData } from '@/types/audit';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { cleanUrl, formatDate, showExportError, showExportSuccess } from '../export-utils';

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
        `<h1>Аудит сайта ${url}</h1>
        <p>Дата проведения: ${formatDate(auditData.date)}</p>
        <p>Общий балл: ${auditData.score}/100</p>
        <h2>Основные показатели</h2>
        <ul>
          <li>SEO: ${auditData.seoScore || 0}/100</li>
          <li>Производительность: ${auditData.performanceScore || 0}/100</li>
          <li>Доступность: ${auditData.accessibilityScore || 0}/100</li>
          <li>Лучшие практики: ${auditData.bestPracticesScore || 0}/100</li>
        </ul>
        <p><a href="issues.html">Просмотреть все проблемы</a></p>
        <p><a href="recommendations.html">Рекомендации по улучшению</a></p>`
      );
      
      zip.file('index.html', indexHTML);
      
      // Add issues.html
      if (auditData.issues && auditData.issues.length > 0) {
        let issuesContent = `<h1>Проблемы, обнаруженные на сайте ${url}</h1>
        <p>Всего проблем: ${auditData.issues.length}</p>
        <ul>`;
        
        auditData.issues.forEach(issue => {
          issuesContent += `<li>
            <strong>${issue.title}</strong>
            <p>${issue.description}</p>
            <p>Важность: ${issue.severity}</p>
          </li>`;
        });
        
        issuesContent += `</ul>
        <p><a href="index.html">Вернуться на главную</a></p>`;
        
        zip.file('issues.html', generateHTMLPage('Проблемы', issuesContent));
      }
      
      // Add recommendations.html
      if (auditData.recommendations && auditData.recommendations.length > 0) {
        let recommendationsContent = `<h1>Рекомендации по улучшению сайта ${url}</h1>
        <ul>`;
        
        auditData.recommendations.forEach(rec => {
          recommendationsContent += `<li>
            <strong>${rec.title}</strong>
            <p>${rec.description}</p>
          </li>`;
        });
        
        recommendationsContent += `</ul>
        <p><a href="index.html">Вернуться на главную</a></p>`;
        
        zip.file('recommendations.html', generateHTMLPage('Рекомендации', recommendationsContent));
      }
      
      // Add styles.css
      const css = `
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        h1, h2, h3 {
          color: #2c3e50;
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
        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #eee;
          text-align: center;
          font-size: 0.9em;
          color: #7f8c8d;
        }
      `;
      
      zip.file('styles.css', css);
      
      // Create the zip file
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Save the file
      saveAs(content, `site-export-${cleanUrl(url)}-${formatDate(auditData.date)}.zip`);
      
      showExportSuccess("HTML экспортирован", "Статическая версия сайта успешно сохранена в ZIP архиве");
    } catch (error) {
      console.error('Ошибка при экспорте HTML:', error);
      showExportError("Не удалось сохранить HTML. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsExporting(null);
    }
  };
  
  // Helper to generate an HTML page with proper structure
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
