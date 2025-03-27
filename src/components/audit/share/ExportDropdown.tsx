
import React from 'react';
import { Download, FileText, FileJson, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { AuditData, AuditHistoryItem } from '@/types/audit';
import { saveAs } from 'file-saver';

interface ExportDropdownProps {
  auditData?: AuditData;
  url: string;
  historyItems?: AuditHistoryItem[];
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({ 
  auditData, 
  url,
  historyItems 
}) => {
  const [isExporting, setIsExporting] = React.useState<string | null>(null);
  const { toast } = useToast();
  
  // Функция для экспорта PDF
  const handleExportPDF = async () => {
    if (!auditData) {
      toast({
        title: "Ошибка",
        description: "Нет данных для экспорта",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsExporting('pdf');
      
      // Имитация подготовки PDF (в реальном проекте здесь должен быть код для создания PDF)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Создаем примитивный PDF для демонстрации
      const pdfBlob = new Blob(['PDF data would be here'], { type: 'application/pdf' });
      saveAs(pdfBlob, `audit-${cleanUrl(url)}-${formatDate(auditData.date)}.pdf`);
      
      toast({
        title: "PDF экспортирован",
        description: "Отчет успешно сохранен в формате PDF",
      });
    } catch (error) {
      console.error('Ошибка при экспорте PDF:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось сохранить PDF. Пожалуйста, попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(null);
    }
  };
  
  // Функция для экспорта JSON
  const handleExportJSON = async () => {
    if (!auditData) {
      toast({
        title: "Ошибка",
        description: "Нет данных для экспорта",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsExporting('json');
      
      // Преобразуем данные в JSON строку
      const jsonData = JSON.stringify(auditData, null, 2);
      const jsonBlob = new Blob([jsonData], { type: 'application/json' });
      saveAs(jsonBlob, `audit-${cleanUrl(url)}-${formatDate(auditData.date)}.json`);
      
      toast({
        title: "JSON экспортирован",
        description: "Данные аудита успешно сохранены в формате JSON",
      });
    } catch (error) {
      console.error('Ошибка при экспорте JSON:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось сохранить данные. Пожалуйста, попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(null);
    }
  };
  
  // Функция для экспорта истории аудитов
  const handleExportHistory = async () => {
    if (!historyItems || historyItems.length === 0) {
      toast({
        title: "Ошибка",
        description: "Нет данных истории для экспорта",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsExporting('history');
      
      // Преобразуем данные истории в JSON строку
      const jsonData = JSON.stringify(historyItems, null, 2);
      const jsonBlob = new Blob([jsonData], { type: 'application/json' });
      saveAs(jsonBlob, `audit-history-${cleanUrl(url)}-${formatDate(new Date().toISOString())}.json`);
      
      toast({
        title: "История экспортирована",
        description: "История аудитов успешно сохранена",
      });
    } catch (error) {
      console.error('Ошибка при экспорте истории:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось сохранить историю. Пожалуйста, попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(null);
    }
  };
  
  // Вспомогательная функция для очистки URL
  const cleanUrl = (url: string): string => {
    return url.replace(/https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '-');
  };
  
  // Вспомогательная функция для форматирования даты
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span>Экспорт</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Форматы экспорта</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
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
        
        {historyItems && historyItems.length > 0 && (
          <DropdownMenuItem 
            onClick={handleExportHistory}
            disabled={isExporting !== null}
            className="flex items-center gap-2"
          >
            {isExporting === 'history' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Подготовка истории...</span>
              </>
            ) : (
              <>
                <FileJson className="h-4 w-4" />
                <span>Экспорт истории аудитов</span>
              </>
            )}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportDropdown;
