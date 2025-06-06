
import React from 'react';
import Layout from '@/components/Layout';
import AdvancedKeywordsOptimizer from '@/components/seo-optimization/components/AdvancedKeywordsOptimizer';
import { SEO } from '@/components/SEO';

const KeywordsPage: React.FC = () => {
  return (
    <Layout>
      <SEO 
        title="ИИ Анализ Ключевых Слов - Продвинутая SEO Оптимизация"
        description="Комплексный анализ ключевых слов с использованием ИИ. Оптимизация ВЧ, СЧ, НЧ запросов. Анализ структуры контента и LSI-ключевых слов для максимального SEO-эффекта."
        keywords="анализ ключевых слов, ВЧ СЧ НЧ запросы, LSI ключевые слова, SEO оптимизация контента, структура текста, мета-данные"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="pt-20">
          <AdvancedKeywordsOptimizer />
        </div>
      </div>
    </Layout>
  );
};

export default KeywordsPage;
