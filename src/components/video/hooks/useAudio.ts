
import { useState, useEffect } from 'react';

interface UseAudioProps {
  audioEnabled: boolean;
  isPlaying: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  audioRef: React.RefObject<HTMLAudioElement>;
}

export const useAudio = ({ audioEnabled, isPlaying, videoRef, audioRef }: UseAudioProps) => {
  const [isMuted, setIsMuted] = useState(!audioEnabled);
  
  // Effect to handle audio toggle
  useEffect(() => {
    if (audioRef.current) {
      if (audioEnabled && isPlaying) {
        audioRef.current.play().catch(err => {
          console.error("Failed to play audio:", err);
        });
      } else {
        audioRef.current.pause();
      }
    }
    
    if (videoRef.current) {
      videoRef.current.muted = !audioEnabled;
      setIsMuted(!audioEnabled);
    }
  }, [audioEnabled, isPlaying]);

  return {
    isMuted,
  };
};
