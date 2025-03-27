
import React, { memo, useState, useEffect } from 'react';
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Предзагрузка изображения
  useEffect(() => {
    if (loading === "eager") {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setError(true);
    }
  }, [src, loading]);

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
      afterLoad={() => setIsLoaded(true)}
      onError={() => setError(true)}
      // Добавляем данные для SEO
      title={alt}
      // Добавляем data-атрибуты для SEO
      data-src={src}
      data-was-processed={isLoaded ? "true" : "false"}
      style={{ 
        display: 'block', 
        maxWidth: '100%',
        opacity: isLoaded ? 1 : 0.6,
        transition: 'opacity 0.3s ease-in-out'
      }}
    />
  );
});

// Добавляем displayName для отладки
LazyImage.displayName = 'LazyImage';

// Версия с приоритетной загрузкой для изображений в области просмотра
export const PriorityImage: React.FC<Omit<LazyImageProps, 'loading'>> = memo((props) => {
  return <LazyImage {...props} loading="eager" />;
});

// Добавляем displayName для отладки
PriorityImage.displayName = 'PriorityImage';
