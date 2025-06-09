
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Globe, Search, FileText, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const SiteScanning: React.FC = () => {
  const features = [
    "Глубокое сканирование всех страниц сайта",
    "Обнаружение битых ссылок и ошибок 404",
    "Анализ структуры сайта и внутренней перелинковки",
    "Проверка дублирующегося контента",
    "Выявление технических SEO проблем",
    "Анализ скорости загрузки страниц"
  ];

  return (
    <Layout>
      <Helmet>
        <title>Полное сканирование сайта | SEO Market</title>
        <meta name="description" content="Глубокий анализ всех страниц вашего сайта для обнаружения SEO проблем и возможностей для улучшения" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <Globe className="h-4 w-4 mr-2" />
                Полное сканирование
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Полное сканирование сайта
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Глубокий анализ всех страниц вашего сайта для обнаружения SEO проблем и возможностей для улучшения
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Возможности сканирования
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Что вы получите
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Карта сайта</h4>
                      <p className="text-sm text-muted-foreground">
                        Полная структура вашего сайта с указанием всех найденных страниц
                      </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Отчет по проблемам</h4>
                      <p className="text-sm text-muted-foreground">
                        Детальный список всех найденных проблем с приоритетами исправления
                      </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Рекомендации</h4>
                      <p className="text-sm text-muted-foreground">
                        Конкретные шаги для улучшения SEO-показателей вашего сайта
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Link to="/audit">
                <Button size="lg" className="group">
                  Начать полное сканирование
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SiteScanning;
