
import React from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AuditHistoryItem } from '@/types/audit';
import { generateHistoryPDF } from '@/utils/pdf/historyPdf';
import { saveAs } from 'file-saver';
import { cleanUrl, formatDate, showExportError, showExportSuccess } from '../export-utils';

interface ExportHistoryPDFProps {
  historyItems?: AuditHistoryItem[];
  url: string;
  isExporting: string | null;
  setIsExporting: (state: string | null) => void;
  taskId?: string | null;
}

const ExportHistoryPDF: React.FC<ExportHistoryPDFProps> = ({ 
  historyItems, 
  url,
  isExporting,
  setIsExporting,
  taskId
}) => {
  const handleExportHistoryPDF = async () => {
    if (!historyItems || historyItems.length === 0) {
      showExportError("Нет данных истории для экспорта в PDF");
      return;
    }
    
    try {
      setIsExporting('historyPdf');
      
      const domain = cleanUrl(url);
      const pdfBlob = await generateHistoryPDF(historyItems, domain);
      
      if (!pdfBlob) throw new Error("Не удалось создать PDF истории");
      
      saveAs(pdfBlob, `audit-history-${domain}-${formatDate(new Date().toISOString())}.pdf`);
      
      showExportSuccess("PDF истории экспортирован", "История аудитов успешно сохранена в PDF");
    } catch (error) {
      console.error('Ошибка при экспорте PDF истории:', error);
      showExportError("Не удалось сохранить историю в PDF. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsExporting(null);
    }
  };

  if (!historyItems || historyItems.length === 0) {
    return null;
  }

  return (
    <DropdownMenuItem 
      onClick={handleExportHistoryPDF}
      disabled={isExporting !== null}
      className="flex items-center gap-2"
    >
      {isExporting === 'historyPdf' ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Подготовка PDF истории...</span>
        </>
      ) : (
        <>
          <FileText className="h-4 w-4" />
          <span>Экспорт истории аудитов (PDF)</span>
        </>
      )}
    </DropdownMenuItem>
  );
};

export default ExportHistoryPDF;
