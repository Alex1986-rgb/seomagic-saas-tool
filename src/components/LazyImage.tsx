
import React from 'react';
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
  return (
    <LazyLoadImage
      alt={alt}
      src={src}
      effect="blur"
      className={className}
      width={width}
      height={height}
      threshold={100}
      placeholderSrc="/images/placeholder.jpg"
    />
  );
};
