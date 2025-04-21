
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WebsiteScanner from '@/components/website-scanner/WebsiteScanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import VideoDemo from '@/components/video/VideoDemo';
import { Monitor, Search, BarChart2, Rocket, AlertTriangle, BarChart, Activity } from 'lucide-react';

const WebsiteAnalyzerPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Анализатор сайтов | Админ панель</title>
      </Helmet>
      <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
        {/* Хедер: Глубокий тёмный градиент и яркие иконки */}
        <div className="mb-8 px-8 py-10 rounded-3xl bg-gradient-to-br from-[#181929] via-[#22243B] to-[#8B5CF6]/40 shadow-2xl flex flex-col md:flex-row items-center gap-8 border border-primary/25 animate-fade-in">
          <div className="flex-shrink-0 bg-[#191b2a]/60 text-primary rounded-full p-8 glass-morphism shadow-lg ring-2 ring-[#8B5CF6]/50">
            <Monitor className="h-14 w-14 text-[#36CFFF] neon-shadow pulse-slow" />
          </div>
          <div className="flex-1 min-w-[210px]">
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight bg-gradient-to-r from-[#8B5CF6] via-[#36CFFF] to-[#F97316] bg-clip-text text-transparent drop-shadow">
              Анализатор сайтов
            </h1>
            <p className="text-muted-foreground text-lg">
              <span className="text-[#36CFFF] font-semibold">Модные инструменты</span> для сканирования, анализа и оптимизации сайтов
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <a href="/admin/settings">
                <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-br from-[#23263B]/70 to-[#191b2a]/85 text-[#FFC107] border border-primary/40 font-semibold shadow hover:scale-105 transition-all duration-200 hover:bg-primary/20">
                  <BarChart2 className="h-5 w-5 text-[#FFC107] animate-bounce" />
                  Настройки
                </button>
              </a>
              <a href="/admin/analytics">
                <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-br from-[#0EA5E9]/10 to-[#36CFFF]/20 text-[#36CFFF] border border-[#36CFFF]/40 font-semibold shadow hover:scale-105 transition-all duration-200 hover:bg-blue-900/20">
                  <BarChart className="h-5 w-5 text-[#36CFFF] rotate-3d" />
                  Аналитика
                </button>
              </a>
            </div>
          </div>
        </div>
        {/* Карточка-предупреждение: Глубокий тёмный фон */}
        <Card className="bg-gradient-to-br from-[#171927]/90 via-[#221F26]/95 to-[#8B5CF6]/25 border-0 shadow-xl mb-8">
          <CardContent className="p-4 flex gap-3 items-center">
            <AlertTriangle className="h-6 w-6 text-amber-400 animate-pulse" />
            <p className="text-sm text-amber-200">
              Для полноценного сканирования сайтов рекомендуется подключить базу данных через <span className="text-[#36CFFF] font-semibold">Supabase</span>.
            </p>
          </CardContent>
        </Card>
        {/* Вкладки: Тёмный глубокий фон + модный бар */}
        <Tabs defaultValue="scanner" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-3 bg-gradient-to-r from-[#1D1338]/90 to-[#23263B]/80 rounded-xl p-1 border border-[#8B5CF6]/20 shadow-inner">
            <TabsTrigger value="scanner" className="flex gap-2 text-white data-[state=active]:bg-[#36CFFF]/80 data-[state=active]:text-white font-semibold rounded-lg transition-all">
              <Activity className="h-5 w-5 text-[#36CFFF] animate-spin-slow" />
              Сканер сайтов
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex gap-2 text-white data-[state=active]:bg-[#F97316]/80 data-[state=active]:text-white font-semibold rounded-lg transition-all">
              <Rocket className="h-5 w-5 text-[#F97316] pulse-slow" />
              Возможности
            </TabsTrigger>
          </TabsList>
          <TabsContent value="scanner" className="mt-6">
            <WebsiteScanner />
          </TabsContent>
          <TabsContent value="demo" className="mt-6">
            <Card className="bg-gradient-to-br from-[#191b2a]/95 via-[#22243B]/90 to-[#8B5CF6]/15 border-0 shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Rocket className="h-5 w-5 text-[#F97316] animate-bounce" />
                  Возможности сканера
                </CardTitle>
                <CardDescription className="text-[#36CFFF]">
                  Яркие технологии для глубокого анализа сайтов
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <VideoDemo autoplay={true} interval={7000} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[#8B5CF6] flex gap-2 items-center">
                      <BarChart2 className="h-5 w-5 text-[#8B5CF6]"/>Полный аудит сайта
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Комплексная проверка <span className="text-[#36CFFF] font-semibold">технических</span> и <span className="text-[#F97316] font-semibold">SEO</span> аспектов сайта.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[#36CFFF] flex gap-2 items-center">
                      <Monitor className="h-5 w-5 text-[#36CFFF]"/>Анализ структуры и метаданных
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Визуализация site map, <span className="text-[#8B5CF6] font-semibold">сканирование страниц</span>, советы по оптимизации.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[#F97316] flex gap-2 items-center">
                      <BarChart className="h-5 w-5 text-[#F97316]"/>Генерация карт сайта
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Автоматическое создание <span className="text-[#36CFFF] font-semibold">XML</span> и <span className="text-[#F97316] font-semibold">HTML</span> карт сайта для поисковых систем.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[#14CC8C] flex gap-2 items-center">
                      <Activity className="h-5 w-5 text-[#14CC8C]"/>Персональные рекомендации
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Советы по <span className="text-[#14CC8C] font-semibold">SEO</span> и <span className="text-[#8B5CF6] font-semibold">производительности</span> для вашего сайта.
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
