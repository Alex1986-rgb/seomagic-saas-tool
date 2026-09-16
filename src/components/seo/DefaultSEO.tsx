
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { absoluteAssetUrl, absolutePageUrl } from '@/lib/asset-url';

/**
 * Теги по умолчанию для страниц, где нет своего PageSeo.
 *
 * Здесь же на каждой странице выводились WebSite с поиском по «?q=», которого
 * на сайте нет, Organization с названием «SEO Market» и BreadcrumbList из одной
 * «Главной». На главной они дублировали OrganizationSchema и WebSiteSchema
 * (две разные организации и два сайта), на остальных страницах — хлебные
 * крошки самой страницы. Эта разметка живёт в постраничных компонентах,
 * здесь её больше нет.
 */
const DefaultSEO: React.FC = () => {
  // useLocation перерисовывает компонент при переходах, иначе canonical
  // оставался от первой открытой страницы. Адрес — без query и якоря.
  const { pathname } = useLocation();
  const url = absolutePageUrl(pathname);

  const title = 'SEO Аудит и Оптимизация';
  const description = 'SEO аудит и оптимизация сайтов. Повысьте позиции и увеличьте органический трафик.';
  const siteName = 'SeoMarket';
  const image = absoluteAssetUrl('/og-image.jpg');

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
    </Helmet>
  );
};

export default DefaultSEO;
