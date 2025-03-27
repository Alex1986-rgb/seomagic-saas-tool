
import { useState } from 'react';
import { toast } from 'sonner';

interface UseVideoControlsProps {
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
  setIsPlaying,
}: UseVideoControlsProps) => {
  const [isMuted, setIsMuted] = useState(!audioEnabled);
  
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
  
  const handleDownload = () => {
    toast.info("Для скачивания требуется реальное видео", {
      icon: "📥"
    });
  };

  return {
    isMuted,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    handleDownload,
  };
};
