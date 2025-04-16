
import { useCallback } from 'react';

export interface UseVideoControlsProps {
  isRealVideo: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  audioRef: React.RefObject<HTMLAudioElement>;
  audioEnabled: boolean;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useVideoControls = ({
  isRealVideo,
  videoRef,
  audioRef,
  audioEnabled,
  isPlaying,
  setIsPlaying
}: UseVideoControlsProps) => {
  
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      if (audioEnabled && audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      videoRef.current.play();
      if (audioEnabled && audioRef.current) {
        audioRef.current.play();
      }
    }
    
    setIsPlaying(!isPlaying);
  }, [isPlaying, videoRef, audioRef, audioEnabled, setIsPlaying]);
  
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !videoRef.current.muted;
    
    if (audioEnabled && audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
  }, [videoRef, audioRef, audioEnabled]);
  
  const toggleFullscreen = useCallback(() => {
    if (!videoRef.current || !document.fullscreenEnabled) return;
    
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, [videoRef]);
  
  const handleDownload = useCallback(() => {
    if (!isRealVideo || !videoRef.current) return;
    
    const videoSrc = videoRef.current.src;
    const a = document.createElement('a');
    a.href = videoSrc;
    a.download = videoSrc.split('/').pop() || 'video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [isRealVideo, videoRef]);
  
  return {
    togglePlay,
    toggleMute, 
    toggleFullscreen,
    handleDownload
  };
};
