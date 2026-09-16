import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BlogPost } from '@/types/blog';
import { absoluteAssetUrl } from '@/lib/asset-url';

interface ArticleSEOProps {
  post: BlogPost;
}

export const ArticleSEO: React.FC<ArticleSEOProps> = ({ post }) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://seomarket.app';
  const articleUrl = `${siteUrl}/blog/${post.id}`;
  
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
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: {
      '@type': 'Person',
      name: post.author,
      url: `${siteUrl}/about#team`
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
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
      '@id': `${siteUrl}/blog#blog`,
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
