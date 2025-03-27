
import React from 'react';
import { FileJson, Loader2 } from 'lucide-react';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AuditData } from '@/types/audit';
import { saveAs } from 'file-saver';
import { cleanUrl, formatDate, showExportError, showExportSuccess } from '../export-utils';

interface ExportJSONProps {
  auditData?: AuditData;
  url: string;
  isExporting: string | null;
  setIsExporting: (state: string | null) => void;
}

const ExportJSON: React.FC<ExportJSONProps> = ({ 
  auditData, 
  url,
  isExporting,
  setIsExporting
}) => {
  const handleExportJSON = async () => {
    if (!auditData) {
      showExportError();
      return;
    }
    
    try {
      setIsExporting('json');
      
      const jsonData = JSON.stringify(auditData, null, 2);
      const jsonBlob = new Blob([jsonData], { type: 'application/json' });
      saveAs(jsonBlob, `audit-${cleanUrl(url)}-${formatDate(auditData.date)}.json`);
      
      showExportSuccess("JSON экспортирован", "Данные аудита успешно сохранены в формате JSON");
    } catch (error) {
      console.error('Ошибка при экспорте JSON:', error);
      showExportError("Не удалось сохранить данные. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <DropdownMenuItem 
      onClick={handleExportJSON}
      disabled={isExporting !== null || !auditData}
      className="flex items-center gap-2"
    >
      {isExporting === 'json' ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Подготовка JSON...</span>
        </>
      ) : (
        <>
          <FileJson className="h-4 w-4" />
          <span>Экспорт данных (JSON)</span>
        </>
      )}
    </DropdownMenuItem>
  );
};

export default ExportJSON;
