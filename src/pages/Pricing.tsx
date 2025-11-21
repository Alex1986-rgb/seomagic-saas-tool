import React from 'react';
import Layout from '@/components/Layout';
import PricingHero from '@/components/pricing/PricingHero';
import PricingPlans from '@/components/pricing/PricingPlans';
import FeatureComparison from '@/components/pricing/FeatureComparison';
import PricingFAQ from '@/components/pricing/PricingFAQ';
import PricingCTA from '@/components/pricing/PricingCTA';
import { SEO } from '@/components/SEO';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { ProductSchema } from '@/components/seo/ProductSchema';
import { FAQPageSchema } from '@/components/seo/FAQPageSchema';
import { BreadcrumbsWrapper } from '@/components/navigation/BreadcrumbsWrapper';

const Pricing: React.FC = () => {
  return (
    <Layout>
      <SEO
        title="Тарифы и Цены на SEO аудит | SeoMarket"
        description="Гибкие тарифные планы для SEO аудита и анализа сайтов. Часто задаваемые вопросы о ценах и возможностях платформы."
        canonicalUrl="/pricing"
        keywords="цены на SEO аудит, тарифы SEO, стоимость SEO анализа"
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
