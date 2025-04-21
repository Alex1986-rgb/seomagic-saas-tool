
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WebsiteScanner from '@/components/website-scanner/WebsiteScanner';
import { DeepCrawlProgressDialog } from '@/components/audit/deep-crawl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import VideoDemo from '@/components/video/VideoDemo';
import { Globe, Search, BarChart2, Rocket, AlertCircle } from 'lucide-react';

const WebsiteAnalyzerPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Анализатор сайтов | Админ панель</title>
      </Helmet>
      
      <div className="container mx-auto py-10 max-w-6xl">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-5 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 text-primary p-4 rounded-2xl shadow hover:scale-110 transition">
              <Globe className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gradient-primary mb-0.5">Анализатор сайтов</h1>
              <p className="text-muted-foreground text-base">
                Инструменты для сканирования, анализа и оптимизации сайтов
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <a href="/admin/settings">
              <button className="px-5 py-2 rounded-lg bg-gradient-to-br from-yellow-100 to-blue-50 text-primary border hover-scale font-semibold shadow-md flex items-center gap-2 transition">
                <BarChart2 className="h-5 w-5" />
                Настройки
              </button>
            </a>
            <a href="/admin/analytics">
              <button className="px-5 py-2 rounded-lg bg-gradient-to-br from-amber-50 to-blue-50 text-blue-800 border hover-scale font-semibold shadow-md flex items-center gap-2 transition">
                <Search className="h-5 w-5" />
                Аналитика
              </button>
            </a>
          </div>
        </div>
        
        <Card className="bg-gradient-to-br from-blue-50 to-amber-50/60 border-0 shadow-xl mb-8">
          <CardContent className="p-4 flex gap-3 items-center">
            <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              Для полнофункционального сканирования сайтов рекомендуется подключить базу данных через Supabase для хранения результатов.
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="scanner">
          <TabsList className="grid w-full grid-cols-2 mb-3">
            <TabsTrigger value="scanner" className="flex gap-2">
              <Search className="h-4 w-4" />
              Сканер сайтов
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex gap-2">
              <Rocket className="h-4 w-4" />
              Возможности
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="scanner" className="mt-6">
            <WebsiteScanner />
          </TabsContent>
          
          <TabsContent value="demo" className="mt-6">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border-0 shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  Возможности сканера
                </CardTitle>
                <CardDescription>
                  Основные функции для глубокого анализа сайтов
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <VideoDemo autoplay={true} interval={7000} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Полный аудит сайта</h3>
                    <p className="text-sm text-muted-foreground">
                      Комплексная проверка технических и SEO аспектов сайта.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Анализ структуры и метаданных</h3>
                    <p className="text-sm text-muted-foreground">
                      Визуализация site map, сканирование страниц, рекомендации по оптимизации.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Генерация kart сайта</h3>
                    <p className="text-sm text-muted-foreground">
                      Автоматическое создание XML и HTML карт сайта — полезно для поисковых систем.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Персональные рекомендации</h3>
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
