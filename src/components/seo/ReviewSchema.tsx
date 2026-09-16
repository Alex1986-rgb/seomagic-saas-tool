import React from 'react';
import { Helmet } from 'react-helmet-async';
import { absolutePageUrl } from '@/lib/asset-url';

/**
 * Разметка отзывов для поисковых систем.
 *
 * Здесь лежали три придуманных отзыва с именами, компаниями и общей оценкой
 * 5,0 из 5 — их видели Яндекс и Google и показывали звёзды в выдаче. Отзывов
 * этих не существует: за такую разметку сайт получает ручные санкции, а люди
 * приходят по ложному обещанию. Пока настоящих отзывов нет, разметки нет тоже:
 * компонент ничего не выводит, а когда отзывы появятся — их передают сюда.
 */

export interface SiteReview {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
  position?: string;
  company?: string;
}

interface ReviewSchemaProps {
  reviews?: SiteReview[];
}

export const ReviewSchema: React.FC<ReviewSchemaProps> = ({ reviews = [] }) => {
  if (reviews.length === 0) return null;

  const ratingSum = reviews.reduce((sum, review) => sum + review.rating, 0);
  const aggregateRating = {
    ratingValue: Number((ratingSum / reviews.length).toFixed(1)),
    reviewCount: reviews.length,
    bestRating: 5,
    worstRating: 1,
  };

  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': absolutePageUrl('/#organization'),
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
