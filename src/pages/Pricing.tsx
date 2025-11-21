import React from 'react';
import Layout from '@/components/Layout';
import PricingHero from '@/components/pricing/PricingHero';
import PricingPlans from '@/components/pricing/PricingPlans';
import FeatureComparison from '@/components/pricing/FeatureComparison';
import PricingFAQ from '@/components/pricing/PricingFAQ';
import PricingCTA from '@/components/pricing/PricingCTA';
import { SEO } from '@/components/SEO';

const Pricing: React.FC = () => {
  return (
    <Layout>
      <SEO
        title="Тарифы и Цены на SEO аудит | SeoMarket"
        description="Гибкие тарифные планы для SEO аудита и анализа сайтов. Часто задаваемые вопросы о ценах и возможностях платформы."
        canonicalUrl="/pricing"
        keywords="цены на SEO аудит, тарифы SEO, стоимость SEO анализа"
      />
      <div className="container mx-auto px-4 pt-32 pb-24">
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
