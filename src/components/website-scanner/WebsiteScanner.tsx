
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Search, Download, FileText, BarChart } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SimpleSitemapCreatorTool } from '../audit/deep-crawl';

interface WebsiteScannerProps {
  initialUrl?: string;
}

const WebsiteScanner: React.FC<WebsiteScannerProps> = ({ initialUrl = '' }) => {
  const [url, setUrl] = useState(initialUrl);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState('');
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const { toast } = useToast();

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

    setIsScanning(true);
    setScanProgress(0);
    setScanStage('Подготовка к сканированию...');

    try {
      // Simulate the scanning process
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
            break;
        }
      }

      toast({
        title: "Сканирование завершено",
        description: "Сайт успешно просканирован",
      });
    } catch (error) {
      toast({
        title: "Ошибка сканирования",
        description: "Произошла ошибка при сканировании сайта",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
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
              onChange={(e) => setUrl(e.target.value)}
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
              {scannedUrls.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm">Найдено {scannedUrls.length} URL для аудита</p>
                  <Button className="gap-2">
                    <Search className="h-4 w-4" />
                    Начать аудит
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
                <p className="text-sm text-muted-foreground">
                  Доступные отчеты появятся после выполнения аудита
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" disabled className="gap-2 justify-start">
                    <FileText className="h-4 w-4" />
                    Общий SEO-отчет
                  </Button>
                  <Button variant="outline" disabled className="gap-2 justify-start">
                    <Download className="h-4 w-4" />
                    Скачать карту сайта
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteScanner;
