
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'SEO Аудит и оптимизация сайтов',
  description = 'Профессиональный SEO аудит и оптимизация сайтов. Повысьте позиции вашего сайта в поисковых системах и увеличьте органический трафик.',
  keywords = 'SEO, аудит сайта, оптимизация сайта, поисковая оптимизация, продвижение сайта, анализ сайта, улучшение SEO',
  canonicalUrl,
  ogImage = '/images/og-image.jpg'
}) => {
  // Безопасное получение URL для SSR
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  };

  const baseUrl = getBaseUrl();
  const fullCanonicalUrl = canonicalUrl 
    ? `${baseUrl}${canonicalUrl}` 
    : typeof window !== 'undefined' ? window.location.href : '';
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {fullCanonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      {fullCanonicalUrl && <meta property="og:url" content={fullCanonicalUrl} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {baseUrl && <meta property="og:image" content={`${baseUrl}${ogImage}`} />}
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      {fullCanonicalUrl && <meta property="twitter:url" content={fullCanonicalUrl} />}
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      {baseUrl && <meta property="twitter:image" content={`${baseUrl}${ogImage}`} />}
    </Helmet>
  );
};
