
import React from 'react';
import { motion } from 'framer-motion';

interface VideoProgressBarProps {
  progress: number;
}

const VideoProgressBar: React.FC<VideoProgressBarProps> = ({ progress }) => {
  return (
    <div className="absolute bottom-14 left-0 w-full h-2 bg-gray-800/60 z-20 overflow-hidden rounded-full mx-auto px-1">
      <motion.div 
        className="h-full bg-gradient-to-r from-primary/80 via-primary to-primary/90 rounded-full"
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
};

export default VideoProgressBar;
