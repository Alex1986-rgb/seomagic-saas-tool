import React from 'react';
import Layout from '@/components/Layout';
import PricingHero from '@/components/pricing/PricingHero';
import PricingPlans from '@/components/pricing/PricingPlans';
import FeatureComparison from '@/components/pricing/FeatureComparison';
import PricingFAQ from '@/components/pricing/PricingFAQ';
import PricingCTA from '@/components/pricing/PricingCTA';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { ProductSchema } from '@/components/seo/ProductSchema';
import { FAQPageSchema } from '@/components/seo/FAQPageSchema';
import { BreadcrumbsWrapper } from '@/components/navigation/BreadcrumbsWrapper';
import PageSeo from '@/components/seo/PageSeo';

const Pricing: React.FC = () => {
  return (
    <Layout>
      <PageSeo
        title="Тарифы на SEO-аудит и оптимизацию: цены и что входит"
        description="Сравнение тарифных планов: число проектов, глубина сканирования, частота проверок и доступ к API. Ответы на вопросы о ценах."
      />
      <BreadcrumbSchema items={[
        { name: 'Главная', url: '/' },
        { name: 'Цены', url: '/pricing' }
      ]} />
      <ProductSchema />
      <FAQPageSchema />
      <div className="container mx-auto px-4 pt-32 pb-24">
        <BreadcrumbsWrapper 
          items={[{ name: 'Цены', url: '/pricing' }]} 
          className="mb-8"
        />
        <PricingHero />
        <PricingPlans />
        <FeatureComparison />
        <PricingFAQ />
        <PricingCTA />
      </div>
    </Layout>
  );
};

export default Pricing;
