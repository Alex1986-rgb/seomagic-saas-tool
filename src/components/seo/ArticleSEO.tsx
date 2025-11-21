import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BlogPost } from '@/types/blog';

interface ArticleSEOProps {
  post: BlogPost;
}

export const ArticleSEO: React.FC<ArticleSEOProps> = ({ post }) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://seomarket.app';
  const articleUrl = `${siteUrl}/blog/${post.id}`;
  
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: {
      '@type': 'ImageObject',
      url: `${siteUrl}${post.image}`,
      width: 1200,
      height: 630
    },
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
      name: 'SeoMarket',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.png`,
        width: 250,
        height: 60
      }
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
