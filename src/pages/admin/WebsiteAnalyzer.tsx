
import React from 'react';
import { Helmet } from 'react-helmet-async';
import WebsiteScanner from '@/components/website-scanner/WebsiteScanner';

const WebsiteAnalyzer: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Helmet>
        <title>Анализатор веб-сайтов | Админ-панель</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Анализатор веб-сайтов
        </h1>
        <p className="text-muted-foreground text-lg">
          Комплексный анализ и сканирование веб-сайтов для SEO оптимизации
        </p>
      </div>

      <WebsiteScanner />
    </div>
  );
};

export default WebsiteAnalyzer;
