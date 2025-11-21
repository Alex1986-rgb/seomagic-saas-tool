import React from 'react';
import { Helmet } from 'react-helmet-async';

export const OrganizationSchema: React.FC = () => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://seomarket.app';
  
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'SeoMarket',
    legalName: 'ООО "СеоМаркет"',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/images/logo.png`,
      width: 250,
      height: 60
    },
    image: `${siteUrl}/images/og-image.jpg`,
    description: 'Профессиональный SEO аудит и оптимизация сайтов. Мониторинг позиций в поисковых системах. Повышение органического трафика и улучшение видимости в поиске.',
    founder: {
      '@type': 'Person',
      name: 'SeoMarket Team'
    },
    foundingDate: '2020',
    email: 'info@seomarket.ru',
    telephone: '+78001234567',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Примерная, д. 123, БЦ "Технополис", офис 456',
      addressLocality: 'Москва',
      postalCode: '119991',
      addressCountry: 'RU'
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+78001234567',
        contactType: 'customer service',
        email: 'info@seomarket.ru',
        availableLanguage: ['Russian'],
        areaServed: 'RU'
      },
      {
        '@type': 'ContactPoint',
        telephone: '+78001234567',
        contactType: 'technical support',
        availableLanguage: ['Russian'],
        areaServed: 'RU'
      },
      {
        '@type': 'ContactPoint',
        telephone: '+78001234567',
        contactType: 'sales',
        email: 'sales@seomarket.ru',
        availableLanguage: ['Russian'],
        areaServed: 'RU'
      }
    ],
    sameAs: [
      'https://vk.com/seomarket',
      'https://t.me/seomarket',
      'https://twitter.com/seomarket',
      'https://www.linkedin.com/company/seomarket',
      'https://www.facebook.com/seomarket',
      'https://www.youtube.com/@seomarket'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1'
    },
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: 25
    },
    knowsAbout: [
      'SEO',
      'Поисковая оптимизация',
      'Аудит сайта',
      'Мониторинг позиций',
      'Органический трафик',
      'Технический SEO',
      'Контент-маркетинг',
      'Анализ конкурентов'
    ],
    slogan: 'Ваш путь к топу поисковой выдачи'
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};
