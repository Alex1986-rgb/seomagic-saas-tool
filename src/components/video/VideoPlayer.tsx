
import React from 'react';
import VideoControls from './VideoControls';
import AnimatedVideoPlaceholder from './AnimatedVideoPlaceholder';
import VideoOverlay from './VideoOverlay';
import VideoLoading from './VideoLoading';
import VideoProgressBar from './VideoProgressBar';
import { useVideoPlayer } from './hooks/useVideoPlayer';

interface VideoPlayerProps {
  audioEnabled?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ audioEnabled = false }) => {
  const {
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
  } = useVideoPlayer({ audioEnabled });

  return (
    <div className="aspect-video relative overflow-hidden border border-primary/20 bg-gradient-to-b from-black to-[#1a1a2e] rounded-xl video-container shadow-xl">
      {/* Loading indicator */}
      <VideoLoading isLoading={isLoading} />

      {/* Background audio */}
      <audio 
        ref={audioRef}
        src="/audio/demo-background.mp3" 
        loop
        preload="auto"
      />

      {/* Video Overlay when paused */}
      <VideoOverlay 
        isPlaying={isPlaying} 
        isLoading={isLoading} 
        togglePlay={togglePlay} 
        audioEnabled={audioEnabled} 
      />

      {/* Display animated placeholder or real video */}
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
      <VideoProgressBar progress={progress} />

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
