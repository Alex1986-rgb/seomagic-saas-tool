
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, TrendingUp, Target } from "lucide-react";

const KeywordsPage: React.FC = () => {
  console.log("KeywordsPage rendering");
  
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Анализ ключевых слов</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Найдите лучшие ключевые слова для вашего сайта и улучшите позиции в поисковых системах
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <Search className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Поиск ключевых слов</CardTitle>
                <CardDescription>
                  Найдите релевантные ключевые слова для вашей ниши
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Используйте наши инструменты для поиска высокочастотных и низкоконкурентных запросов
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Анализ трендов</CardTitle>
                <CardDescription>
                  Отслеживайте популярность ключевых слов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Анализируйте сезонность и тренды для оптимального планирования контента
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Target className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Конкурентный анализ</CardTitle>
                <CardDescription>
                  Изучите стратегии конкурентов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Узнайте, по каким запросам ранжируются ваши конкуренты
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default KeywordsPage;
