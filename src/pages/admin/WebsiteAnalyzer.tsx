
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WebsiteScanner from '@/components/website-scanner/WebsiteScanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import VideoDemo from '@/components/video/VideoDemo';
// Используем только разрешённые иконки
import { Monitor, BarChart, ChartBar } from 'lucide-react';

const WebsiteAnalyzerPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Анализатор сайтов | Админ панель</title>
      </Helmet>
      <div className="container mx-auto px-3 md:px-8 py-8 md:py-12 max-w-5xl">
        {/* Темный модный хедер */}
        <div className="mb-9 px-5 py-8 rounded-3xl bg-gradient-to-br from-[#191827] via-[#24213B] to-[#8B5CF6]/30 shadow-2xl flex flex-col md:flex-row items-center gap-7 border border-[#8B5CF6]/20 animate-fade-in transition-all">
          <div className="flex-shrink-0 bg-[#23223b] rounded-2xl p-7 glass-morphism shadow-lg ring-2 ring-[#36CFFF]/70">
            <Monitor className="h-14 w-14 text-[#36CFFF] drop-shadow-[0_0_12px_#36CFFF77] animate-pulse-slow" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-1 tracking-tight bg-gradient-to-r from-[#8B5CF6] via-[#36CFFF] to-[#F97316] bg-clip-text text-transparent drop-shadow">
              Анализатор сайтов
            </h1>
            <p className="text-[#A0A8FF] text-lg font-medium">
              <span className="text-[#36CFFF] font-bold">Современные инструменты</span> для сканирования, анализа и оптимизации сайтов
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <a href="/admin/settings">
                <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#322a57]/90 via-[#8B5CF6]/90 to-[#22213B] text-[#FFC107] font-bold border border-[#FFC107]/25 shadow hover:scale-105 transition-all duration-200 glass-button">
                  <ChartBar className="h-5 w-5 text-[#FFC107] animate-pulse-slow" />
                  Настройки
                </button>
              </a>
              <a href="/admin/analytics">
                <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#0EA5E9]/40 via-[#36CFFF]/70 to-[#23263B] text-[#36CFFF] font-bold border border-[#36CFFF]/40 shadow hover:scale-105 transition-all duration-200 glass-button">
                  <BarChart className="h-5 w-5 text-[#36CFFF] animate-pulse-slow" />
                  Аналитика
                </button>
              </a>
            </div>
          </div>
        </div>
        {/* Темное предупреждение */}
        <Card className="bg-gradient-to-br from-[#201C2C]/85 via-[#23243B]/95 to-[#453F77]/10 border-0 shadow-xl mb-8 transition-all">
          <CardContent className="p-4 flex gap-3 items-center">
            <Monitor className="h-6 w-6 text-[#FFC107] animate-pulse" />
            <p className="text-sm text-[#ffd76b]">
              Для полноценного сканирования сайтов подключите базу данных <span className="text-[#36CFFF] font-semibold">Supabase</span>.
            </p>
          </CardContent>
        </Card>
        {/* Стильные вкладки: тёмные, с яркими иконками */}
        <Tabs defaultValue="scanner" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-3 bg-gradient-to-r from-[#19192a]/90 to-[#22223B]/85 rounded-xl p-1 border border-[#8B5CF6]/20 shadow-inner">
            <TabsTrigger value="scanner" className="flex gap-2 text-white data-[state=active]:bg-[#36CFFF]/95 data-[state=active]:text-white font-semibold rounded-lg transition-all">
              <Monitor className="h-5 w-5 text-[#36CFFF] animate-pulse-slow" />
              Сканер сайтов
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex gap-2 text-white data-[state=active]:bg-[#F97316]/90 data-[state=active]:text-white font-semibold rounded-lg transition-all">
              <BarChart className="h-5 w-5 text-[#F97316] animate-pulse-slow" />
              Возможности
            </TabsTrigger>
          </TabsList>
          <TabsContent value="scanner" className="mt-6">
            <WebsiteScanner />
          </TabsContent>
          <TabsContent value="demo" className="mt-6">
            <Card className="bg-gradient-to-br from-[#181929]/90 via-[#1a1833]/80 to-[#8B5CF6]/15 border-0 shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart className="h-5 w-5 text-[#F97316] animate-pulse-slow" />
                  Возможности сканера
                </CardTitle>
                <CardDescription className="text-[#36CFFF]">
                  Мощные технологии для глубокого анализа сайтов
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <VideoDemo autoplay={true} interval={7000} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#8B5CF6] flex gap-2 items-center">
                      <BarChart className="h-5 w-5 text-[#8B5CF6] drop-shadow-[0_0_8px_#8B5CF6aa]" />
                      Полный аудит сайта
                    </h3>
                    <p className="text-sm text-[#aebbf7]">
                      Комплексная проверка <span className="text-[#36CFFF] font-bold">технических</span> и <span className="text-[#F97316] font-bold">SEO</span> аспектов сайта.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#36CFFF] flex gap-2 items-center">
                      <Monitor className="h-5 w-5 text-[#36CFFF] drop-shadow-[0_0_8px_#36CFFF99]" />
                      Анализ структуры и метаданных
                    </h3>
                    <p className="text-sm text-[#aebbf7]">
                      Визуализация sitemap, <span className="text-[#8B5CF6] font-bold">сканирование страниц</span>, советы по оптимизации.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#F97316] flex gap-2 items-center">
                      <BarChart className="h-5 w-5 text-[#F97316] drop-shadow-[0_0_8px_#F97316bb]" />
                      Генерация карт сайта
                    </h3>
                    <p className="text-sm text-[#aebbf7]">
                      Автоматическое создание <span className="text-[#36CFFF] font-bold">XML</span> и <span className="text-[#F97316] font-bold">HTML</span> карт сайта для поисковых систем.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#0EA5E9] flex gap-2 items-center">
                      <Monitor className="h-5 w-5 text-[#0EA5E9] drop-shadow-[0_0_8px_#0EA5E977]" />
                      Персональные рекомендации
                    </h3>
                    <p className="text-sm text-[#aebbf7]">
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
