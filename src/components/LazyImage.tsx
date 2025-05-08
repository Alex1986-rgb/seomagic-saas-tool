
import React, { useState, useCallback, memo, useRef, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Компонент для отложенной загрузки изображений с оптимизацией производительности
 */
export const LazyImage: React.FC<LazyImageProps> = memo(({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  onLoad: externalOnLoad,
  onError: externalOnError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Если изображение уже в кэше, отметить как загруженное
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    if (externalOnLoad) externalOnLoad();
  }, [externalOnLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    if (externalOnError) externalOnError();
  }, [externalOnError]);

  const generateSrcSet = useCallback((imageSrc: string) => {
    // Не генерировать srcSet для data URL или blob URL
    if (imageSrc.startsWith('data:') || imageSrc.startsWith('blob:')) return undefined;
    
    // Для стандартных URL создать набор размеров
    return `${imageSrc} 300w,
            ${imageSrc} 600w,
            ${imageSrc} 900w,
            ${imageSrc} 1200w`;
  }, []);

  // Использовать атрибуты loading и fetchpriority для дальнейшей оптимизации
  const loadingAttr = priority ? 'eager' : 'lazy';
  const fetchPriorityAttr = priority ? 'high' : 'auto';

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{width: width || '100%', height: height || '100%'}}
        />
      )}
      
      <LazyLoadImage
        ref={imgRef}
        alt={alt}
        src={hasError ? '/images/placeholder.jpg' : src}
        effect="blur"
        className={cn(
          className,
          isLoaded ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-300'
        )}
        width={width}
        height={height}
        threshold={200}
        srcSet={generateSrcSet(src)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        placeholderSrc="/images/placeholder.jpg"
        onLoad={handleLoad}
        onError={handleError}
        wrapperClassName="w-full h-full"
        loading={loadingAttr}
        decoding="async"
        fetchpriority={fetchPriorityAttr as any}
      />
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
