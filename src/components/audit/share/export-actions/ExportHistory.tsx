
import React from 'react';
import { FileJson, Loader2 } from 'lucide-react';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AuditHistoryItem } from '@/types/audit';
import { saveAs } from 'file-saver';
import { cleanUrl, formatDate, showExportError, showExportSuccess } from '../export-utils';

interface ExportHistoryProps {
  historyItems?: AuditHistoryItem[];
  url: string;
  isExporting: string | null;
  setIsExporting: (state: string | null) => void;
}

const ExportHistory: React.FC<ExportHistoryProps> = ({ 
  historyItems, 
  url,
  isExporting,
  setIsExporting
}) => {
  const handleExportHistory = async () => {
    if (!historyItems || historyItems.length === 0) {
      showExportError("Нет данных истории для экспорта");
      return;
    }
    
    try {
      setIsExporting('history');
      
      const jsonData = JSON.stringify(historyItems, null, 2);
      const jsonBlob = new Blob([jsonData], { type: 'application/json' });
      saveAs(jsonBlob, `audit-history-${cleanUrl(url)}-${formatDate(new Date().toISOString())}.json`);
      
      showExportSuccess("История экспортирована", "История аудитов успешно сохранена");
    } catch (error) {
      console.error('Ошибка при экспорте истории:', error);
      showExportError("Не удалось сохранить историю. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsExporting(null);
    }
  };

  if (!historyItems || historyItems.length === 0) {
    return null;
  }

  return (
    <DropdownMenuItem 
      onClick={handleExportHistory}
      disabled={isExporting !== null}
      className="flex items-center gap-2"
    >
      {isExporting === 'history' ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Подготовка истории JSON...</span>
        </>
      ) : (
        <>
          <FileJson className="h-4 w-4" />
          <span>Экспорт истории аудитов (JSON)</span>
        </>
      )}
    </DropdownMenuItem>
  );
};

export default ExportHistory;
