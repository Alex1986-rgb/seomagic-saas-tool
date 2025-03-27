
import React from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AuditData } from '@/types/audit';
import { generateAuditPdf } from '@/utils/pdf';
import { saveAs } from 'file-saver';
import { cleanUrl, formatDate, showExportError, showExportSuccess } from '../export-utils';

interface ExportPDFProps {
  auditData?: AuditData;
  url: string;
  isExporting: string | null;
  setIsExporting: (state: string | null) => void;
}

const ExportPDF: React.FC<ExportPDFProps> = ({ 
  auditData, 
  url,
  isExporting,
  setIsExporting
}) => {
  const handleExportPDF = async () => {
    if (!auditData) {
      showExportError();
      return;
    }
    
    try {
      setIsExporting('pdf');
      
      const pdfBlob = await generateAuditPdf({auditData, url});
      
      if (!pdfBlob) throw new Error("Не удалось создать PDF");
      
      saveAs(pdfBlob, `audit-${cleanUrl(url)}-${formatDate(auditData.date)}.pdf`);
      
      showExportSuccess("PDF экспортирован", "Отчет успешно сохранен в формате PDF");
    } catch (error) {
      console.error('Ошибка при экспорте PDF:', error);
      showExportError("Не удалось сохранить PDF. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <DropdownMenuItem 
      onClick={handleExportPDF}
      disabled={isExporting !== null || !auditData}
      className="flex items-center gap-2"
    >
      {isExporting === 'pdf' ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Подготовка PDF...</span>
        </>
      ) : (
        <>
          <FileText className="h-4 w-4" />
          <span>Скачать PDF отчет</span>
        </>
      )}
    </DropdownMenuItem>
  );
};

export default ExportPDF;
