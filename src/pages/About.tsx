
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Award } from "lucide-react";

const About: React.FC = () => {
  console.log("About page rendering");
  
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">О нашей компании</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Мы помогаем бизнесу достичь успеха в цифровом мире через профессиональную SEO-оптимизацию
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Наша команда</CardTitle>
                <CardDescription>
                  Опытные специалисты в области SEO
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Более 50 экспертов с многолетним опытом в поисковой оптимизации
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Target className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Наша миссия</CardTitle>
                <CardDescription>
                  Делаем SEO доступным для всех
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Предоставляем качественные инструменты и услуги по доступным ценам
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Award className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Наши достижения</CardTitle>
                <CardDescription>
                  Тысячи довольных клиентов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Более 5000 проектов успешно оптимизированы за последние 5 лет
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
