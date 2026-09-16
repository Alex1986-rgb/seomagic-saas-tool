import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BlogPost } from '@/types/blog';
import { absoluteAssetUrl, absolutePageUrl } from '@/lib/asset-url';

interface ArticleSEOProps {
  post: BlogPost;
}

/**
 * Дата публикации в формате ISO или null, если строку разобрать нельзя.
 *
 * Раньше здесь стоял new Date(post.date).toISOString() без проверки. Даты
 * постов были записаны как «15 мая 2025», new Date такую строку не понимает,
 * а toISOString у невалидной даты бросает RangeError — ни одна статья блога
 * не открывалась, вместо неё показывался экран ошибки.
 */
const toIsoDate = (value: string): string | null => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

export const ArticleSEO: React.FC<ArticleSEOProps> = ({ post }) => {
  const articleUrl = absolutePageUrl(`/blog/${post.id}`);
  const publishedAt = toIsoDate(post.date);

  // Картинки статей — ссылки на чужие домены; строка `${siteUrl}${post.image}`
  // склеивала адрес сайта с готовым https-адресом и отдавала поисковикам
  // мусор вида «https://seomarket.apphttps://images.unsplash.com/...».
  const imageUrl = post.image ? absoluteAssetUrl(post.image) : '';

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    ...(imageUrl
      ? {
          image: {
            '@type': 'ImageObject',
            url: imageUrl,
            width: 1200,
            height: 630
          }
        }
      : {}),
    // Неразобранную дату в разметку не выводим, чтобы не ронять страницу.
    ...(publishedAt ? { datePublished: publishedAt, dateModified: publishedAt } : {}),
    author: {
      '@type': 'Person',
      // Ссылка на /about#team убрана: такого блока на странице «О нас» нет.
      name: post.author
    },
    publisher: {
      '@type': 'Organization',
      '@id': absolutePageUrl('/#organization'),
      // Логотипа /images/logo.png в проекте нет — поле убрано, чтобы не
      // отдавать поисковикам ссылку на несуществующий файл.
      name: 'SeoMarket'
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl
    },
    url: articleUrl,
    articleSection: post.category,
    keywords: post.tags.join(', '),
    inLanguage: 'ru-RU',
    wordCount: post.content ? post.content.split(/\s+/).length : 0,
    articleBody: post.excerpt,
    isPartOf: {
      '@type': 'Blog',
      '@id': absolutePageUrl('/blog#blog'),
      name: 'Блог SeoMarket'
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>
    </Helmet>
  );
};
