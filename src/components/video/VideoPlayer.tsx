
import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import VideoControls from './VideoControls';

const VideoPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
          toast.error("Не удалось воспроизвести видео");
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
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
    const link = document.createElement('a');
    link.href = '/video/seo-demo.mp4';
    link.download = 'seo-demo.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Скачивание видео началось");
  };

  return (
    <div className="aspect-video relative overflow-hidden border border-primary/20 bg-black rounded-xl video-container">
      {/* Video Overlay when paused */}
      {!isPlaying && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 video-overlay opacity-100">
          <Button 
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg"
          >
            <Play className="w-6 h-6" />
          </Button>
        </div>
      )}

      {/* Video Element */}
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

      {/* Video Progress Bar */}
      <div className="absolute bottom-14 left-0 w-full h-1.5 bg-gray-800/60 z-20">
        <div 
          className="h-full bg-gradient-to-r from-primary/80 to-primary"
          style={{ width: `${progress}%` }}
        ></div>
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
