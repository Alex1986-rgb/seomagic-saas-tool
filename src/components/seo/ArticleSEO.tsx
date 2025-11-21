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
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: {
      '@type': 'Person',
      name: post.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'SeoMarket',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/apple-touch-icon.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl
    },
    articleSection: post.category,
    keywords: post.tags.join(', ')
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>
    </Helmet>
  );
};
