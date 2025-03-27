
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import VideoControls from './VideoControls';
import AnimatedVideoPlaceholder from './AnimatedVideoPlaceholder';
import { Play, Loader2, Music } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

interface VideoPlayerProps {
  audioEnabled?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ audioEnabled = false }) => {
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

  // Проверяем, загрузилось ли реальное видео
  const checkVideoAvailability = () => {
    if (videoRef.current) {
      videoRef.current.addEventListener('error', () => {
        console.error("Видео не загружено или произошла ошибка");
        setIsRealVideo(false);
        setIsLoading(false);
      });
      
      videoRef.current.addEventListener('loadeddata', () => {
        // Проверяем, что видео действительно есть (не является заглушкой)
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

  return (
    <div className="aspect-video relative overflow-hidden border border-primary/20 bg-gradient-to-b from-black to-[#1a1a2e] rounded-xl video-container shadow-xl">
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/80">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-white mt-4">Загрузка видео...</p>
          </div>
        </div>
      )}

      {/* Background audio */}
      <audio 
        ref={audioRef}
        src="/audio/demo-background.mp3" 
        loop
        preload="auto"
      />

      {/* Video Overlay when paused */}
      {!isPlaying && !isLoading && (
        <motion.div 
          className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 video-overlay" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button 
            onClick={togglePlay}
            className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg hover:scale-105 transition-all duration-300"
          >
            <Play className="w-8 h-8 ml-1" />
          </Button>
          
          {audioEnabled && (
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex items-center text-white/80 text-sm">
              <Music className="w-4 h-4 mr-2 animate-pulse" />
              <span>Со звуковым сопровождением</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Показываем анимированный плейсхолдер или настоящее видео */}
      {isRealVideo ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src="/video/seo-demo.mp4"
          poster="/img/video-poster.jpg"
          muted={isMuted}
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        >
          <source src="/video/seo-demo.mp4" type="video/mp4" />
          Ваш браузер не поддерживает видео
        </video>
      ) : (
        <div className={isPlaying || isLoading ? "block" : "hidden"}>
          <AnimatedVideoPlaceholder isPlaying={isPlaying} />
        </div>
      )}

      {/* Video Progress Bar */}
      <div className="absolute bottom-14 left-0 w-full h-2 bg-gray-800/60 z-20 overflow-hidden rounded-full mx-auto px-1">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary/80 via-primary to-primary/90 rounded-full"
          style={{ width: `${progress}%` }}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Video Controls */}
      <VideoControls 
        isPlaying={isPlaying} 
        isMuted={isMuted} 
        togglePlay={togglePlay}
        toggleMute={toggleMute}
        toggleFullscreen={toggleFullscreen}
        handleDownload={handleDownload}
      />
    </div>
  );
};

export default VideoPlayer;
