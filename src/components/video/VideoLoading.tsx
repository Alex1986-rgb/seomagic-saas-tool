
import React from 'react';
import { Loader2 } from 'lucide-react';

interface VideoLoadingProps {
  isLoading: boolean;
}

const VideoLoading: React.FC<VideoLoadingProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/80">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-white mt-4">Загрузка видео...</p>
      </div>
    </div>
  );
};

export default VideoLoading;
