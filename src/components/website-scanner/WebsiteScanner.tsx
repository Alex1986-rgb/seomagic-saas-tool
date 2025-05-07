
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Search, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import ScannerHeader from './components/ScannerHeader';
import ScannerTabs from './components/ScannerTabs';
import ScanForm from '@/components/admin/website-analyzer/ScanForm';
import { generateAuditData } from '@/services/audit/generators';
import { downloadAuditPdfReport, downloadErrorReport } from '@/services/audit/scanner';
import { useMobile } from '@/hooks/use-mobile';

const WebsiteScanner = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState('');
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const [auditData, setAuditData] = useState<any>(null);
  const [hasAuditResults, setHasAuditResults] = useState(false);
  const { toast } = useToast();
  const isMobile = useMobile();

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (isError) {
      setIsError(false);
    }
  };

  const handleUrlsScanned = (urls: string[]) => {
    setScannedUrls(urls);
    toast({
      title: "Сканирование завершено",
      description: `Обнаружено ${urls.length} URL на сайте`,
    });
  };

  const startFullScan = async () => {
    if (!url) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите URL сайта",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsScanning(true);
      setIsError(false);
      setScanProgress(0);
      setScanStage('Подготовка к сканированию...');

      for (let i = 1; i <= 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setScanProgress(i * 10);
        
        switch (i) {
          case 2:
            setScanStage('Анализ структуры сайта...');
            break;
          case 4:
            setScanStage('Сканирование страниц...');
            break;
          case 6:
            setScanStage('Проверка метаданных...');
            break;
          case 8:
            setScanStage('Генерация отчета...');
            break;
          case 10:
            setScanStage('Сканирование завершено');
            const generatedData = generateAuditData(url);
            setAuditData(generatedData);
            setHasAuditResults(true);
            break;
        }
      }

      toast({
        title: "Сканирование завершено",
        description: "Сайт успешно просканирован",
      });
    } catch (error) {
      console.error("Scan error:", error);
      setIsError(true);
      toast({
        title: "Ошибка сканирования",
        description: "Произошла ошибка при сканировании сайта",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleDownloadPdfReport = async () => {
    if (!scannedUrls.length && !hasAuditResults) {
      toast({
        title: "Нет данных",
        description: "Сначала выполните сканирование сайта",
        variant: "destructive",
      });
      return;
    }
    
    const data = auditData || generateAuditData(url);
    
    toast({
      title: "Создание PDF",
      description: "Подготовка отчета...",
    });
    
    try {
      const domain = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const success = await downloadAuditPdfReport(domain, scannedUrls, data);
      
      if (success) {
        toast({
          title: "Готово",
          description: "PDF-отчет успешно скачан",
        });
      } else {
        throw new Error("Не удалось создать PDF");
      }
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать PDF-отчет",
        variant: "destructive",
      });
    }
  };
  
  const handleDownloadErrorReport = async () => {
    if (!scannedUrls.length && !hasAuditResults) {
      toast({
        title: "Нет данных",
        description: "Сначала выполните сканирование сайта",
        variant: "destructive",
      });
      return;
    }
    
    const data = auditData || generateAuditData(url);
    
    toast({
      title: "Создание отчета об ошибках",
      description: "Подготовка отчета...",
    });
    
    try {
      const domain = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const success = await downloadErrorReport(domain, scannedUrls, data);
      
      if (success) {
        toast({
          title: "Готово",
          description: "Отчет об ошибках успешно скачан",
        });
      } else {
        throw new Error("Не удалось создать отчет об ошибках");
      }
    } catch (error) {
      console.error("Error report generation error:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать отчет об ошибках",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <ScannerHeader />
      <CardContent className="p-3 md:p-6">
        <ScanForm
          url={url}
          isScanning={isScanning}
          scanProgress={scanProgress}
          scanStage={scanStage}
          isError={isError}
          onUrlChange={handleUrlChange}
          onStartScan={startFullScan}
        />
      </CardContent>

      <ScannerTabs
        url={url}
        onUrlsScanned={handleUrlsScanned}
        scannedUrls={scannedUrls}
        hasAuditResults={hasAuditResults}
        isScanning={isScanning}
        startFullScan={startFullScan}
        handleDownloadPdfReport={handleDownloadPdfReport}
        handleDownloadErrorReport={handleDownloadErrorReport}
      />
    </div>
  );
};

export default WebsiteScanner;
