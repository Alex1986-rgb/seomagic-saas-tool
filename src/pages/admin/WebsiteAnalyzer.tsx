
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WebsiteScanner from '@/components/website-scanner/WebsiteScanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import VideoDemo from '@/components/video/VideoDemo';
import { Monitor, BarChart, ChartBar } from 'lucide-react';

const WebsiteAnalyzerPage: React.FC = () => {
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
        {/* Вкладки: максимально тёмный фон, яркие активные вкладки */}
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
