
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Search, Download, FileText, BarChart } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SimpleSitemapCreatorTool } from '../audit/deep-crawl';
import { downloadAuditPdfReport, downloadErrorReport } from '@/services/audit/scanner';
import { generateAuditData } from '@/services/audit/generators';

interface WebsiteScannerProps {
  initialUrl?: string;
}

const WebsiteScanner: React.FC<WebsiteScannerProps> = ({ initialUrl = '' }) => {
  const [url, setUrl] = useState(initialUrl);
  const [isScanning, setIsScanning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState('');
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const [auditData, setAuditData] = useState<any>(null);
  const [hasAuditResults, setHasAuditResults] = useState(false);
  const { toast } = useToast();

  // Clear any errors when the component mounts
  useEffect(() => {
    setIsError(false);
  }, []);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    // Reset error state when user changes URL
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

      // Имитация процесса сканирования
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
            // Генерируем тестовые данные аудита
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
    
    // Используем данные аудита, либо генерируем их, если их нет
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
    
    // Используем данные аудита, либо генерируем их, если их нет
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
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Сканирование сайта</CardTitle>
          <CardDescription>
            Введите URL сайта для начала сканирования и создания карты сайта (sitemap)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Например: example.com"
              value={url}
              onChange={handleUrlChange}
              className="flex-1"
            />
            <Button 
              onClick={startFullScan} 
              disabled={isScanning}
              className="gap-2"
            >
              <Search className="h-4 w-4" />
              Сканировать
            </Button>
          </div>

          {isScanning && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{scanStage}</span>
                <span>{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
            </div>
          )}

          {isError && !isScanning && (
            <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              Произошла ошибка при сканировании. Пожалуйста, проверьте URL и попробуйте снова.
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="sitemap">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="sitemap">
            <FileText className="mr-2 h-4 w-4" />
            Карта сайта
          </TabsTrigger>
          <TabsTrigger value="audit">
            <Search className="mr-2 h-4 w-4" />
            Аудит
          </TabsTrigger>
          <TabsTrigger value="reports">
            <BarChart className="mr-2 h-4 w-4" />
            Отчеты
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sitemap" className="mt-4">
          <SimpleSitemapCreatorTool 
            initialUrl={url} 
            onUrlsScanned={handleUrlsScanned} 
          />
        </TabsContent>
        
        <TabsContent value="audit" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Аудит сайта</CardTitle>
              <CardDescription>
                Проверка основных SEO-параметров и выявление проблем
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scannedUrls.length > 0 || hasAuditResults ? (
                <div className="space-y-4">
                  <p className="text-sm">{scannedUrls.length > 0 ? `Найдено ${scannedUrls.length} URL для аудита` : "Аудит готов"}</p>
                  <Button 
                    className="gap-2" 
                    onClick={startFullScan}
                    disabled={isScanning}
                  >
                    <Search className="h-4 w-4" />
                    {hasAuditResults ? "Обновить данные аудита" : "Начать аудит"}
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Сначала выполните сканирование сайта или создайте карту сайта
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Отчеты и рекомендации</CardTitle>
              <CardDescription>
                Генерация отчетов и рекомендаций по оптимизации
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hasAuditResults || scannedUrls.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="gap-2 justify-start" onClick={handleDownloadPdfReport}>
                      <FileText className="h-4 w-4" />
                      Скачать полный SEO-отчет
                    </Button>
                    <Button variant="outline" className="gap-2 justify-start" onClick={handleDownloadErrorReport}>
                      <Download className="h-4 w-4" />
                      Скачать отчет об ошибках
                    </Button>
                    {scannedUrls.length > 0 && (
                      <Button variant="outline" className="gap-2 justify-start">
                        <Download className="h-4 w-4" />
                        Скачать карту сайта
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Доступные отчеты появятся после выполнения аудита
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteScanner;
