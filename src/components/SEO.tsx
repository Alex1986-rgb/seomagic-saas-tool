
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: 'website' | 'article' | 'video.other';
  locale?: string;
  alternateLocales?: string[];
}

export const SEO: React.FC<SEOProps> = ({
  title = 'SEO Аудит и оптимизация сайтов',
  description = 'Профессиональный SEO аудит и оптимизация сайтов. Повысьте позиции вашего сайта в поисковых системах и увеличьте органический трафик.',
  keywords = 'SEO, аудит сайта, оптимизация сайта, поисковая оптимизация, продвижение сайта, анализ сайта, улучшение SEO',
  canonicalUrl,
  ogImage = '/images/og-image.jpg',
  ogImageAlt = 'SeoMarket - SEO Аудит и оптимизация сайтов',
  ogType = 'website',
  locale = 'ru_RU',
  alternateLocales = ['en_US']
}) => {
  // Use document properties directly to avoid window reference in SSR
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const fullCanonicalUrl = canonicalUrl 
    ? `${siteUrl}${canonicalUrl}` 
    : typeof window !== 'undefined' ? window.location.href : '';
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {fullCanonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      {fullCanonicalUrl && <meta property="og:url" content={fullCanonicalUrl} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:site_name" content="SeoMarket" />
      <meta property="og:locale" content={locale} />
      {alternateLocales.map(altLocale => (
        <meta key={altLocale} property="og:locale:alternate" content={altLocale} />
      ))}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@seomarket_app" />
      <meta name="twitter:creator" content="@seomarket_app" />
      {fullCanonicalUrl && <meta name="twitter:url" content={fullCanonicalUrl} />}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      <meta name="twitter:image:alt" content={ogImageAlt} />
    </Helmet>
  );
};
