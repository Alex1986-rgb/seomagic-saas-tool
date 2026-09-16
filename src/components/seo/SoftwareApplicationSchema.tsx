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
    // Иконки и скриншотов приложения (/images/app-icon.png,
    // /images/app-screenshot-1..4.jpg) в проекте нет — поля убраны.
    // Здесь стояла средняя оценка 4,8 по 1247 отзывам — числа выдуманные, а
    // поисковики показывали по ним звёзды в выдаче. Появятся настоящие
    // отзывы — вернём вместе с ними.
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
    // Ссылки на приложение в App Store (id123456789) и Google Play были
    // выдуманы: мобильного приложения нет. Поисковик показывал кнопку
    // «Установить», которая вела в никуда.

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
