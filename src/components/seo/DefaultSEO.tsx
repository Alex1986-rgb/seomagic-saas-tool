
import React from 'react';
import { Helmet } from 'react-helmet-async';

const DefaultSEO: React.FC = () => {
  const url = typeof window !== 'undefined' ? window.location.href.split('#')[0] : '';

  const title = 'SEO Аудит и Оптимизация';
  const description = 'SEO аудит и оптимизация сайтов. Повысьте позиции и увеличьте органический трафик.';
  const siteName = 'SEO Market';
  const image = '/og-image.jpg';

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: siteName,
          url,
          inLanguage: 'ru-RU',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${url}?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        })}
      </script>
    </Helmet>
  );
};

export default DefaultSEO;
