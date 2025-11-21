import React from 'react';
import { Helmet } from 'react-helmet-async';

export const LocalBusinessSchema: React.FC = () => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://seomarket.app';
  
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#localbusiness`,
    name: 'SeoMarket',
    description: 'Профессиональный SEO аудит и оптимизация сайтов. Мониторинг позиций в поисковых системах.',
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    image: `${siteUrl}/images/og-image.jpg`,
    telephone: '+78001234567',
    email: 'info@seomarket.ru',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Примерная, д. 123, БЦ "Технополис", офис 456',
      addressLocality: 'Москва',
      addressCountry: 'RU'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 55.7558,
      longitude: 37.6173
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      }
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+78001234567',
      contactType: 'customer service',
      email: 'info@seomarket.ru',
      availableLanguage: ['Russian'],
      areaServed: 'RU'
    },
    sameAs: [
      'https://vk.com/seomarket',
      'https://t.me/seomarket',
      'https://twitter.com/seomarket'
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  );
};
