
import React from 'react';

interface VideoInfoProps {
  title?: string;
  description?: string;
}

const VideoInfo: React.FC<VideoInfoProps> = ({ title, description }) => {
  if (!title) return null;
  
  return (
    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-20">
      <h3 className="text-white font-medium text-lg">{title}</h3>
      {description && (
        <p className="text-white/80 text-sm mt-1">{description}</p>
      )}
    </div>
  );
};

export default VideoInfo;
