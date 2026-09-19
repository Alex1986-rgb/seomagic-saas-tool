import React from 'react';
import { Helmet } from 'react-helmet-async';
import { absolutePageUrl } from '@/lib/asset-url';
import { PHOTOS } from '@/site/photos';
import { plainText } from './text';
import type { Article } from './types';

/**
 * Разметка статьи для поисковиков: Article, BreadcrumbList и FAQPage.
 *
 * Автор и издатель — организация SeoMarket: выдуманный «эксперт» с именем или рейтинг статьи
 * в разметке — ровно то, за что поисковики снимают расширенные результаты (об этом статья /blog/schema).
 * Адреса — со слэшем на конце, как canonical у PageSeo и пререндера: иначе разметка и canonical
 * указывали бы на разные адреса.
 */
export const ArticleJsonLd: React.FC<{ article: Article }> = ({ article }) => {
  const url = absolutePageUrl(`/blog/${article.slug}/`);
  const home = absolutePageUrl('/');
  const image = PHOTOS[article.photo]?.src;
  const org = { '@type': 'Organization', name: 'SeoMarket', url: home };

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    inLanguage: 'ru-RU',
    articleSection: article.category,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(image ? { image: [image] } : {}),
    author: org,
    publisher: org,
  };

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: home },
      { '@type': 'ListItem', position: 2, name: 'Блог', item: absolutePageUrl('/blog/') },
      { '@type': 'ListItem', position: 3, name: article.title, item: url },
    ],
  };

  // FAQPage — только из вопросов, которые видны на странице: разметка не должна содержать того,
  // чего посетитель не видит.
  const faq = article.faq.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: plainText(f.a) },
        })),
      }
    : null;

  return (
    <Helmet>
      <meta property="og:type" content="article" />
      <meta property="article:published_time" content={article.date} />
      <script type="application/ld+json">{JSON.stringify(articleLd)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
      {faq && <script type="application/ld+json">{JSON.stringify(faq)}</script>}
    </Helmet>
  );
};
