
import React from 'react';
import Layout from '@/components/Layout';
import KeywordsOptimizer from '@/components/seo-optimization/components/KeywordsOptimizer';
import { SEO } from '@/components/SEO';

const KeywordsPage: React.FC = () => {
  return (
    <Layout>
      <SEO 
        title="ИИ Анализ Ключевых Слов - Поиск и Оптимизация Keywords"
        description="Автоматический анализ и поиск релевантных ключевых слов с помощью искусственного интеллекта. Найдите лучшие keywords для вашего контента."
        keywords="анализ ключевых слов, keywords, поиск ключевых слов, seo keywords, оптимизация ключевых слов"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="pt-20">
          <KeywordsOptimizer />
        </div>
      </div>
    </Layout>
  );
};

export default KeywordsPage;
