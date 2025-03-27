
import React from 'react';
import { Play, Music } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

interface VideoOverlayProps {
  isPlaying: boolean;
  isLoading: boolean;
  togglePlay: () => void;
  audioEnabled?: boolean;
}

const VideoOverlay: React.FC<VideoOverlayProps> = ({ 
  isPlaying, 
  isLoading, 
  togglePlay, 
  audioEnabled = false 
}) => {
  if (isPlaying || isLoading) return null;
  
  return (
    <motion.div 
      className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 video-overlay" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Button 
        onClick={togglePlay}
        className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg hover:scale-105 transition-all duration-300"
      >
        <Play className="w-8 h-8 ml-1" />
      </Button>
      
      {audioEnabled && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex items-center text-white/80 text-sm">
          <Music className="w-4 h-4 mr-2 animate-pulse" />
          <span>Со звуковым сопровождением</span>
        </div>
      )}
    </motion.div>
  );
};

export default VideoOverlay;
