
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WebsiteScanner from '@/components/website-scanner/WebsiteScanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import VideoDemo from '@/components/video/VideoDemo';
import { Monitor, Search, BarChart2, Rocket, AlertCircle } from 'lucide-react';

const WebsiteAnalyzerPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Анализатор сайтов | Админ панель</title>
      </Helmet>
      <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
        {/* Хедер: Темный градиентный фон, яркие иконки */}
        <div className="mb-8 px-8 py-10 rounded-3xl bg-gradient-to-br from-[#191b2a]/98 via-[#23263B]/92 to-[#8B5CF6]/40 shadow-2xl flex flex-col md:flex-row items-center gap-8 border border-primary/25 animate-fade-in">
          <div className="flex-shrink-0 bg-primary/20 text-primary rounded-full p-6 glass-morphism shadow-lg">
            <Monitor className="h-12 w-12 text-[#8B5CF6]" />
          </div>
          <div className="flex-1 min-w-[210px]">
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight bg-gradient-to-r from-[#8B5CF6] via-[#36CFFF] to-[#F97316] bg-clip-text text-transparent">
              Анализатор сайтов
            </h1>
            <p className="text-muted-foreground text-lg">
              Инструменты для сканирования, анализа и оптимизации сайтов
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <a href="/admin/settings">
                <button className="px-5 py-2 rounded-lg bg-gradient-to-br from-[#FFC107]/10 to-[#0EA5E9]/10 text-primary border border-primary/30 font-semibold shadow-md flex items-center gap-2 transition hover:scale-105 hover:bg-primary/20">
                  <BarChart2 className="h-5 w-5 text-[#FFC107]" />
                  Настройки
                </button>
              </a>
              <a href="/admin/analytics">
                <button className="px-5 py-2 rounded-lg bg-gradient-to-br from-[#F97316]/10 to-[#36CFFF]/10 text-blue-200 border border-blue-400/20 font-semibold shadow-md flex items-center gap-2 transition hover:scale-105 hover:bg-blue-900/20">
                  <Search className="h-5 w-5 text-[#36CFFF]" />
                  Аналитика
                </button>
              </a>
            </div>
          </div>
        </div>
        {/* Карточка-предупреждение: Темный фон */}
        <Card className="bg-gradient-to-br from-[#23263B]/85 via-[#302b47]/90 to-[#8B5CF6]/30 border-0 shadow-xl mb-8">
          <CardContent className="p-4 flex gap-3 items-center">
            <AlertCircle className="h-6 w-6 text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-200">
              Для полнофункционального сканирования сайтов рекомендуется подключить базу данных через Supabase для хранения результатов.
            </p>
          </CardContent>
        </Card>
        {/* Tabs: Темный стиль вкладок */}
        <Tabs defaultValue="scanner" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-3 bg-gradient-to-r from-[#151926] to-[#23263b]/80 rounded-xl p-1">
            <TabsTrigger value="scanner" className="flex gap-2 text-white data-[state=active]:bg-[#8B5CF6]/80 data-[state=active]:text-white font-semibold rounded-lg">
              <Search className="h-4 w-4" />
              Сканер сайтов
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex gap-2 text-white data-[state=active]:bg-[#F97316]/80 data-[state=active]:text-white font-semibold rounded-lg">
              <Rocket className="h-4 w-4" />
              Возможности
            </TabsTrigger>
          </TabsList>
          <TabsContent value="scanner" className="mt-6">
            <WebsiteScanner />
          </TabsContent>
          <TabsContent value="demo" className="mt-6">
            <Card className="bg-gradient-to-br from-[#151926]/95 via-[#23263b]/80 to-[#8B5CF6]/10 border-0 shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Rocket className="h-5 w-5 text-[#F97316]" />
                  Возможности сканера
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Основные функции для глубокого анализа сайтов
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <VideoDemo autoplay={true} interval={7000} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[#8B5CF6]">Полный аудит сайта</h3>
                    <p className="text-sm text-muted-foreground">
                      Комплексная проверка технических и SEO аспектов сайта.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[#36CFFF]">Анализ структуры и метаданных</h3>
                    <p className="text-sm text-muted-foreground">
                      Визуализация site map, сканирование страниц, рекомендации по оптимизации.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[#F97316]">Генерация карт сайта</h3>
                    <p className="text-sm text-muted-foreground">
                      Автоматическое создание XML и HTML карт сайта — полезно для поисковых систем.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[#14CC8C]">Персональные рекомендации</h3>
                    <p className="text-sm text-muted-foreground">
                      Реальные советы по SEO и производительности конкретно для вашего сайта.
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

