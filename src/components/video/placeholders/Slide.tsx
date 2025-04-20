
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { LazyImage } from '@/components/LazyImage';

interface SlideProps {
  slideData: {
    title: string;
    description: string;
    blogId: number;
    image?: string;
  };
  currentSlide: number;
  slideIndex: number;
}

const Slide: React.FC<SlideProps> = ({ slideData, currentSlide, slideIndex }) => {
  const navigate = useNavigate();
  const isActive = currentSlide === slideIndex;

  const handleClick = () => {
    navigate(`/blog/${slideData.blogId}`);
  };

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:opacity-95 transition-opacity"
      onClick={handleClick}
    >
      {slideData.image && (
        <div className="relative w-full max-w-xl mb-6 rounded-lg overflow-hidden shadow-xl">
          <LazyImage
            src={slideData.image}
            alt={slideData.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      )}
      <h3 className="text-xl md:text-2xl font-semibold mb-3 text-white">
        {slideData.title}
      </h3>
      <p className="text-sm md:text-base text-gray-300 mb-6 max-w-lg text-center">
        {slideData.description}
      </p>
      <Button 
        variant="outline"
        className="group hover:bg-primary/20 pointer-events-none"
      >
        Подробнее
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </motion.div>
  );
};

export default Slide;
