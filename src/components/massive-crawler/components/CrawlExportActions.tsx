
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { firecrawlService } from '@/services/api/firecrawlService';

interface CrawlExportActionsProps {
  taskId: string;
}

export const CrawlExportActions = ({ taskId }: CrawlExportActionsProps) => {
  const { toast } = useToast();

  const handleExport = async (format: 'json' | 'csv' | 'xml' | 'sitemap') => {
    try {
      const blob = await firecrawlService.exportCrawlResults(taskId, format);
      
      // Create temporary download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `crawl-results-${taskId}.${format === 'sitemap' ? 'xml' : format}`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "Экспорт успешен",
        description: `Результаты экспортированы в формате ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Error exporting results:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось экспортировать результаты",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-end pt-2">
      <Button variant="outline" size="sm" onClick={() => handleExport('json')} className="gap-1">
        <FileDown className="h-3 w-3" />
        JSON
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleExport('sitemap')} className="gap-1">
        <FileDown className="h-3 w-3" />
        Sitemap XML
      </Button>
      <Button size="sm" onClick={() => handleExport('sitemap')} className="gap-1">
        <Download className="h-3 w-3" />
        Скачать все
      </Button>
    </div>
  );
};
