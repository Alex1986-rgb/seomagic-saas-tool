
import React from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AuditData } from '@/types/audit';
import { saveAs } from 'file-saver';
import { cleanUrl, formatDate, showExportError, showExportSuccess } from '../export-utils';
import { generateErrorReportPdf } from '@/utils/pdf/errorReportPdf';

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
  const handleExportErrorReport = async () => {
    if (!auditData) {
      showExportError();
      return;
    }
    
    try {
      setIsExporting('error-report');
      
      const pdfBlob = await generateErrorReportPdf({
        auditData, 
        url,
        urls
      });
      
      if (!pdfBlob) throw new Error("Не удалось создать PDF");
      
      saveAs(pdfBlob, `error-report-${cleanUrl(url)}-${formatDate(auditData.date)}.pdf`);
      
      showExportSuccess("Отчет об ошибках экспортирован", "Детальный отчет успешно сохранен в формате PDF");
    } catch (error) {
      console.error('Ошибка при экспорте отчета об ошибках:', error);
      showExportError("Не удалось сохранить отчет. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <DropdownMenuItem 
      onClick={handleExportErrorReport}
      disabled={isExporting !== null || !auditData}
      className="flex items-center gap-2"
    >
      {isExporting === 'error-report' ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Подготовка отчета об ошибках...</span>
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          <span>Скачать отчет об ошибках</span>
        </>
      )}
    </DropdownMenuItem>
  );
};

export default ExportErrorReport;
