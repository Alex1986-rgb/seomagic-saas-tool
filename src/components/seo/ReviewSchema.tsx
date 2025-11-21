import React from 'react';
import { Helmet } from 'react-helmet-async';

export const ReviewSchema: React.FC = () => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://seomarket.app';
  
  const reviews = [
    {
      author: 'Алексей Морозов',
      position: 'Директор по маркетингу',
      company: 'TechnoSphere',
      rating: 5,
      reviewBody: 'Отличный сервис для SEO аудита! Детальный анализ помог выявить и исправить критические ошибки на сайте.',
      datePublished: '2024-01-15'
    },
    {
      author: 'Марина Соколова',
      position: 'SEO-специалист',
      company: 'Digital Agency Pro',
      rating: 5,
      reviewBody: 'Инструменты мониторинга позиций работают безупречно. Очень удобный интерфейс и быстрая генерация отчётов.',
      datePublished: '2024-02-20'
    },
    {
      author: 'Дмитрий Волков',
      position: 'Владелец бизнеса',
      company: 'E-commerce Solutions',
      rating: 5,
      reviewBody: 'Профессиональный подход к SEO оптимизации. Рекомендации помогли значительно улучшить видимость сайта в поиске.',
      datePublished: '2024-03-10'
    }
  ];

  const aggregateRating = {
    ratingValue: 5,
    reviewCount: reviews.length,
    bestRating: 5,
    worstRating: 5
  };

  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'SeoMarket',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
      bestRating: aggregateRating.bestRating,
      worstRating: aggregateRating.worstRating
    },
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author
      },
      datePublished: review.datePublished,
      reviewBody: review.reviewBody,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(reviewSchema)}
      </script>
    </Helmet>
  );
};
