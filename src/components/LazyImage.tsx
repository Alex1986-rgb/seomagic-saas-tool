
import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  width,
  height
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

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
        placeholderSrc="/images/placeholder.jpg"
        onLoad={handleLoad}
        onError={handleError}
        wrapperClassName="w-full h-full"
        visibleByDefault={false}
        afterLoad={handleLoad}
      />
    </div>
  );
};
