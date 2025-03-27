
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
  structuredData?: Record<string, any>;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'SEO Аудит и оптимизация сайтов',
  description = 'Профессиональный SEO аудит и оптимизация сайтов. Повысьте позиции вашего сайта в поисковых системах и увеличьте органический трафик.',
  keywords = 'SEO, аудит сайта, оптимизация сайта, поисковая оптимизация, продвижение сайта, анализ сайта, улучшение SEO, органический трафик',
  canonicalUrl,
  ogImage = '/images/og-image.jpg',
  ogType = 'website',
  noIndex = false,
  structuredData
}) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : typeof window !== 'undefined' ? window.location.href : '';
  
  return (
    <Helmet>
      {/* Основные мета-теги */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Контроль индексации */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="SEO Аудит и Оптимизация" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Структурированные данные JSON-LD */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
