import React from 'react';
import Layout from '@/components/Layout';
import { SEO } from '@/components/SEO';
import SeoTextGenerator from '@/components/seo-text/SeoTextGenerator';

const SeoText: React.FC = () => (
  <Layout>
    <SEO
      title="Генератор SEO-текста с таблицами | SeoMarket"
      description="Создавайте, переписывайте и дополняйте SEO-тексты для страниц и карточек товаров: блок с таблицами, контроль тошноты, водности и заспамленности."
      canonicalUrl="/seo-text"
      keywords="генератор SEO текста, SEO копирайтинг, тошнота текста, описание товара"
    />
    <div className="container mx-auto px-4 pt-32 pb-24 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Генератор SEO-текста</h1>
      <p className="text-muted-foreground mb-8">
        Развёрнутый SEO-блок с таблицами для низа страницы или описания товара. Создаёт, переписывает или дополняет текст и сразу показывает метрики качества (тошнота, водность, заспамленность).
      </p>
      <SeoTextGenerator />
    </div>
  </Layout>
);

export default SeoText;
