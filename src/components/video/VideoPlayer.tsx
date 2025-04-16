
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import VideoControls from './VideoControls';
import VideoOverlay from './VideoOverlay';
import VideoLoading from './VideoLoading';
import VideoProgressBar from './VideoProgressBar';
import VideoInfo from './VideoInfo';
import { useVideoPlayer } from './hooks/useVideoPlayer';
import { useVideoProgress } from './hooks/useVideoProgress';

interface VideoPlayerProps {
  src: string;
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
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  title,
  description,
  autoPlay = false,
  loop = false,
  muted = false,
  controls = true,
  className = '',
  overlay = true,
  showInfo = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    isPlaying,
    isMuted,
    volume,
    playbackRate,
    togglePlay,
    toggleMute,
    handleVolumeChange,
    handlePlaybackRateChange
  } = useVideoPlayer(videoRef);
  
  const { progress, currentTime, duration, handleTimeUpdate, handleSeek } = useVideoProgress(videoRef);

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
  }, []);

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
        audioEnabled={!muted}
      />}
      
      <VideoLoading isLoading={isLoading} />
      
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
      />
      
      {controls && (
        <>
          <VideoProgressBar progress={progress} />
          <VideoControls 
            isPlaying={isPlaying}
            isMuted={isMuted}
            volume={volume}
            playbackRate={playbackRate}
            currentTime={currentTime}
            duration={duration}
            onTogglePlay={togglePlay}
            onToggleMute={toggleMute}
            onVolumeChange={handleVolumeChange}
            onPlaybackRateChange={handlePlaybackRateChange}
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
