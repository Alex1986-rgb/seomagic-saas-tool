
import { useState, useEffect } from 'react';

export interface UseAudioProps {
  audioEnabled: boolean;
  isPlaying: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  audioRef: React.RefObject<HTMLAudioElement>;
}

export const useAudio = ({ 
  audioEnabled, 
  isPlaying,
  videoRef,
  audioRef 
}: UseAudioProps) => {
  const [isMuted, setIsMuted] = useState(false);
  
  // Sync audio with video
  useEffect(() => {
    if (!audioEnabled || !audioRef.current || !videoRef.current) return;
    
    const syncAudio = () => {
      if (!audioRef.current || !videoRef.current) return;
      
      // Sync playback state
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      
      // Sync muted state
      audioRef.current.muted = videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    };
    
    syncAudio();
    
    const handleVolumeChange = () => {
      if (videoRef.current) {
        setIsMuted(videoRef.current.muted);
      }
    };
    
    videoRef.current.addEventListener('volumechange', handleVolumeChange);
    
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('volumechange', handleVolumeChange);
      }
    };
  }, [isPlaying, audioEnabled, audioRef, videoRef]);
  
  return { isMuted };
};
