
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WebsiteScanner from '@/components/website-scanner/WebsiteScanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import VideoDemo from '@/components/video/VideoDemo';
import { Monitor, BarChart, ChartBar } from 'lucide-react';

// Цвета для акцентов
const COLORS = {
  primary: "#9b87f5",
  vivid: "#8B5CF6",
  orange: "#F97316",
  blue: "#1EAEDB",
};

const WebsiteAnalyzerPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Анализатор сайтов | Админ панель</title>
      </Helmet>
      <div
        className="min-h-screen w-full px-2 md:px-0 py-8 flex justify-center items-start bg-gradient-to-tl from-white via-[#e5ecfa]/60 to-[#f4f5fb]/90 dark:from-[#1B1535] dark:via-[#181929] dark:to-[#181929]"
        style={{
          background:
            "linear-gradient(110deg, #f8faff 0%, #e0e7ff 100%)",
        }}
      >
        <div className="w-full max-w-4xl">
          {/* Header */}
          <header
            className="mb-8 px-4 py-7 rounded-3xl bg-gradient-to-br from-white via-[#e5e2ff] to-[#ece6fa] dark:from-[#232045] dark:to-[#171527] shadow-2xl flex flex-col md:flex-row items-center gap-7 border border-[#edeaff] dark:border-[#27264b]"
            style={{
              boxShadow: "0 8px 36px 0 rgba(155, 135, 245,0.08)"
            }}
          >
            <div className="flex-shrink-0 rounded-xl bg-gradient-to-tr from-[#8B5CF6]/80 to-[#36CFFF]/80 p-6 shadow-lg ring-4 ring-[#8B5CF6]/10 flex items-center justify-center">
              <Monitor className="h-12 w-12 text-[#8B5CF6] dark:text-[#36CFFF] animate-pulse-slow" />
            </div>
            <div className="flex-1 min-w-[180px]">
              <h1
                className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight text-transparent bg-gradient-to-r from-[#8B5CF6] via-[#36CFFF] to-[#F97316] bg-clip-text"
              >
                Анализатор сайтов
              </h1>
              <p className="text-[#6C79C4] dark:text-[#A0A8FF] text-base md:text-lg font-medium">
                <span className="text-[#1EAEDB] font-bold">Удобные инструменты </span>
                для сканирования, анализа и быстрой оптимизации сайтов.
              </p>
              <div className="flex flex-wrap gap-3 mt-5">
                <a href="/admin/settings">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#e8e6fb] dark:bg-[#22213B] text-[#8B5CF6] font-bold border border-[#8B5CF6]/30 hover:bg-[#8B5CF6] hover:text-white transition-all duration-200 shadow-md hover:shadow-lg shadow-[#8B5CF6]/10">
                    <ChartBar className="h-5 w-5" />
                    Настройки
                  </button>
                </a>
                <a href="/admin/analytics">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#faefe5] dark:bg-[#22213B] text-[#F97316] font-bold border border-[#F97316]/30 hover:bg-[#F97316] hover:text-white transition-all duration-200 shadow-md hover:shadow-lg shadow-[#F97316]/10">
                    <BarChart className="h-5 w-5" />
                    Аналитика
                  </button>
                </a>
              </div>
            </div>
          </header>

          {/* Supabase Alert */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-[#FFF8E1] via-[#FFFBE5] to-[#FFF8E1] dark:from-[#33291A] dark:via-[#44381D] dark:to-[#33291A] border-l-4 border-[#FFC107] rounded-xl p-4 shadow-lg mb-10">
            <Monitor className="h-6 w-6 text-[#FFC107]" />
            <span className="text-[#975F06] dark:text-[#ffd76b] text-sm">
              Для полноценного сканирования подключите базу данных <span className="text-[#36CFFF] font-semibold">Supabase</span>.
            </span>
          </div>

          {/* Tabs Block */}
          <div className="bg-white/80 dark:bg-[#181929]/80 rounded-2xl shadow-2xl border border-[#ebe9fa] dark:border-[#22213b] px-1 py-5">
            <Tabs defaultValue="scanner" className="w-full">
              <TabsList className="flex w-full gap-2 bg-gradient-to-r from-[#ede9fe] via-[#e0e7ff] to-[#e0e7ff] dark:from-[#23223b] dark:to-[#171527] rounded-xl p-2 border border-[#E9EAF9] dark:border-[#22213B] mt-1 mb-4 shadow-md transition-all">
                <TabsTrigger value="scanner" className="flex gap-2 text-[#36CFFF] data-[state=active]:bg-[#36CFFF] data-[state=active]:text-white font-bold rounded-lg transition-all px-5 py-2">
                  <Monitor className="h-5 w-5" />
                  Сканер
                </TabsTrigger>
                <TabsTrigger value="demo" className="flex gap-2 text-[#F97316] data-[state=active]:bg-[#F97316] data-[state=active]:text-white font-bold rounded-lg transition-all px-5 py-2">
                  <BarChart className="h-5 w-5" />
                  Возможности
                </TabsTrigger>
              </TabsList>

              <TabsContent value="scanner" className="mt-1 px-1 md:px-5">
                <WebsiteScanner />
              </TabsContent>
              <TabsContent value="demo" className="mt-1 px-1 md:px-5">
                <Card className="bg-gradient-to-br from-[#e5ecfc] via-[#fff] to-[#faf8fe] dark:from-[#191827] dark:to-[#191827] shadow-lg border border-[#e9eaf9] dark:border-[#23223b]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#2b377b] dark:text-white">
                      <BarChart className="h-5 w-5 text-[#F97316]" />
                      Возможности сканера
                    </CardTitle>
                    <CardDescription className="text-[#36CFFF] font-semibold">
                      Мощные технологии для глубокого анализа сайтов
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <VideoDemo autoplay={true} interval={7000} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-6">
                      <div className="space-y-2">
                        <h3 className="text-base font-bold text-[#8B5CF6] flex gap-2 items-center">
                          <BarChart className="h-5 w-5 text-[#8B5CF6]" />
                          Полный аудит сайта
                        </h3>
                        <p className="text-xs text-[#6C79C4] dark:text-[#aebbf7]">
                          Комплексная проверка <span className="text-[#36CFFF] font-bold">технических</span> и <span className="text-[#F97316] font-bold">SEO</span> аспектов сайта.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-base font-bold text-[#36CFFF] flex gap-2 items-center">
                          <Monitor className="h-5 w-5 text-[#36CFFF]" />
                          Анализ структуры и метаданных
                        </h3>
                        <p className="text-xs text-[#6C79C4] dark:text-[#aebbf7]">
                          Визуализация sitemap, <span className="text-[#8B5CF6] font-bold">сканирование страниц</span>, советы по оптимизации.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-base font-bold text-[#F97316] flex gap-2 items-center">
                          <BarChart className="h-5 w-5 text-[#F97316]" />
                          Генерация карт сайта
                        </h3>
                        <p className="text-xs text-[#6C79C4] dark:text-[#aebbf7]">
                          Автоматическое создание <span className="text-[#36CFFF] font-bold">XML</span> и <span className="text-[#F97316] font-bold">HTML</span> карт сайта для поисковых систем.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-base font-bold text-[#36CFFF] flex gap-2 items-center">
                          <Monitor className="h-5 w-5 text-[#36CFFF]" />
                          Персональные рекомендации
                        </h3>
                        <p className="text-xs text-[#6C79C4] dark:text-[#aebbf7]">
                          Советы по <span className="text-[#0EA5E9] font-bold">SEO</span> и <span className="text-[#8B5CF6] font-bold">производительности</span> для вашего сайта.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default WebsiteAnalyzerPage;
