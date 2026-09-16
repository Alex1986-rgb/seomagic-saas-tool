import React from 'react';
import Layout from '@/components/Layout';
import PricingHero from '@/components/pricing/PricingHero';
import PricingPlans from '@/components/pricing/PricingPlans';
import FeatureComparison from '@/components/pricing/FeatureComparison';
import PricingFAQ from '@/components/pricing/PricingFAQ';
import PricingCTA from '@/components/pricing/PricingCTA';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import PageSeo from '@/components/seo/PageSeo';

/**
 * Здесь выводились ещё ProductSchema и FAQPageSchema со значениями по
 * умолчанию: тарифы и цены, которых на странице нет, 127 выдуманных отзывов
 * с оценкой 5,0, истёкший срок цены и десять невидимых вопросов с обещанием
 * «14 дней бесплатно». Разметку вопросов даёт PricingFAQ по тем вопросам, что
 * видны на странице.
 *
 * BreadcrumbsWrapper тоже добавлял свою разметку крошек — на странице было два
 * BreadcrumbList, причём во втором не хватало «Главной». Разметка крошек
 * остаётся одна, видимые крошки выводятся без неё.
 */
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
      <div className="container mx-auto px-4 pt-32 pb-24">
        <Breadcrumbs
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
