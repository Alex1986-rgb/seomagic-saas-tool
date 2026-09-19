import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_CONTACTS, hasPostalAddress, withoutEmpty } from '@/config/site-contacts';
import { absoluteAssetUrl, absolutePageUrl } from '@/lib/asset-url';

/**
 * Разметка организации для поисковых систем.
 *
 * Прежняя версия сообщала Яндексу и Google то, чего нет: ООО «СеоМаркет»
 * с 2020 года, 25 сотрудников, офис на «ул. Примерной, д. 123», телефон
 * 8 800 123-45-67, шесть страниц в соцсетях и средняя оценка 4,8 по
 * 127 отзывам. Ни одного из этих фактов не существует, а разметка с
 * выдуманными отзывами и адресом — прямой повод для санкций.
 *
 * Теперь выводится только то, что заполнено в `src/config/site-contacts.ts`.
 */
export const OrganizationSchema: React.FC = () => {
  // С подпутём публикации: голый origin указывал на корень github.io.
  const siteUrl = absolutePageUrl('/');

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': absolutePageUrl('/#organization'),
    name: 'SeoMarket',
    url: siteUrl,
    // Логотипа /images/logo.png в проекте нет — поле убрано. Картинка лежит
    // в корне public, а не в /images.
    image: absoluteAssetUrl('/og-image.jpg'),
    description:
      'SEO-аудит и оптимизация сайтов: разбор технических ошибок, рекомендации и смета работ, отслеживание позиций в поиске.',
    ...withoutEmpty({
      email: SITE_CONTACTS.email,
      telephone: SITE_CONTACTS.telephone,
      sameAs: SITE_CONTACTS.social,
    }),
    ...(hasPostalAddress()
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: SITE_CONTACTS.streetAddress,
            addressLocality: SITE_CONTACTS.addressLocality,
            addressCountry: SITE_CONTACTS.addressCountry,
          },
        }
      : {}),
    ...(SITE_CONTACTS.email || SITE_CONTACTS.telephone
      ? {
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            availableLanguage: ['Russian'],
            areaServed: SITE_CONTACTS.addressCountry,
            ...withoutEmpty({
              email: SITE_CONTACTS.email,
              telephone: SITE_CONTACTS.telephone,
            }),
          },
        }
      : {}),
    knowsAbout: [
      'SEO',
      'Поисковая оптимизация',
      'Аудит сайта',
      'Мониторинг позиций',
      'Технический SEO',
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};

export default OrganizationSchema;
