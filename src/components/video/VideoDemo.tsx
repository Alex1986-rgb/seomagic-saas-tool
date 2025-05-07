
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Slide from './placeholders/Slide';
import { getSlideData } from './placeholders/data';
import styles from './VideoDemo.module.css';

interface VideoDemoProps {
  autoPlay?: boolean;
  interval?: number;
}

const VideoDemo: React.FC<VideoDemoProps> = ({ 
  autoPlay = true, 
  interval = 5000 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const slides = getSlideData();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, interval);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, slides.length, interval]);

  const handleSlideClick = (index: number) => {
    setCurrentSlide(index);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-900/40 z-10"></div>
      
      <AnimatePresence mode="wait">
        {slides.map((slide, index) => (
          <Slide
            key={slide.blogId}
            slideData={slide}
            currentSlide={currentSlide}
            slideIndex={index}
          />
        ))}
      </AnimatePresence>
      
      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              currentSlide === index ? 'bg-white w-4' : 'bg-white/50'
            }`}
            onClick={() => handleSlideClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Play/Pause button */}
      <button
        className="absolute bottom-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-20"
        onClick={togglePlayPause}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default VideoDemo;
