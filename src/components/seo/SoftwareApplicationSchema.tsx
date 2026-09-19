import React from 'react';
import { Helmet } from 'react-helmet-async';
import { absolutePageUrl } from '@/lib/asset-url';

interface SoftwareApplicationSchemaProps {
  name?: string;
  description?: string;
  applicationCategory?: string;
}

/**
 * Разметка сервиса как веб-приложения.
 *
 * Раньше здесь было описано мобильное приложение для iOS 14 и Android 8
 * версии 2.1.0 весом 45 МБ, бесплатное, с заметками к релизу, push-уведомлениями
 * и отслеживанием до 1000 запросов. Мобильного приложения нет: человек искал
 * его в сторах и не находил. Сервис работает в браузере, поэтому тип —
 * WebApplication, а версия, размер, заметки к релизу, цена и функции, которых
 * нет, убраны.
 */
export const SoftwareApplicationSchema: React.FC<SoftwareApplicationSchemaProps> = ({
  name = 'SeoMarket — SEO-аудит и оптимизация сайтов',
  description = 'Онлайн-сервис: проверка сайта на технические и контентные ошибки, оптимизация текстов страниц с помощью нейросети и отслеживание позиций в поиске.',
  applicationCategory = 'BusinessApplication'
}) => {
  const siteUrl = absolutePageUrl('/');

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: name,
    description: description,
    url: siteUrl,
    applicationCategory: applicationCategory,
    operatingSystem: 'Any',
    browserRequirements: 'Требуется браузер с включённым JavaScript',
    inLanguage: 'ru-RU',
    // Иконки и скриншотов приложения (/images/app-icon.png,
    // /images/app-screenshot-1..4.jpg) в проекте нет — поля убраны.
    // Здесь стояла средняя оценка 4,8 по 1247 отзывам — числа выдуманные, а
    // поисковики показывали по ним звёзды в выдаче. Появятся настоящие
    // отзывы — вернём вместе с ними.
    // Ссылки на приложение в App Store (id123456789) и Google Play были
    // выдуманы: мобильного приложения нет. Поисковик показывал кнопку
    // «Установить», которая вела в никуда.
    author: {
      '@type': 'Organization',
      '@id': absolutePageUrl('/#organization'),
      name: 'SeoMarket',
      url: siteUrl
    },
    featureList: [
      'SEO-аудит сайта',
      'Оптимизация текстов страниц с помощью нейросети',
      'Отслеживание позиций в Яндексе и Google'
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(softwareAppSchema)}
      </script>
    </Helmet>
  );
};
