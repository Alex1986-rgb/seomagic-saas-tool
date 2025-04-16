
import { useState, useEffect } from 'react';

export interface UseVideoAvailabilityProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const useVideoAvailability = ({ videoRef }: UseVideoAvailabilityProps) => {
  const [isRealVideo, setIsRealVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleLoadedMetadata = () => {
        setIsRealVideo(true);
        setIsLoading(false);
      };
      
      const handleError = () => {
        setIsRealVideo(false);
        setIsLoading(false);
      };
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('error', handleError);
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('error', handleError);
      };
    }
  }, [videoRef]);
  
  return { isRealVideo, isLoading };
};
