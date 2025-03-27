
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
  language?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'SEO Аудит и оптимизация сайтов',
  description = 'Профессиональный SEO аудит и оптимизация сайтов. Повысьте позиции вашего сайта в поисковых системах и увеличьте органический трафик.',
  keywords = 'SEO, аудит сайта, оптимизация сайта, поисковая оптимизация, продвижение сайта, анализ сайта, улучшение SEO, органический трафик',
  canonicalUrl,
  ogImage = '/images/og-image.jpg',
  ogType = 'website',
  noIndex = false,
  structuredData,
  language = 'ru'
}) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : typeof window !== 'undefined' ? window.location.href : '';
  
  // Добавляем основной structured data для организации
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SEO Аудит и оптимизация",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.svg`,
    "description": description,
    "sameAs": [
      "https://facebook.com/seoaudit",
      "https://twitter.com/seoaudit",
      "https://instagram.com/seoaudit"
    ]
  };
  
  // Если передан кастомный structuredData, используем его, иначе - дефолтный
  const finalStructuredData = structuredData || defaultStructuredData;
  
  return (
    <Helmet htmlAttributes={{ lang: language }}>
      {/* Основные мета-теги */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Контроль индексации */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {!noIndex && <meta name="robots" content="index, follow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="SEO Аудит и Оптимизация" />
      <meta property="og:locale" content="ru_RU" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Дополнительные мета-теги для мобильных устройств */}
      <meta name="theme-color" content="#8b5cf6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      
      {/* Мета-теги для авторства и прав */}
      <meta name="author" content="SEO Аудит Сервис" />
      <meta name="copyright" content={`© ${new Date().getFullYear()} SEO Аудит и Оптимизация. Все права защищены.`} />
      
      {/* Структурированные данные JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
      
      {/* Предзагрузка критических ресурсов */}
      <link rel="preload" href="/fonts/roboto.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    </Helmet>
  );
};
