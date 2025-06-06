
import React from 'react';
import Layout from '@/components/Layout';
import SeoElementsOptimizer from '@/components/seo-optimization/SeoElementsOptimizer';
import { SEO } from '@/components/SEO';

const SeoElementsPage: React.FC = () => {
  return (
    <Layout>
      <SEO 
        title="ИИ Оптимизация SEO Элементов - Заголовки, Описания, Ключевые слова"
        description="Автоматическая оптимизация заголовков, мета-описаний и ключевых слов с помощью искусственного интеллекта. Повысьте CTR и рейтинг в поисковых системах."
        keywords="seo оптимизация, заголовки, мета описания, ключевые слова, искусственный интеллект, оптимизация контента"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="pt-20">
          <SeoElementsOptimizer />
        </div>
      </div>
    </Layout>
  );
};

export default SeoElementsPage;
