import React from 'react';
import Layout from '../components/Layout';

const Features: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Возможности</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">SEO Аудит</h3>
            <p className="text-muted-foreground">
              Полный анализ технических и содержательных аспектов сайта
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Отслеживание позиций</h3>
            <p className="text-muted-foreground">
              Мониторинг позиций ключевых слов в поисковых системах
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Анализ конкурентов</h3>
            <p className="text-muted-foreground">
              Сравнение с конкурентами и поиск возможностей
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Features;