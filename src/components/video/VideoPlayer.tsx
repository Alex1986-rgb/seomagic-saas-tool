
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import VideoControls from './VideoControls';
import VideoOverlay from './VideoOverlay';
import VideoLoading from './VideoLoading';
import VideoProgressBar from './VideoProgressBar';
import VideoInfo from './VideoInfo';
import { useVideoPlayer } from './hooks/useVideoPlayer';

interface VideoPlayerProps {
  src?: string;
  poster?: string;
  title?: string;
  description?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
  overlay?: boolean;
  showInfo?: boolean;
  audioEnabled?: boolean;
}

/**
 * VideoPlayer - A comprehensive video player component with custom controls,
 * overlay, loading states, and optional audio track.
 */
const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src = '/video/seo-demo.mp4',
  poster = '/img/video-poster.jpg',
  title,
  description,
  autoPlay = false,
  loop = false,
  muted = false,
  controls = true,
  className = '',
  overlay = true,
  showInfo = true,
  audioEnabled = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Using a custom hook to centralize video player logic
  const {
    isPlaying,
    isMuted,
    progress,
    currentTime,
    duration,
    isRealVideo,
    videoRef,
    audioRef,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    handleTimeUpdate,
    handleSeek,
    handleDownload,
  } = useVideoPlayer({ audioEnabled });

  // Handle video loading events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => setIsLoading(false);
    
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    
    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
    };
  }, [videoRef]);

  return (
    <motion.div 
      className={`relative overflow-hidden rounded-lg ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {overlay && <VideoOverlay 
        isPlaying={isPlaying} 
        isLoading={isLoading} 
        togglePlay={togglePlay}
        audioEnabled={audioEnabled}
      />}
      
      <VideoLoading isLoading={isLoading} />
      
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        autoPlay={autoPlay}
        loop={loop}
        muted={muted || isMuted}
        playsInline
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
      />
      
      {/* Add audio element for separate audio track if needed */}
      {audioEnabled && (
        <audio ref={audioRef} src="/audio/background.mp3" loop />
      )}
      
      {controls && (
        <>
          <VideoProgressBar progress={progress} onSeek={handleSeek} />
          <VideoControls 
            isPlaying={isPlaying}
            isMuted={isMuted}
            togglePlay={togglePlay}
            toggleMute={toggleMute}
            toggleFullscreen={toggleFullscreen}
            handleDownload={handleDownload}
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />
        </>
      )}
      
      {showInfo && title && (
        <VideoInfo 
          title={title} 
          description={description} 
        />
      )}
    </motion.div>
  );
};

export default VideoPlayer;
