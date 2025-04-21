
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WebsiteScanner from '@/components/website-scanner/WebsiteScanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import VideoDemo from '@/components/video/VideoDemo';
import { Monitor, BarChart, ChartBar, Globe, FileDown, Download, AlertTriangle, Loader, Search, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { firecrawlService } from '@/services/api/firecrawl';
import DeepCrawlButton from '@/components/audit/deep-crawl/DeepCrawlButton';
import { useToast } from '@/hooks/use-toast';

const WebsiteAnalyzerPage: React.FC = () => {
  const [siteUrl, setSiteUrl] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [scanComplete, setScanComplete] = useState<boolean>(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [sitemap, setSitemap] = useState<string | null>(null);
  const [maxPages, setMaxPages] = useState<number>(15000000); // Устанавливаем максимум по умолчанию
  const { toast } = useToast();

  // Функция для запуска полного сканирования сайта
  const startFullScan = async () => {
    if (!siteUrl) {
      toast({
        title: "Ошибка",
        description: "Введите URL сайта для сканирования",
        variant: "destructive"
      });
      return;
    }

    try {
      // Нормализуем URL - убедимся, что он имеет префикс http/https
      const normalizedUrl = !siteUrl.startsWith('http') ? `https://${siteUrl}` : siteUrl;
      
      setIsScanning(true);
      setScanProgress(0);
      setScanComplete(false);
      setScanError(null);
      setSitemap(null);
      setPageCount(0);
      
      toast({
        title: "Сканирование запущено",
        description: `Начинаем полное сканирование сайта ${normalizedUrl}`,
      });

      // Запускаем процесс сканирования через firecrawlService
      const taskId = await firecrawlService.startCrawl(normalizedUrl, maxPages);
      
      if (!taskId) {
        throw new Error("Не удалось запустить задачу сканирования");
      }
      
      // Настраиваем интервал опроса статуса сканирования
      const intervalId = setInterval(async () => {
        try {
          const status = await firecrawlService.getStatus(taskId);
          
          // Обновляем информацию о прогрессе
          const progress = status.progress || 0;
          const pagesScanned = status.pages_scanned || 0;
          const currentScanUrl = status.current_url || '';
          
          setScanProgress(progress);
          setPageCount(pagesScanned);
          setCurrentUrl(currentScanUrl);
          
          // Проверяем завершение сканирования
          if (status.status === 'completed') {
            clearInterval(intervalId);
            setScanComplete(true);
            setIsScanning(false);
            
            // Пытаемся загрузить sitemap
            try {
              const sitemapContent = await firecrawlService.downloadSitemap(taskId);
              if (sitemapContent) {
                setSitemap(sitemapContent);
                
                toast({
                  title: "Сканирование завершено",
                  description: `Найдено ${pagesScanned} страниц. Sitemap успешно создан.`,
                });
              } else {
                toast({
                  title: "Сканирование завершено",
                  description: `Найдено ${pagesScanned} страниц. Sitemap не был создан.`,
                  variant: "warning"
                });
              }
            } catch (e) {
              console.error("Ошибка при получении sitemap:", e);
              toast({
                title: "Sitemap не создан",
                description: "Произошла ошибка при создании sitemap",
                variant: "destructive"
              });
            }
          }
          
          // Проверяем ошибку в статусе
          if (status.status === 'failed') {
            clearInterval(intervalId);
            setScanComplete(false);
            setIsScanning(false);
            setScanError(status.error || "Произошла ошибка при сканировании");
            
            toast({
              title: "Ошибка сканирования",
              description: status.error || "Произошла ошибка при сканировании сайта",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error("Ошибка при проверке статуса:", error);
        }
      }, 3000); // Опрашиваем статус каждые 3 секунды
      
      // Очистка интервала при размонтировании компонента
      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    } catch (error) {
      setIsScanning(false);
      setScanError(error instanceof Error ? error.message : "Неизвестная ошибка");
      console.error("Ошибка при запуске сканирования:", error);
      
      toast({
        title: "Ошибка запуска сканирования",
        description: error instanceof Error ? error.message : "Неизвестная ошибка при запуске сканирования",
        variant: "destructive"
      });
    }
  };

  // Функция для скачивания sitemap
  const downloadSitemap = () => {
    if (!sitemap) return;
    
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sitemap-${siteUrl.replace(/[^a-zA-Z0-9]/g, '-')}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Файл sitemap скачан",
      description: "Sitemap.xml успешно сохранен",
    });
  };

  // Функция для отмены сканирования (заглушка, будет реализована через firecrawlService)
  const cancelScan = () => {
    setIsScanning(false);
    toast({
      title: "Сканирование отменено",
      description: "Процесс сканирования был прерван",
    });
  };

  // Обработчик завершения сканирования через DeepCrawlButton
  const handleCrawlComplete = (urls: string[]) => {
    if (urls && urls.length > 0) {
      setPageCount(urls.length);
      setScanComplete(true);
      toast({
        title: "Сканирование завершено",
        description: `Найдено ${urls.length} страниц.`,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Анализатор сайтов | Админ панель</title>
      </Helmet>
      <div className="container mx-auto px-2 md:px-4 py-6 md:py-10 max-w-4xl">
        {/* Хедер: яркий логотип и контрастный фон */}
        <div className="mb-7 px-3 py-6 rounded-2xl bg-[#191827] shadow-xl flex flex-col md:flex-row items-center gap-5 border border-[#23223b]">
          <div className="flex-shrink-0 bg-[#23223b] rounded-xl p-6 shadow-lg ring-2 ring-[#36CFFF]/70 flex items-center justify-center">
            <Monitor className="h-12 w-12 text-[#36CFFF] animate-pulse-slow" />
          </div>
          <div className="flex-1 min-w-[180px]">
            <h1
              className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight text-transparent bg-gradient-to-r from-[#8B5CF6] via-[#36CFFF] to-[#F97316] bg-clip-text"
            >
              Анализатор сайтов
            </h1>
            <p className="text-[#A0A8FF] text-sm md:text-base font-medium">
              <span className="text-[#36CFFF] font-bold">Современные инструменты </span>
              для сканирования, анализа и оптимизации сайтов.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <a href="/admin/settings">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#22213B] text-[#8B5CF6] font-bold border border-[#8B5CF6]/40 hover:bg-[#8B5CF6] hover:text-white transition-all duration-200">
                  <ChartBar className="h-5 w-5" />
                  Настройки
                </button>
              </a>
              <a href="/admin/analytics">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#22213B] text-[#F97316] font-bold border border-[#F97316]/40 hover:bg-[#F97316] hover:text-white transition-all duration-200">
                  <BarChart className="h-5 w-5" />
                  Аналитика
                </button>
              </a>
            </div>
          </div>
        </div>
        
        {/* Предупреждение о Supabase */}
        <div className="flex items-center gap-3 bg-[#191827]/95 border-l-4 border-[#FFC107] rounded-xl p-3 shadow mb-8">
          <Monitor className="h-6 w-6 text-[#FFC107]" />
          <span className="text-[#ffd76b] text-sm">
            Для полноценного сканирования подключите базу данных <span className="text-[#36CFFF] font-semibold">Supabase</span>.
          </span>
        </div>

        {/* Новый блок для полного сканирования сайта */}
        <Card className="mb-8 bg-[#181929] border-[#22213B] shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Globe className="h-6 w-6 text-[#36CFFF]" />
              Полное сканирование сайта и создание Sitemap
            </CardTitle>
            <CardDescription className="text-[#A0A8FF]">
              Запустите глубокое сканирование сайта без ограничений по количеству страниц и получите подробный отчет
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <Label htmlFor="site-url" className="text-[#A0A8FF] mb-1 block">URL сайта для сканирования</Label>
                <Input 
                  id="site-url" 
                  placeholder="Введите URL (например, example.com)" 
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  className="bg-[#22213B] border-[#36CFFF]/30 text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <Label htmlFor="max-pages" className="text-[#A0A8FF] mb-1 block">Макс. страниц</Label>
                <Input 
                  id="max-pages" 
                  type="number" 
                  min={1000}
                  max={15000000}
                  value={maxPages}
                  onChange={(e) => setMaxPages(Number(e.target.value))}
                  className="bg-[#22213B] border-[#36CFFF]/30 text-white"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={startFullScan}
                disabled={isScanning || !siteUrl} 
                className="bg-[#36CFFF] hover:bg-[#0EA5E9] text-black font-bold flex items-center gap-2"
              >
                {isScanning ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {isScanning ? "Сканирование..." : "Запустить полное сканирование"}
              </Button>
              
              {isScanning && (
                <Button 
                  onClick={cancelScan} 
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  Отменить
                </Button>
              )}
              
              {scanComplete && sitemap && (
                <Button 
                  onClick={downloadSitemap}
                  variant="outline" 
                  className="bg-[#22213B] border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white flex items-center gap-2"
                >
                  <FileDown className="h-4 w-4" />
                  Скачать Sitemap
                </Button>
              )}
              
              <DeepCrawlButton url={siteUrl} onCrawlComplete={handleCrawlComplete} />
            </div>
            
            {/* Блок статуса сканирования */}
            {isScanning && (
              <div className="mt-4 p-4 bg-[#22213B] rounded-lg border border-[#36CFFF]/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#A0A8FF] text-sm">Прогресс сканирования:</span>
                  <Badge className="bg-[#36CFFF] text-black">{scanProgress}%</Badge>
                </div>
                <Progress value={scanProgress} className="h-2 mb-3" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-[#A0A8FF]">Найдено страниц:</span>
                    <span className="text-white ml-2 font-bold">{pageCount}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-[#A0A8FF]">Текущий URL:</span>
                    <span className="text-white ml-2 opacity-80">{currentUrl.substring(0, 30)}...</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Результаты сканирования */}
            {scanComplete && (
              <div className="mt-4 p-4 bg-[#22213B] rounded-lg border border-[#0EA5E9]/30">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-green-600 text-white">Сканирование завершено</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Результаты сканирования</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#A0A8FF]">Просканировано страниц:</span>
                        <span className="text-white font-bold">{pageCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#A0A8FF]">Сгенерирован Sitemap:</span>
                        <span className="text-white font-bold">{sitemap ? 'Да' : 'Нет'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#A0A8FF]">Размер Sitemap:</span>
                        <span className="text-white font-bold">{sitemap ? `${(sitemap.length / 1024).toFixed(2)} KB` : '-'}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        onClick={downloadSitemap}
                        disabled={!sitemap}
                        className="w-full bg-[#0EA5E9] hover:bg-[#0EA5E9]/80 text-white flex items-center justify-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Скачать полный Sitemap
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Рекомендации по оптимизации</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="mt-1 text-green-500">•</div>
                        <span className="text-[#A0A8FF]">Загрузите файл sitemap.xml в корневую директорию сайта</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 text-green-500">•</div>
                        <span className="text-[#A0A8FF]">Добавьте ссылку на sitemap в файл robots.txt</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 text-green-500">•</div>
                        <span className="text-[#A0A8FF]">Отправьте sitemap в Google Search Console и Яндекс.Вебмастер</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 text-green-500">•</div>
                        <span className="text-[#A0A8FF]">Запускайте обновление sitemap не реже раза в неделю</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {/* Сообщение об ошибке */}
            {scanError && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Ошибка сканирования</AlertTitle>
                <AlertDescription>{scanError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        
        {/* Вкладки с основным UI */}
        <Tabs defaultValue="scanner" className="mb-4">
          <TabsList className="flex w-full gap-2 bg-[#1B1C2B] rounded-xl p-1 border border-[#22213B]">
            <TabsTrigger value="scanner" className="flex gap-2 text-[#36CFFF] data-[state=active]:bg-[#36CFFF] data-[state=active]:text-white font-semibold rounded-lg transition-all px-3 py-1.5">
              <Monitor className="h-5 w-5" />
              Сканер
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex gap-2 text-[#F97316] data-[state=active]:bg-[#F97316]/90 data-[state=active]:text-white font-semibold rounded-lg transition-all px-3 py-1.5">
              <BarChart className="h-5 w-5" />
              Возможности
            </TabsTrigger>
          </TabsList>
          <TabsContent value="scanner" className="mt-5">
            <WebsiteScanner />
          </TabsContent>
          <TabsContent value="demo" className="mt-5">
            <Card className="bg-[#181929] shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart className="h-5 w-5 text-[#F97316]" />
                  Возможности сканера
                </CardTitle>
                <CardDescription className="text-[#36CFFF]">
                  Мощные технологии для глубокого анализа сайтов
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <VideoDemo autoplay={true} interval={7000} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-8">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-[#8B5CF6] flex gap-2 items-center">
                      <BarChart className="h-5 w-5 text-[#8B5CF6]" />
                      Полный аудит сайта
                    </h3>
                    <p className="text-xs text-[#aebbf7]">
                      Комплексная проверка <span className="text-[#36CFFF] font-bold">технических</span> и <span className="text-[#F97316] font-bold">SEO</span> аспектов сайта.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-[#36CFFF] flex gap-2 items-center">
                      <Monitor className="h-5 w-5 text-[#36CFFF]" />
                      Анализ структуры и метаданных
                    </h3>
                    <p className="text-xs text-[#aebbf7]">
                      Визуализация sitemap, <span className="text-[#8B5CF6] font-bold">сканирование страниц</span>, советы по оптимизации.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-[#F97316] flex gap-2 items-center">
                      <BarChart className="h-5 w-5 text-[#F97316]" />
                      Генерация карт сайта
                    </h3>
                    <p className="text-xs text-[#aebbf7]">
                      Автоматическое создание <span className="text-[#36CFFF] font-bold">XML</span> и <span className="text-[#F97316] font-bold">HTML</span> карт сайта для поисковых систем.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-[#36CFFF] flex gap-2 items-center">
                      <Monitor className="h-5 w-5 text-[#36CFFF]" />
                      Персональные рекомендации
                    </h3>
                    <p className="text-xs text-[#aebbf7]">
                      Советы по <span className="text-[#0EA5E9] font-bold">SEO</span> и <span className="text-[#8B5CF6] font-bold">производительности</span> для вашего сайта.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default WebsiteAnalyzerPage;
