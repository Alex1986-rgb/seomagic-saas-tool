
import React, { useState, useCallback, memo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const LazyImage: React.FC<LazyImageProps> = memo(({
  src,
  alt,
  className,
  width,
  height
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  const generateSrcSet = useCallback((imageSrc: string) => {
    if (imageSrc.startsWith('data:') || imageSrc.startsWith('blob:')) return undefined;
    
    return `${imageSrc} 300w,
            ${imageSrc} 600w,
            ${imageSrc} 900w,
            ${imageSrc} 1200w`;
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{width: width || '100%', height: height || '100%'}}
        />
      )}
      
      <LazyLoadImage
        alt={alt}
        src={hasError ? '/images/placeholder.jpg' : src}
        effect="blur"
        className={className}
        width={width}
        height={height}
        threshold={200}
        srcSet={generateSrcSet(src)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        placeholderSrc="/images/placeholder.jpg"
        onLoad={handleLoad}
        onError={handleError}
        wrapperClassName="w-full h-full"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
});

LazyImage.displayName = 'LazyImage';
