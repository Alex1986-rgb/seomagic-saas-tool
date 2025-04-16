
import { useState, useEffect } from 'react';

export interface UseVideoProgressProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const useVideoProgress = ({ videoRef }: UseVideoProgressProps) => {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  useEffect(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  }, [videoRef]);
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      setProgress((current / total) * 100 || 0);
    }
  };
  
  const handleSeek = (value: number) => {
    if (videoRef.current) {
      const newTime = (value / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(value);
    }
  };

  return {
    progress,
    currentTime,
    duration,
    handleTimeUpdate,
    handleSeek,
  };
};
