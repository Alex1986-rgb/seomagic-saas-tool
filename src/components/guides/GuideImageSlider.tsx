
import React from 'react';
import { LazyImage } from '@/components/LazyImage';
import { Guide } from '@/types/guides';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface GuideImageSliderProps {
  guide: Guide;
}

const GuideImageSlider: React.FC<GuideImageSliderProps> = ({ guide }) => {
  if (!guide.content || guide.content.length === 0) {
    return (
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <LazyImage 
          src={guide.image} 
          alt={guide.title}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        <CarouselItem>
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <LazyImage 
              src={guide.image} 
              alt={guide.title}
              className="w-full h-full object-cover"
            />
          </div>
        </CarouselItem>
        
        {guide.content.map((section, idx) => (
          <CarouselItem key={idx}>
            <div className="relative h-48 overflow-hidden rounded-t-lg">
              <LazyImage 
                src={section.image} 
                alt={section.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <h3 className="text-white font-medium">{section.title}</h3>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 bg-white/80" />
      <CarouselNext className="right-2 bg-white/80" />
    </Carousel>
  );
};

export default GuideImageSlider;
