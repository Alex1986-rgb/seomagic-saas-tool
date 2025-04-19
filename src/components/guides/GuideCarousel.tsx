
import React from 'react';
import { LazyImage } from '@/components/LazyImage';
import { GuideContent } from '@/types/guides';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface GuideCarouselProps {
  image: string;
  title: string;
  description: string;
  content?: GuideContent[];
}

const GuideCarousel: React.FC<GuideCarouselProps> = ({
  image,
  title,
  description,
  content
}) => {
  if (!content || content.length === 0) return null;

  return (
    <div className="mb-12">
      <Carousel className="w-full mb-8">
        <CarouselContent>
          <CarouselItem>
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
              <LazyImage 
                src={image} 
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h2 className="text-2xl font-semibold mb-2">Обзор руководства</h2>
                  <p className="text-white/80">{description}</p>
                </div>
              </div>
            </div>
          </CarouselItem>
          
          {content.map((section, idx) => (
            <CarouselItem key={idx}>
              <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                <LazyImage 
                  src={section.image} 
                  alt={section.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
                    <p className="text-white/80 line-clamp-2">{section.content}</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
};

export default GuideCarousel;
