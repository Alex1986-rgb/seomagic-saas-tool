
import { useState } from 'react';

interface UseVideoProgressProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const useVideoProgress = ({ videoRef }: UseVideoProgressProps) => {
  const [progress, setProgress] = useState(0);
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  return {
    progress,
    handleTimeUpdate,
  };
};
