import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SoftwareApplicationSchemaProps {
  name?: string;
  description?: string;
  operatingSystem?: string;
  applicationCategory?: string;
  price?: string;
  priceCurrency?: string;
}

export const SoftwareApplicationSchema: React.FC<SoftwareApplicationSchemaProps> = ({
  name = 'SeoMarket - SEO аудит и мониторинг',
  description = 'Мобильное приложение для профессионального SEO анализа и мониторинга позиций сайта. Проводите аудит, отслеживайте позиции в поисковых системах и получайте детальные отчёты прямо с вашего смартфона.',
  operatingSystem = 'iOS 14.0 или новее, Android 8.0 или новее',
  applicationCategory = 'BusinessApplication',
  price = '0',
  priceCurrency = 'RUB'
}) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://seomarket.app';
  
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: name,
    description: description,
    operatingSystem: operatingSystem,
    applicationCategory: applicationCategory,
    image: `${siteUrl}/images/app-icon.png`,
    screenshot: [
      `${siteUrl}/images/app-screenshot-1.jpg`,
      `${siteUrl}/images/app-screenshot-2.jpg`,
      `${siteUrl}/images/app-screenshot-3.jpg`,
      `${siteUrl}/images/app-screenshot-4.jpg`
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1247',
      bestRating: '5',
      worstRating: '1'
    },
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: priceCurrency,
      availability: 'https://schema.org/InStock'
    },
    author: {
      '@type': 'Organization',
      name: 'SeoMarket',
      url: siteUrl
    },
    softwareVersion: '2.1.0',
    fileSize: '45MB',
    releaseNotes: 'Обновлена система аналитики, добавлены новые метрики для отслеживания позиций, улучшена производительность и исправлены ошибки.',
    downloadUrl: [
      'https://apps.apple.com/app/seomarket/id123456789',
      'https://play.google.com/store/apps/details?id=com.seomarket.app'
    ],
    installUrl: [
      'https://apps.apple.com/app/seomarket/id123456789',
      'https://play.google.com/store/apps/details?id=com.seomarket.app'
    ],
    featureList: [
      'Комплексный SEO аудит сайта',
      'Мониторинг позиций в реальном времени',
      'Отслеживание до 1000 ключевых слов',
      'Детальные отчёты с графиками',
      'Push-уведомления об изменениях',
      'Анализ конкурентов',
      'Экспорт данных в PDF и Excel',
      'Синхронизация с веб-версией'
    ],
    requirements: 'Требуется подключение к интернету. Некоторые функции доступны по подписке.',
    permissions: 'Доступ к интернету для синхронизации данных и отправки уведомлений'
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(softwareAppSchema)}
      </script>
    </Helmet>
  );
};
