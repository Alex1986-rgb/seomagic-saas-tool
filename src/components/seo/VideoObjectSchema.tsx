import React from 'react';
import { Helmet } from 'react-helmet-async';

interface VideoObjectSchemaProps {
  videos?: Array<{
    name: string;
    description: string;
    thumbnailUrl: string;
    uploadDate: string;
    duration: string;
    contentUrl?: string;
    embedUrl?: string;
  }>;
}

export const VideoObjectSchema: React.FC<VideoObjectSchemaProps> = ({
  videos = [
    {
      name: 'Как провести SEO аудит сайта - полное руководство',
      description: 'Подробное видео руководство по проведению комплексного SEO аудита сайта. Узнайте, как выявить технические ошибки, проблемы с контентом и возможности для улучшения позиций в поисковых системах.',
      thumbnailUrl: '/images/video-seo-audit-guide.jpg',
      uploadDate: '2024-01-15T00:00:00Z',
      duration: 'PT15M30S',
      contentUrl: 'https://seomarket.app/videos/seo-audit-guide.mp4',
      embedUrl: 'https://seomarket.app/embed/seo-audit-guide'
    },
    {
      name: 'Мониторинг позиций сайта - настройка и использование',
      description: 'Обучающее видео о настройке мониторинга позиций в поисковых системах. Научитесь отслеживать ключевые слова, анализировать динамику и корректировать стратегию продвижения.',
      thumbnailUrl: '/images/video-position-tracking.jpg',
      uploadDate: '2024-02-10T00:00:00Z',
      duration: 'PT12M45S',
      contentUrl: 'https://seomarket.app/videos/position-tracking.mp4',
      embedUrl: 'https://seomarket.app/embed/position-tracking'
    },
    {
      name: 'Анализ конкурентов в SEO - пошаговая инструкция',
      description: 'Подробное руководство по анализу конкурентов для эффективного SEO продвижения. Изучите стратегии конкурентов, найдите их слабые места и используйте эту информацию для улучшения своих позиций.',
      thumbnailUrl: '/images/video-competitor-analysis.jpg',
      uploadDate: '2024-03-05T00:00:00Z',
      duration: 'PT18M20S',
      contentUrl: 'https://seomarket.app/videos/competitor-analysis.mp4',
      embedUrl: 'https://seomarket.app/embed/competitor-analysis'
    },
    {
      name: 'Оптимизация контента для SEO - лучшие практики',
      description: 'Видео о том, как правильно оптимизировать контент для поисковых систем. Узнайте о правильном использовании заголовков, мета-тегов, ключевых слов и внутренней перелинковке.',
      thumbnailUrl: '/images/video-content-optimization.jpg',
      uploadDate: '2024-03-20T00:00:00Z',
      duration: 'PT14M15S',
      contentUrl: 'https://seomarket.app/videos/content-optimization.mp4',
      embedUrl: 'https://seomarket.app/embed/content-optimization'
    }
  ]
}) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://seomarket.app';
  
  const videoSchemas = videos.map((video, index) => ({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    '@id': `${siteUrl}/#video-${index + 1}`,
    name: video.name,
    description: video.description,
    thumbnailUrl: [
      `${siteUrl}${video.thumbnailUrl}`
    ],
    uploadDate: video.uploadDate,
    duration: video.duration,
    contentUrl: video.contentUrl,
    embedUrl: video.embedUrl,
    publisher: {
      '@type': 'Organization',
      name: 'SeoMarket',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.png`,
        width: 600,
        height: 60
      }
    },
    author: {
      '@type': 'Organization',
      name: 'SeoMarket',
      url: siteUrl
    },
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: { '@type': 'WatchAction' },
      userInteractionCount: Math.floor(Math.random() * 5000) + 1000
    },
    inLanguage: 'ru-RU',
    isFamilyFriendly: true,
    potentialAction: {
      '@type': 'SeekToAction',
      target: `${video.embedUrl}?t={seek_to_second_number}`,
      'startOffset-input': 'required name=seek_to_second_number'
    }
  }));

  return (
    <Helmet>
      {videoSchemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
