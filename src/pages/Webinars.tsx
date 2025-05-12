
import React from 'react';
import Layout from '@/components/Layout';

const Webinars: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-32 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Вебинары</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Обучающие вебинары по SEO оптимизации и работе с нашей платформой
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-video bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">Превью вебинара</span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium mb-2">Основы SEO оптимизации</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Узнайте основные принципы SEO оптимизации и как применять их для повышения рейтинга вашего сайта.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">45 минут</span>
                <button className="text-primary hover:underline text-sm">Смотреть запись</button>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-video bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">Превью вебинара</span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium mb-2">Продвинутый аудит сайта</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Подробный разбор инструментов аудита и методик выявления проблем на сайте.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">60 минут</span>
                <button className="text-primary hover:underline text-sm">Смотреть запись</button>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-video bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">Превью вебинара</span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium mb-2">Отслеживание позиций</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Как эффективно отслеживать позиции сайта в поисковых системах и анализировать результаты.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">50 минут</span>
                <button className="text-primary hover:underline text-sm">Смотреть запись</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Webinars;
