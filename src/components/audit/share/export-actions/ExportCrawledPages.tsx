import { useState } from 'react';
import { FileArchive, Loader2 } from 'lucide-react';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import JSZip from 'jszip';

interface ExportCrawledPagesProps {
  auditId?: string;
  isExporting: string | null;
  setIsExporting: (value: string | null) => void;
}

const ExportCrawledPages = ({ auditId, isExporting, setIsExporting }: ExportCrawledPagesProps) => {
  const { toast } = useToast();

  const handleExport = async () => {
    if (!auditId) {
      toast({
        title: "Ошибка",
        description: "ID аудита не найден",
        variant: "destructive"
      });
      return;
    }

    setIsExporting('crawled-pages');

    try {
      const { data: pages, error } = await supabase
        .from('crawled_pages')
        .select('url, html, status_code')
        .eq('audit_id', auditId);

      if (error) throw error;

      if (!pages || pages.length === 0) {
        toast({
          title: "Нет данных",
          description: "Нет сохраненных страниц для экспорта",
          variant: "destructive"
        });
        setIsExporting(null);
        return;
      }

      const zip = new JSZip();

      pages.forEach((page, index) => {
        const filename = page.url
          .replace(/^https?:\/\//, '')
          .replace(/[^a-zA-Z0-9-_.]/g, '_')
          .substring(0, 100) + '.html';

        const content = page.html || `<!-- Страница не загружена (статус: ${page.status_code}) -->`;
        zip.file(filename, content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `crawled-pages-${Date.now()}.zip`;
      link.click();

      URL.revokeObjectURL(url);

      toast({
        title: "Архив создан",
        description: `Скачано ${pages.length} HTML страниц`,
      });
    } catch (error) {
      console.error('Error exporting crawled pages:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать архив",
        variant: "destructive"
      });
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <DropdownMenuItem onClick={handleExport} disabled={isExporting !== null}>
      {isExporting === 'crawled-pages' ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <FileArchive className="mr-2 h-4 w-4" />
      )}
      Скачать HTML страницы
    </DropdownMenuItem>
  );
};

export default ExportCrawledPages;
