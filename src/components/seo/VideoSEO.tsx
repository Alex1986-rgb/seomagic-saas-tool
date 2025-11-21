import React from 'react';
import { Helmet } from 'react-helmet-async';

interface VideoSEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration?: string; // ISO 8601 format (e.g., "PT1H30M")
  uploadDate?: string;
  width?: number;
  height?: number;
}

export const VideoSEO: React.FC<VideoSEOProps> = ({
  title,
  description,
  canonicalUrl,
  videoUrl,
  thumbnailUrl,
  duration,
  uploadDate,
  width = 1920,
  height = 1080
}) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://seomarket.app';
  const fullCanonicalUrl = `${siteUrl}${canonicalUrl}`;
  const fullVideoUrl = videoUrl.startsWith('http') ? videoUrl : `${siteUrl}${videoUrl}`;
  const fullThumbnailUrl = thumbnailUrl.startsWith('http') ? thumbnailUrl : `${siteUrl}${thumbnailUrl}`;
  
  return (
    <Helmet>
      <title>{title} | SeoMarket</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="video.other" />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullThumbnailUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="SeoMarket" />
      <meta property="og:locale" content="ru_RU" />
      
      {/* Video specific tags */}
      <meta property="og:video" content={fullVideoUrl} />
      <meta property="og:video:secure_url" content={fullVideoUrl} />
      <meta property="og:video:type" content="video/mp4" />
      <meta property="og:video:width" content={width.toString()} />
      <meta property="og:video:height" content={height.toString()} />
      {duration && <meta property="og:video:duration" content={duration} />}
      {uploadDate && <meta property="og:video:release_date" content={uploadDate} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="player" />
      <meta name="twitter:site" content="@seomarket_app" />
      <meta name="twitter:creator" content="@seomarket_app" />
      <meta name="twitter:url" content={fullCanonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullThumbnailUrl} />
      <meta name="twitter:player" content={fullVideoUrl} />
      <meta name="twitter:player:width" content={width.toString()} />
      <meta name="twitter:player:height" content={height.toString()} />
    </Helmet>
  );
};
