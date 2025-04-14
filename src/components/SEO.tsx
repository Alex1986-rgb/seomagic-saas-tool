
import React, { useEffect, useState } from 'react';
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
  const [siteUrl, setSiteUrl] = useState('');
  
  useEffect(() => {
    // Only access window in useEffect to ensure we're in browser environment
    setSiteUrl(window.location.origin);
  }, []);
  
  // Don't render anything during SSR or before client initialization
  if (!siteUrl) return null;
  
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : window.location.href;
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${siteUrl}${ogImage}`} />
    </Helmet>
  );
};
