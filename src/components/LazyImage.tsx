
import React, { memo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  srcSet?: string;
  sizes?: string;
  loading?: "lazy" | "eager";
}

export const LazyImage: React.FC<LazyImageProps> = memo(({
  src,
  alt,
  className,
  width,
  height,
  srcSet,
  sizes,
  loading = "lazy"
}) => {
  return (
    <LazyLoadImage
      alt={alt}
      src={src}
      effect="blur"
      className={className}
      width={width}
      height={height}
      srcSet={srcSet}
      sizes={sizes}
      threshold={100}
      placeholderSrc="/images/placeholder.jpg"
      loading={loading}
      wrapperClassName="lazy-image-wrapper"
      // Добавляем данные для SEO
      title={alt}
      style={{ display: 'block', maxWidth: '100%' }}
    />
  );
});

// Версия с приоритетной загрузкой для изображений в области просмотра
export const PriorityImage: React.FC<Omit<LazyImageProps, 'loading'>> = memo((props) => {
  return <LazyImage {...props} loading="eager" />;
});
