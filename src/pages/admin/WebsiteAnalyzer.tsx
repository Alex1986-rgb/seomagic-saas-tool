
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WebsiteScanner from '@/components/website-scanner/WebsiteScanner';
import { DeepCrawlProgressDialog } from '@/components/audit/deep-crawl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import VideoDemo from '@/components/video/VideoDemo';
import { AlertCircle, Rocket } from 'lucide-react';

const WebsiteAnalyzerPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Анализатор сайтов | Админ панель</title>
      </Helmet>
      
      <div className="container mx-auto py-8 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Анализатор сайтов</h1>
          <p className="text-muted-foreground">
            Инструменты для сканирования, анализа и оптимизации сайтов
          </p>
        </div>
        
        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40">
          <CardContent className="p-4 flex gap-3 items-center">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-400">
              Для полнофункционального сканирования реальных сайтов рекомендуется подключить базу данных через Supabase для хранения результатов.
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="scanner">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scanner">Сканер сайтов</TabsTrigger>
            <TabsTrigger value="demo">Возможности</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scanner" className="mt-6">
            <WebsiteScanner />
          </TabsContent>
          
          <TabsContent value="demo" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  Возможности сканера
                </CardTitle>
                <CardDescription>
                  Ознакомьтесь с основными функциями и возможностями для анализа сайтов
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <VideoDemo autoplay={true} interval={7000} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Полный аудит сайта</h3>
                    <p className="text-sm text-muted-foreground">
                      Комплексная проверка всех аспектов сайта для повышения его эффективности в поисковых системах.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Технический анализ</h3>
                    <p className="text-sm text-muted-foreground">
                      Выявление технических проблем, влияющих на индексацию и ранжирование сайта.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Карта сайта (Sitemap)</h3>
                    <p className="text-sm text-muted-foreground">
                      Автоматическое создание XML и HTML карт сайта для улучшения индексации поисковыми системами.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Рекомендации</h3>
                    <p className="text-sm text-muted-foreground">
                      Персонализированные рекомендации по улучшению SEO и общей производительности сайта.
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
