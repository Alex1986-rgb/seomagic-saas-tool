import React from 'react';
import Layout from '@/components/Layout';
import PositionPricingHero from '@/components/position-pricing/PositionPricingHero';
import PositionPricingPlans from '@/components/position-pricing/PositionPricingPlans';
import PositionPricingFeatures from '@/components/position-pricing/PositionPricingFeatures';
import PositionPricingFAQ from '@/components/position-pricing/PositionPricingFAQ';
import PositionPricingCTA from '@/components/position-pricing/PositionPricingCTA';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import PageSeo from '@/components/seo/PageSeo';

const PositionPricing: React.FC = () => {
  return (
    <Layout>
      <PageSeo
        title="Тарифы на мониторинг позиций сайта в Яндексе и Google"
        description="Стоимость отслеживания позиций: сколько запросов входит в тариф, как часто снимается выдача и что показывает итоговый отчёт."
      />
      <BreadcrumbSchema items={[
        { name: 'Главная', url: '/' },
        { name: 'Мониторинг позиций', url: '/position-pricing' }
      ]} />
      <div className="container mx-auto px-4 pt-32 pb-24">
        <PositionPricingHero />
        <PositionPricingPlans />
        <PositionPricingFeatures />
        <PositionPricingFAQ />
        <PositionPricingCTA />
      </div>
    </Layout>
  );
};

export default PositionPricing;
