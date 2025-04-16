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
        
        await seoApiService.downloadReport(taskId, detailed ? 'detailed' : 'errors');
        
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
    
    if (!auditData) {
      showExportError();
      return;
    }
    
    try {
      setIsExporting('error-report');
      
      const errors = [];
      
      if (auditData?.details?.technical?.items) {
        auditData.details.technical.items
          .filter(item => item.status === 'error' || item.status === 'warning')
          .forEach(item => {
            errors.push({
              url: url,
              errorType: 'Технический',
              errorMessage: item.description || item.title,
              statusCode: 0,
              timestamp: new Date().toISOString(),
              stackTrace: '',
              browser: '',
              device: '',
              userAgent: ''
            });
          });
      }
      
      if (auditData?.details?.seo?.items) {
        auditData.details.seo.items
          .filter(item => item.status === 'error' || item.status === 'warning')
          .forEach(item => {
            errors.push({
              url: url,
              errorType: 'SEO',
              errorMessage: item.description || item.title,
              statusCode: 0,
              timestamp: new Date().toISOString(),
              stackTrace: '',
              browser: '',
              device: '',
              userAgent: ''
            });
          });
      }
      
      if (auditData?.details?.content?.items) {
        auditData.details.content.items
          .filter(item => item.status === 'error' || item.status === 'warning')
          .forEach(item => {
            errors.push({
              url: url,
              errorType: 'Контент',
              errorMessage: item.description || item.title,
              statusCode: 0,
              timestamp: new Date().toISOString(),
              stackTrace: '',
              browser: '',
              device: '',
              userAgent: ''
            });
          });
      }

      if (errors.length === 0) {
        showExportError("Нет ошибок для формирования отчета");
        setIsExporting(null);
        return;
      }
      
      await generateErrorReportPdf(errors, {
        includeStackTrace: detailed,
        includeBrowserInfo: true,
        includeUserAgent: detailed,
        groupByType: true
      });
      
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
