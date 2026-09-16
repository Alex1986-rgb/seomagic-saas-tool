import React from 'react';
import { PageSeo } from '@/components/seo/PageSeo';
import { SiteContainer, SiteLayout } from '@/site/SiteLayout';
import { usePriceRules } from '@/cabinet/estimate/rates';
import { Hero } from '@/site/landing/Hero';
import { HowItWorks } from '@/site/landing/HowItWorks';
import { Prices } from '@/site/landing/Prices';
import { Method } from '@/site/landing/Method';
import { Checks } from '@/site/landing/Checks';
import { Organic } from '@/site/landing/Organic';
import { Faq } from '@/site/landing/Faq';
import { BlogTeasers } from '@/site/landing/BlogTeasers';
import { Services } from '@/site/landing/Services';
import { FinalCta } from '@/site/landing/FinalCta';

/**
 * Главная публичного сайта по макету «SeoMarket Сайт.dc.html» (строки 60–556).
 * Шапка и подвал — в SiteLayout. Блок «Готовим редизайн» (#redizayn) не перенесён: это анонс
 * для старого сайта, а новый сайт и есть тот редизайн.
 *
 * Прайс загружается один раз здесь: его читают герой (сумма у трёх проблем), цены, состав
 * проверок и услуги — четыре запроса одной таблицы дали бы четыре состояния загрузки.
 *
 * title и description — строковые литералы: scripts/prerender.cjs читает их прямо из этого файла.
 */
const Landing: React.FC = () => {
  const { rules, loading, error } = usePriceRules();
  return (
    <SiteLayout>
      <PageSeo
        title="SEO-аудит сайта бесплатно, оплата за исправления"
        description="Бесплатный технический аудит сайта: балл, главные проблемы и смета по фактическому объёму правок. Без подписки и пакетов — ставка за единицу работы."
      />
      <SiteContainer>
        <Hero rules={rules} />
        <HowItWorks />
        <Prices rules={rules} loading={loading} error={error} />
        <Method />
        <Checks rules={rules} loading={loading} />
        <Organic />
        <Faq />
        <BlogTeasers />
        <Services rules={rules} loading={loading} />
        <FinalCta />
      </SiteContainer>
    </SiteLayout>
  );
};

export default Landing;
