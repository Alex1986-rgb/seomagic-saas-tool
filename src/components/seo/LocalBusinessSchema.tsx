import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_CONTACTS, hasPostalAddress, withoutEmpty } from '@/config/site-contacts';
import { absoluteAssetUrl, absolutePageUrl } from '@/lib/asset-url';

/**
 * Разметка организации с адресом.
 *
 * Здесь был описан офис, которого нет: «ул. Примерная, д. 123, БЦ
 * "Технополис", офис 456», координаты центра Москвы, приёмные часы и телефон
 * 8 800 123-45-67. Поисковые системы принимали это за настоящую точку на карте.
 *
 * Без настоящего адреса разметка не выводится вовсе: сервис работает онлайн, и
 * притворяться конторой с приёмными часами ему незачем. Появится офис — данные
 * вписываются в `src/config/site-contacts.ts`.
 */
export const LocalBusinessSchema: React.FC = () => {
  const siteUrl = absolutePageUrl('/');

  if (!hasPostalAddress()) return null;

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': absolutePageUrl('/#localbusiness'),
    name: 'SeoMarket',
    description: 'SEO-аудит и оптимизация сайтов, отслеживание позиций в поиске.',
    url: siteUrl,
    // Логотипа /images/logo.png в проекте нет — поле убрано. Картинка лежит
    // в корне public, а не в /images.
    image: absoluteAssetUrl('/og-image.jpg'),
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONTACTS.streetAddress,
      addressLocality: SITE_CONTACTS.addressLocality,
      addressCountry: SITE_CONTACTS.addressCountry,
    },
    ...withoutEmpty({
      telephone: SITE_CONTACTS.telephone,
      email: SITE_CONTACTS.email,
      sameAs: SITE_CONTACTS.social,
    }),
    ...(SITE_CONTACTS.geo
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: SITE_CONTACTS.geo.latitude,
            longitude: SITE_CONTACTS.geo.longitude,
          },
        }
      : {}),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  );
};

export default LocalBusinessSchema;
