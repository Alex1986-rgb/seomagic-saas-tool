import React from 'react';
import { Helmet } from 'react-helmet-async';
import WebsiteAnalyzerHeader from '@/components/admin/website-analyzer/WebsiteAnalyzerHeader';
import SupabaseWarning from '@/components/admin/website-analyzer/SupabaseWarning';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWebsiteAnalyzer } from '@/hooks/use-website-analyzer';

const WebsiteAnalyzerPage: React.FC = () => {
  const {
    url,
    isScanning,
    scanProgress,
    scanStage,
    isError,
    handleUrlChange,
    startFullScan,
  } = useWebsiteAnalyzer();

  return (
    <>
      <Helmet>
        <title>Анализатор сайтов | Админ панель</title>
      </Helmet>
      <div className="container mx-auto px-2 md:px-4 py-6 md:py-10 max-w-4xl">
        <WebsiteAnalyzerHeader />
        <SupabaseWarning />
        
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
          <CardContent>
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
