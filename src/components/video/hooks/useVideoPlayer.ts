
import { useState, useRef } from 'react';
import { useVideoControls } from './useVideoControls';
import { useVideoProgress } from './useVideoProgress';
import { useVideoAvailability } from './useVideoAvailability';
import { useAudio } from './useAudio';

interface UseVideoPlayerProps {
  audioEnabled?: boolean;
}

export const useVideoPlayer = ({ audioEnabled = false }: UseVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Use our smaller, focused hooks
  const { isRealVideo, isLoading } = useVideoAvailability({ videoRef });
  
  const { 
    progress, 
    currentTime, 
    duration, 
    handleTimeUpdate, 
    handleSeek 
  } = useVideoProgress({ videoRef });
  
  const { isMuted } = useAudio({
    audioEnabled,
    isPlaying,
    videoRef,
    audioRef
  });
  
  const { 
    togglePlay, 
    toggleMute, 
    toggleFullscreen, 
    handleDownload 
  } = useVideoControls({
    isRealVideo,
    videoRef,
    audioRef,
    audioEnabled,
    isPlaying,
    setIsPlaying
  });
  
  return {
    isPlaying,
    isMuted,
    progress,
    currentTime,
    duration,
    isRealVideo,
    isLoading,
    videoRef,
    audioRef,
    setIsPlaying,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    handleTimeUpdate,
    handleSeek,
    handleDownload,
  };
};
