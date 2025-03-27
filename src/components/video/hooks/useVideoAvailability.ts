
import { useState, useEffect } from 'react';

interface UseVideoAvailabilityProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const useVideoAvailability = ({ videoRef }: UseVideoAvailabilityProps) => {
  const [isRealVideo, setIsRealVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const checkVideoAvailability = () => {
    if (videoRef.current) {
      videoRef.current.addEventListener('error', () => {
        console.error("Видео не загружено или произошла ошибка");
        setIsRealVideo(false);
        setIsLoading(false);
      });
      
      videoRef.current.addEventListener('loadeddata', () => {
        // Check if the video has actual content
        if (videoRef.current && videoRef.current.videoWidth > 0) {
          console.log("Реальное видео загружено");
          setIsRealVideo(true);
          setIsLoading(false);
        }
      });
    }
  };
  
  useEffect(() => {
    checkVideoAvailability();
    
    // Set timeout to ensure we don't wait too long for video to load
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return {
    isRealVideo,
    isLoading,
  };
};
