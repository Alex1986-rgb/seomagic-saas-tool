
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface UseVideoPlayerProps {
  audioEnabled?: boolean;
}

export const useVideoPlayer = ({ audioEnabled = false }: UseVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(!audioEnabled);
  const [progress, setProgress] = useState(0);
  const [isRealVideo, setIsRealVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
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
  
  // Check if real video is available
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
  
  const togglePlay = () => {
    if (!isRealVideo) {
      toast.info("Демонстрационный режим активирован", {
        icon: "🎬",
        position: "top-center",
      });
      setIsPlaying(!isPlaying);
      
      // Start or pause the background audio if enabled
      if (audioRef.current) {
        if (!isPlaying && audioEnabled) {
          audioRef.current.play().catch(err => {
            console.error("Failed to play audio:", err);
          });
        } else {
          audioRef.current.pause();
        }
      }
      
      return;
    }
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        if (audioRef.current) audioRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
          toast.error("Не удалось воспроизвести видео", {
            icon: "⚠️"
          });
        });
        
        if (audioRef.current && audioEnabled) {
          audioRef.current.play().catch(err => {
            console.error("Failed to play audio:", err);
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = () => {
    if (!isRealVideo) {
      toast.info("В демо-режиме звук отключен", {
        icon: "🔇"
      });
      return;
    }
    
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };
  
  const toggleFullscreen = () => {
    if (!isRealVideo) {
      toast.info("Полноэкранный режим доступен только для реального видео", {
        icon: "🖥️"
      });
      return;
    }
    
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen().catch(error => {
          console.error("Error entering fullscreen:", error);
          toast.error("Не удалось открыть полноэкранный режим");
        });
      }
    }
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };
  
  const handleDownload = () => {
    toast.info("Для скачивания требуется реальное видео", {
      icon: "📥"
    });
  };
  
  // Include setIsPlaying in the return value
  return {
    isPlaying,
    isMuted,
    progress,
    isRealVideo,
    isLoading,
    videoRef,
    audioRef,
    setIsPlaying,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    handleTimeUpdate,
    handleDownload,
  };
};
