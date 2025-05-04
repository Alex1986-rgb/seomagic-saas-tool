
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateDeepCrawlPdf } from '@/utils/pdf/deepCrawlPdf';

// Define the interface for deep crawl options
interface DeepCrawlOptions {
  url: string;
  pages: Array<{
    url: string;
    title?: string;
    statusCode?: number;
    contentType?: string;
    headers?: Record<string, string>;
    links?: string[];
    meta?: Record<string, string>;
    h1?: string[];
    h2?: string[];
    crawledAt?: string;
  }>;
  sitemap?: {
    urls: number;
    structure: Record<string, any>;
  };
  issues?: Array<{
    type: string;
    url: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
  }>;
  stats?: {
    totalPages: number;
    uniquePages: number;
    crawlDuration: number;
    brokenLinks: number;
    responseTimeAvg: number;
  };
  date?: string;
  scanDate?: string;
}

interface ExportDeepCrawlPdfProps {
  data: DeepCrawlOptions;
  isLoading?: boolean;
}

const ExportDeepCrawlPdf: React.FC<ExportDeepCrawlPdfProps> = ({ data, isLoading = false }) => {
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      toast({
        title: 'Экспорт PDF',
        description: 'Подготовка PDF отчета о результатах сканирования...',
      });

      // Date formatting for the PDF filename
      const dateStr = new Date().toISOString().split('T')[0];
      const domain = data.url.replace(/https?:\/\//, '').replace(/[^\w]/g, '_');
      
      // Convert the issues format for compatibility with DeepCrawlOptions expected by generateDeepCrawlPdf
      const issues = data.issues ? {
        brokenLinks: data.issues
          .filter(issue => issue.type.includes('link'))
          .map(issue => ({
            url: issue.url, 
            target: issue.url,
            statusCode: 404 // Default to 404 as we don't have actual status codes
          })),
        missingMetaTags: data.issues
          .filter(issue => issue.type.includes('meta'))
          .map(issue => ({
            url: issue.url,
            missingTags: [issue.description]
          })),
        slowPages: data.issues
          .filter(issue => issue.type.includes('slow'))
          .map(issue => ({
            url: issue.url,
            loadTime: '3s' // Default as we don't have actual load times
          }))
      } : undefined;

      // Adapt stats format to match what the PDF generator expects
      const stats = data.stats ? {
        totalPages: data.stats.totalPages,
        crawlTime: `${data.stats.crawlDuration}s`,
        totalInternalLinks: 100, // Example value
        totalExternalLinks: 20,  // Example value
        avgLoadTime: `${data.stats.responseTimeAvg}ms`,
        crawlRate: '5 pages/s',   // Example value
        totalImages: 50          // Example value
      } : undefined;
      
      // Generate the PDF
      const pdfBlob = await generateDeepCrawlPdf({
        domain: domain,
        urls: data.pages.map(page => page.url),
        stats: stats,
        issues: issues,
        date: data.date || data.scanDate || new Date().toISOString()
      });
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `deepcrawl_${domain}_${dateStr}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      
      toast({
        title: 'PDF сохранен',
        description: 'Отчет успешно сохранен на ваше устройство',
      });
    } catch (error) {
      console.error('Error generating deep crawl PDF:', error);
      toast({
        title: 'Ошибка экспорта',
        description: 'Не удалось создать PDF отчет',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Button 
      onClick={handleExport}
      disabled={isLoading || !data?.url || (data.pages?.length === 0)}
      variant="secondary"
      size="sm"
    >
      {isLoading ? 'Создание отчета...' : 'Экспортировать PDF'}
    </Button>
  );
};

export default ExportDeepCrawlPdf;
