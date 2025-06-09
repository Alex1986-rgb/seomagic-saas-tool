
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Tags, Search, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MetadataAnalysis: React.FC = () => {
  const benefits = [
    "Проверка уникальности и релевантности title тегов",
    "Анализ meta description на соответствие рекомендациям",
    "Контроль длины метатегов для всех страниц",
    "Выявление дублирующихся метаданных",
    "Оптимизация Open Graph и Twitter Cards",
    "Проверка structured data (схема разметки)"
  ];

  return (
    <Layout>
      <Helmet>
        <title>Анализ метаданных | SEO Market</title>
        <meta name="description" content="Глубокий анализ метаданных вашего сайта для максимальной оптимизации поисковой выдачи" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <Tags className="h-4 w-4 mr-2" />
                Анализ метаданных
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Анализ метаданных
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Проверка тегов title, description и других метаданных для максимальной оптимизации поисковой выдачи
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" />
                    Что анализируем
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Результаты анализа
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Детальные отчеты</h4>
                      <p className="text-sm text-muted-foreground">
                        Получите подробные отчеты по каждой странице с рекомендациями по улучшению
                      </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Приоритизация задач</h4>
                      <p className="text-sm text-muted-foreground">
                        Система приоритетов поможет сосредоточиться на самых важных изменениях
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Link to="/audit">
                <Button size="lg" className="group">
                  Начать анализ метаданных
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

export default MetadataAnalysis;
