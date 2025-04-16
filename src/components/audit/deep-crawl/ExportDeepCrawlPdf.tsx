import React, { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateDeepCrawlPdf } from '@/utils/pdf/deepCrawlPdf';

interface ExportDeepCrawlPdfProps {
  domain: string;
  urls: string[];
  pageCount: number;
  scanDate?: string;
  pageTypes?: Record<string, number>;
  depthData?: { level: number; count: number }[];
  brokenLinks?: { url: string; statusCode: number }[];
  duplicatePages?: { url: string; similarUrls: string[] }[];
  className?: string;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  enhancedStyling?: boolean;
  includeFullDetails?: boolean;
  children?: React.ReactNode;
}

const ExportDeepCrawlPdf: React.FC<ExportDeepCrawlPdfProps> = ({
  domain,
  urls,
  pageCount,
  scanDate = new Date().toISOString(),
  pageTypes = {},
  depthData = [],
  brokenLinks = [],
  duplicatePages = [],
  className,
  variant = "outline",
  size = "sm",
  enhancedStyling = true,
  includeFullDetails = true,
  children
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  
  const handleExport = async () => {
    if (isExporting) return;
    
    try {
      setIsExporting(true);
      
      toast({
        title: "Подготовка PDF отчета",
        description: "Пожалуйста, подождите...",
      });
      
      const pdfBlob = await generateDeepCrawlPdf({
        domain,
        scanDate,
        pagesScanned: pageCount,
        totalPages: pageCount,
        urls,
        pageTypes,
        depthData,
        brokenLinks,
        duplicatePages,
        includeFullDetails,
        enhancedStyling
      });
      
      if (pdfBlob) {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `detailed-audit-${domain.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Отчет сохранен",
          description: "Полный PDF отчет успешно скачан",
        });
      } else {
        throw new Error("Invalid PDF generation result");
      }
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
      
      toast({
        title: "Ошибка",
        description: "Не удалось создать PDF отчет. Пожалуйста, попробуйте еще раз.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Создание PDF...</span>
        </>
      ) : (
        <>
          <FileText className="h-4 w-4" />
          {children || <span>Скачать полный PDF отчет</span>}
        </>
      )}
    </Button>
  );
};

export default ExportDeepCrawlPdf;
