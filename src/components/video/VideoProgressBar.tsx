
import React from 'react';

interface VideoProgressBarProps {
  progress: number;
  onSeek?: (value: number) => void;
}

const VideoProgressBar: React.FC<VideoProgressBarProps> = ({ progress, onSeek }) => {
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = (x / width) * 100;
    
    onSeek(percentage);
  };
  
  return (
    <div 
      className="absolute bottom-12 left-0 right-0 h-1 bg-gray-700 cursor-pointer z-20"
      onClick={handleProgressClick}
    >
      <div 
        className="h-full bg-primary transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default VideoProgressBar;
