
import React, { useState } from 'react';
import { FileDown, Loader2, ChevronsDownUp } from 'lucide-react';
import { DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuPortal } from "@/components/ui/dropdown-menu";
import { AuditData } from '@/types/audit';
import { saveAs } from 'file-saver';
import { cleanUrl, formatDate, showExportError, showExportSuccess } from '../export-utils';
import { generateErrorReportPdf } from '@/utils/pdf/errorReport';
import { seoApiService } from '@/api/seoApiService';

interface ExportErrorReportProps {
  auditData?: AuditData;
  url: string;
  urls?: string[];
  isExporting: string | null;
  setIsExporting: (state: string | null) => void;
  taskId?: string | null;
}

const ExportErrorReport: React.FC<ExportErrorReportProps> = ({ 
  auditData, 
  url,
  urls,
  isExporting,
  setIsExporting,
  taskId
}) => {
  const handleExportErrorReport = async (detailed: boolean = false) => {
    if (taskId) {
      try {
        setIsExporting('error-report');
        
        // Use backend API to generate the report
        await seoApiService.downloadReport(taskId, detailed ? 'full' : 'errors');
        
        showExportSuccess(
          detailed ? "Детальный отчет экспортирован" : "Отчет об ошибках экспортирован", 
          "Отчет успешно сохранен в формате PDF"
        );
      } catch (error) {
        console.error('Ошибка при экспорте отчета об ошибках:', error);
        showExportError("Не удалось сохранить отчет. Пожалуйста, попробуйте еще раз.");
      } finally {
        setIsExporting(null);
      }
      return;
    }
    
    // Frontend implementation for when backend is not available
    if (!auditData) {
      showExportError();
      return;
    }
    
    try {
      setIsExporting('error-report');
      
      // Create errors array from audit data
      const errors = [];
      
      if (auditData?.details?.technical?.items) {
        auditData.details.technical.items
          .filter(item => item.status === 'error' || item.status === 'warning')
          .forEach(item => {
            errors.push({
              url: url,
              type: 'Технический',
              description: item.description || item.title,
              severity: item.status === 'error' ? 'high' : 'medium'
            });
          });
      }
      
      if (auditData?.details?.seo?.items) {
        auditData.details.seo.items
          .filter(item => item.status === 'error' || item.status === 'warning')
          .forEach(item => {
            errors.push({
              url: url,
              type: 'SEO',
              description: item.description || item.title,
              severity: item.status === 'error' ? 'high' : 'medium'
            });
          });
      }
      
      if (auditData?.details?.content?.items) {
        auditData.details.content.items
          .filter(item => item.status === 'error' || item.status === 'warning')
          .forEach(item => {
            errors.push({
              url: url,
              type: 'Контент',
              description: item.description || item.title,
              severity: item.status === 'error' ? 'high' : 'medium'
            });
          });
      }

      if (errors.length === 0) {
        showExportError("Нет ошибок для формирования отчета");
        setIsExporting(null);
        return;
      }
      
      const pdfBlob = await generateErrorReportPdf({
        domain: url,
        errors: errors,
        scanDate: auditData.date,
        url,
        urls,
        detailed,
        auditData
      });
      
      if (!pdfBlob) throw new Error("Не удалось создать PDF");
      
      const filename = detailed 
        ? `detailed-error-report-${cleanUrl(url)}-${formatDate(auditData.date)}.pdf`
        : `error-report-${cleanUrl(url)}-${formatDate(auditData.date)}.pdf`;
      
      saveAs(pdfBlob, filename);
      
      showExportSuccess(
        detailed ? "Детальный отчет экспортирован" : "Отчет об ошибках экспортирован", 
        "Отчет успешно сохранен в формате PDF"
      );
    } catch (error) {
      console.error('Ошибка при экспорте отчета об ошибках:', error);
      showExportError("Не удалось сохранить отчет. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger 
        disabled={isExporting !== null || !auditData}
        className="flex items-center gap-2"
      >
        {isExporting === 'error-report' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Подготовка отчета...</span>
          </>
        ) : (
          <>
            <FileDown className="h-4 w-4" />
            <span>Отчет об ошибках</span>
          </>
        )}
      </DropdownMenuSubTrigger>
      
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem 
            onClick={() => handleExportErrorReport(false)}
            className="flex items-center gap-2"
          >
            <FileDown className="h-4 w-4" />
            <span>Стандартный отчет</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => handleExportErrorReport(true)}
            className="flex items-center gap-2"
          >
            <ChevronsDownUp className="h-4 w-4" />
            <span>Детальный отчет</span>
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};

export default ExportErrorReport;
