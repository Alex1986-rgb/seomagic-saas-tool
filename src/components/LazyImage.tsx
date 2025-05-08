
import React, { useState, useCallback, useMemo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { withMemo } from '@/components/shared/performance';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false
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

  // Preload high-priority images
  useMemo(() => {
    if (priority && typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, src]);

  const actualSrc = useMemo(() => 
    hasError ? '/images/placeholder.jpg' : src, 
  [hasError, src]);
  
  const srcSet = useMemo(() => 
    generateSrcSet(actualSrc), 
  [actualSrc, generateSrcSet]);

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
        src={actualSrc}
        effect="blur"
        className={className}
        width={width}
        height={height}
        threshold={200}
        srcSet={srcSet}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        placeholderSrc="/images/placeholder.jpg"
        onLoad={handleLoad}
        onError={handleError}
        wrapperClassName="w-full h-full"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </div>
  );
};

LazyImage.displayName = 'LazyImage';

// Apply memoization with custom comparison function for images
export default withMemo(LazyImage, (prevProps, nextProps) => {
  return prevProps.src === nextProps.src && 
         prevProps.className === nextProps.className &&
         prevProps.width === nextProps.width &&
         prevProps.height === nextProps.height;
});
