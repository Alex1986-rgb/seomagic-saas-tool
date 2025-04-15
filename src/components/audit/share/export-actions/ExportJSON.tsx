
import React from 'react';
import { FileJson } from 'lucide-react';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { AuditData } from '@/types/audit';
import { seoApiService } from '@/api/seoApiService';

interface ExportJSONProps {
  auditData?: AuditData;
  url: string;
  isExporting: string | null;
  setIsExporting: (value: string | null) => void;
  taskId?: string | null;
}

const ExportJSON: React.FC<ExportJSONProps> = ({ 
  auditData, 
  url, 
  isExporting, 
  setIsExporting,
  taskId
}) => {
  const { toast } = useToast();
  
  const handleExportJSON = async () => {
    setIsExporting('json');
    
    try {
      if (taskId) {
        // Use backend API
        await seoApiService.exportJSON(taskId);
        
        toast({
          title: "JSON экспортирован",
          description: "Данные в формате JSON успешно сохранены",
        });
      } else if (auditData) {
        // Use frontend implementation
        const dataStr = JSON.stringify(auditData, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
        const exportName = `audit_${auditData.id || new Date().getTime()}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportName);
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);
        
        toast({
          title: "JSON экспортирован",
          description: "Данные в формате JSON успешно сохранены",
        });
      } else {
        toast({
          title: "Недостаточно данных",
          description: "Для экспорта в JSON необходимы полные данные аудита",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error exporting JSON:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Произошла ошибка при экспорте JSON. Пожалуйста, попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(null);
    }
  };
  
  return (
    <DropdownMenuItem 
      onClick={handleExportJSON}
      disabled={isExporting !== null}
    >
      <FileJson className="mr-2 h-4 w-4" />
      <span>{isExporting === 'json' ? 'Экспортируется...' : 'Экспорт JSON'}</span>
    </DropdownMenuItem>
  );
};

export default ExportJSON;
