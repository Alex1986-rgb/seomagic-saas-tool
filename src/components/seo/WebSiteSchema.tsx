import React from 'react';
import { Helmet } from 'react-helmet-async';
import { absolutePageUrl } from '@/lib/asset-url';

/**
 * Здесь был блок potentialAction с поиском по сайту по адресу /search?q=...
 * Такой страницы нет, поисковик мог показать в выдаче строку поиска, ведущую
 * на 404. Появится поиск по сайту — блок можно вернуть с настоящим адресом.
 */
export const WebSiteSchema: React.FC = () => {
  const siteUrl = absolutePageUrl('/');

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absolutePageUrl('/#website'),
    name: 'SeoMarket',
    alternateName: 'СеоМаркет',
    url: siteUrl,
    description: 'Профессиональный SEO аудит и оптимизация сайтов. Мониторинг позиций в поисковых системах.',
    publisher: {
      '@id': absolutePageUrl('/#organization')
    },
    inLanguage: 'ru-RU'
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  );
};
