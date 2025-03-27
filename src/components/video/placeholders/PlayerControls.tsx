
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { SlideData } from './types';

interface PlayerControlsProps {
  isPaused: boolean;
  togglePause: () => void;
  currentSlide: number;
  slides: SlideData[];
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ 
  isPaused, 
  togglePause,
  currentSlide,
  slides
}) => {
  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between z-20">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={togglePause}
        >
          {isPaused ? (
            <Play className="h-5 w-5" />
          ) : (
            <Pause className="h-5 w-5" />
          )}
        </Button>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <Volume2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <motion.div 
        className="absolute bottom-14 left-0 w-full h-2 bg-gray-800/60 overflow-hidden rounded-full px-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div 
          className="h-full rounded-full"
          style={{ 
            background: `linear-gradient(90deg, ${slides[currentSlide].color} 0%, ${slides[(currentSlide + 1) % slides.length].color} 100%)` 
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </>
  );
};

export default PlayerControls;
