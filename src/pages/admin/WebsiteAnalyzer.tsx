
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WebsiteScanner from '@/components/website-scanner/WebsiteScanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import VideoDemo from '@/components/video/VideoDemo';
import { Monitor, BarChart2, Rocket, AlertTriangle, BarChart, Activity } from 'lucide-react';

const WebsiteAnalyzerPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Анализатор сайтов | Админ панель</title>
      </Helmet>
      <div className="container mx-auto px-4 md:px-6 py-10 max-w-5xl">
        {/* Тёмный модный хедер с яркими акцентами */}
        <div className="mb-8 px-8 py-10 rounded-3xl bg-gradient-to-br from-[#191827] via-[#24213B] to-[#8B5CF6]/30 shadow-2xl flex flex-col md:flex-row items-center gap-8 border border-[#8B5CF6]/25 animate-fade-in transition-all">
          <div className="flex-shrink-0 bg-[#22213B] text-primary rounded-full p-8 glass-morphism shadow-lg ring-2 ring-[#36CFFF]/80">
            <Monitor className="h-16 w-16 text-[#36CFFF] drop-shadow-[0_0_15px_#36CFFF77] animate-pulse-slow" />
          </div>
          <div className="flex-1 min-w-[210px]">
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight bg-gradient-to-r from-[#8B5CF6] via-[#36CFFF] to-[#F97316] bg-clip-text text-transparent drop-shadow">
              Анализатор сайтов
            </h1>
            <p className="text-[#A0A8FF] text-lg font-medium">
              <span className="text-[#36CFFF] font-bold">Современные инструменты</span> для сканирования, анализа и оптимизации сайтов
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <a href="/admin/settings">
                <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#322a57] via-[#8B5CF6]/80 to-[#22213B] text-[#FFC107] font-bold border border-[#FFC107]/30 shadow hover:scale-105 transition-all duration-200 hover:bg-[#30246B]/60">
                  <BarChart2 className="h-5 w-5 text-[#FFC107] animate-bounce" />
                  Настройки
                </button>
              </a>
              <a href="/admin/analytics">
                <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#0EA5E9]/30 via-[#36CFFF]/50 to-[#23263B] text-[#36CFFF] font-bold border border-[#36CFFF]/40 shadow hover:scale-105 transition-all duration-200 hover:bg-blue-900/30">
                  <BarChart className="h-5 w-5 text-[#36CFFF] animate-pulse-slow" />
                  Аналитика
                </button>
              </a>
            </div>
          </div>
        </div>
        {/* Тёмное модное предупреждение */}
        <Card className="bg-gradient-to-br from-[#201C2C]/90 via-[#23243B]/95 to-[#8B5CF6]/25 border-0 shadow-xl mb-8 transition-all">
          <CardContent className="p-4 flex gap-3 items-center">
            <AlertTriangle className="h-6 w-6 text-amber-400 animate-pulse" />
            <p className="text-sm text-[#ffd76b]">
              Для полноценного сканирования сайтов подключите базу данных <span className="text-[#36CFFF] font-semibold">Supabase</span>.
            </p>
          </CardContent>
        </Card>
        {/* Вкладки: стильные, без светлоты, с яркими иконками */}
        <Tabs defaultValue="scanner" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-3 bg-gradient-to-r from-[#181929]/90 to-[#22223B]/80 rounded-xl p-1 border border-[#8B5CF6]/20 shadow-inner">
            <TabsTrigger value="scanner" className="flex gap-2 text-white data-[state=active]:bg-[#36CFFF]/90 data-[state=active]:text-white font-semibold rounded-lg transition-all">
              <Activity className="h-5 w-5 text-[#36CFFF] animate-spin-slow" />
              Сканер сайтов
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex gap-2 text-white data-[state=active]:bg-[#F97316]/90 data-[state=active]:text-white font-semibold rounded-lg transition-all">
              <Rocket className="h-5 w-5 text-[#F97316] animate-bounce" />
              Возможности
            </TabsTrigger>
          </TabsList>
          <TabsContent value="scanner" className="mt-6">
            <WebsiteScanner />
          </TabsContent>
          <TabsContent value="demo" className="mt-6">
            <Card className="bg-gradient-to-br from-[#181929]/95 via-[#1a1833]/90 to-[#8B5CF6]/20 border-0 shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Rocket className="h-5 w-5 text-[#F97316] animate-bounce" />
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
                      <BarChart2 className="h-5 w-5 text-[#8B5CF6] drop-shadow-[0_0_8px_#8B5CF6aa]" />
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
                    <h3 className="text-lg font-bold text-[#22d39a] flex gap-2 items-center">
                      <Activity className="h-5 w-5 text-[#22d39a] drop-shadow-[0_0_8px_#18ce9488]" />
                      Персональные рекомендации
                    </h3>
                    <p className="text-sm text-[#aebbf7]">
                      Советы по <span className="text-[#22d39a] font-bold">SEO</span> и <span className="text-[#8B5CF6] font-bold">производительности</span> для вашего сайта.
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

