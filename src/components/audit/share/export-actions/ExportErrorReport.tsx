
import React, { useState } from 'react';
import { FileDown, Loader2, ChevronsDownUp } from 'lucide-react';
import { DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuPortal } from "@/components/ui/dropdown-menu";
import { AuditData } from '@/types/audit';
import { saveAs } from 'file-saver';
import { cleanUrl, formatDate, showExportError, showExportSuccess } from '../export-utils';
import { generateErrorReportPdf } from '@/utils/pdf/errorReport';

interface ExportErrorReportProps {
  auditData?: AuditData;
  url: string;
  urls?: string[];
  isExporting: string | null;
  setIsExporting: (state: string | null) => void;
}

const ExportErrorReport: React.FC<ExportErrorReportProps> = ({ 
  auditData, 
  url,
  urls,
  isExporting,
  setIsExporting
}) => {
  const handleExportErrorReport = async (detailed: boolean = false) => {
    if (!auditData) {
      showExportError();
      return;
    }
    
    try {
      setIsExporting('error-report');
      
      const pdfBlob = await generateErrorReportPdf({
        auditData, 
        url,
        urls,
        detailed
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
