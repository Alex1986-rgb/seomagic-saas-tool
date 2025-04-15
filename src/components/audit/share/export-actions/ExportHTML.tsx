
import React from 'react';
import { FileCode, Loader2 } from 'lucide-react';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { AuditData } from '@/types/audit';
import { seoApiService } from '@/api/seoApiService';

interface ExportHTMLProps {
  auditData?: AuditData;
  url: string;
  isExporting: string | null;
  setIsExporting: (value: string | null) => void;
  taskId?: string | null;
}

const ExportHTML: React.FC<ExportHTMLProps> = ({ 
  auditData, 
  url, 
  isExporting, 
  setIsExporting,
  taskId
}) => {
  const { toast } = useToast();
  
  const handleExportHTML = async () => {
    setIsExporting('html');
    
    try {
      if (taskId) {
        // Use backend API
        const response = await fetch(`/api/results/${taskId}/html-report`);
        if (!response.ok) {
          throw new Error('Failed to fetch HTML report');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'seo-report.html';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "HTML экспортирован",
          description: "HTML-отчет успешно сохранен",
        });
      } else if (auditData) {
        // Use frontend implementation
        // Create a simple HTML report
        const htmlContent = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SEO Audit Report - ${url}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px; }
    h1, h2, h3 { color: #333; }
    .score { font-size: 24px; font-weight: bold; color: #4CAF50; }
    .issues { margin-bottom: 20px; }
    .issue-item { margin-bottom: 10px; padding: 10px; border-left: 3px solid #ddd; }
    .issue-item.critical { border-color: #F44336; }
    .issue-item.important { border-color: #FF9800; }
    .issue-item.minor { border-color: #2196F3; }
    .date { color: #888; font-style: italic; }
  </style>
</head>
<body>
  <h1>SEO Audit Report</h1>
  <p><strong>URL:</strong> ${url}</p>
  <p><strong>Date:</strong> <span class="date">${new Date(auditData.date).toLocaleString()}</span></p>
  <p><strong>Overall Score:</strong> <span class="score">${auditData.score}/100</span></p>
  
  <div class="issues">
    <h2>Issues Summary</h2>
    <p>Critical Issues: ${auditData.issues.critical}</p>
    <p>Important Issues: ${auditData.issues.important}</p>
    <p>Minor Issues: ${auditData.issues.opportunities || 0}</p>
  </div>
  
  <h2>Category Details</h2>
  ${Object.entries(auditData.details).map(([category, data]) => `
    <div class="category">
      <h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
      <p>Score: ${data.score}/100</p>
      <p>Issues: ${data.warning + data.failed} (${data.failed} failed, ${data.warning} warnings)</p>
      <p>Passed: ${data.passed}</p>
    </div>
  `).join('')}
</body>
</html>`;
        
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `seo-audit-${url.replace(/[^a-z0-9]/gi, '-')}.html`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
        
        toast({
          title: "HTML экспортирован",
          description: "HTML-отчет успешно сохранен",
        });
      } else {
        toast({
          title: "Недостаточно данных",
          description: "Для экспорта в HTML необходимы полные данные аудита",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error exporting HTML:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Произошла ошибка при экспорте HTML. Пожалуйста, попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(null);
    }
  };
  
  return (
    <DropdownMenuItem 
      onClick={handleExportHTML}
      disabled={isExporting !== null}
    >
      {isExporting === 'html' ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Экспортируется...</span>
        </>
      ) : (
        <>
          <FileCode className="mr-2 h-4 w-4" />
          <span>Экспорт HTML</span>
        </>
      )}
    </DropdownMenuItem>
  );
};

export default ExportHTML;
