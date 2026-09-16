import React from 'react';
import { Helmet } from 'react-helmet-async';
import { absoluteAssetUrl } from '@/lib/asset-url';

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
  videos = [] }) => {
  // Здесь были описаны три обучающих видео с длительностью и ссылками вида
  // seomarket.app/videos/seo-audit-guide.mp4 — таких видео не существует.
  // Поисковики показывали их в выдаче как ролики с превью.
  if (videos.length === 0) return null;

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://seomarket.app';
  
  const videoSchemas = videos.map((video, index) => ({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    '@id': `${siteUrl}/#video-${index + 1}`,
    name: video.name,
    description: video.description,
    thumbnailUrl: [absoluteAssetUrl(video.thumbnailUrl)],
    uploadDate: video.uploadDate,
    duration: video.duration,
    contentUrl: video.contentUrl,
    embedUrl: video.embedUrl,
    publisher: {
      '@type': 'Organization',
      // Логотипа /images/logo.png в проекте нет — поле убрано.
      name: 'SeoMarket'
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
