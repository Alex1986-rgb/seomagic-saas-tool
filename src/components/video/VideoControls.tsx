
import React from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Download } from 'lucide-react';
import { Button } from '../ui/button';

export interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume?: number;
  playbackRate?: number;
  currentTime: number;
  duration: number;
  togglePlay: () => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  handleDownload: () => void;
  onVolumeChange?: (value: number) => void;
  onPlaybackRateChange?: (value: number) => void;
  onSeek: (value: number) => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  isPlaying,
  isMuted,
  currentTime,
  duration,
  togglePlay,
  toggleMute,
  toggleFullscreen,
  handleDownload,
  onSeek
}) => {
  // Format time display (e.g., "1:23")
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };
  
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between z-20 video-controls">
      <div className="flex items-center gap-2">
        <Button
          onClick={togglePlay}
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-white/20"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </Button>
        
        <div className="text-xs text-white/80">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          onClick={toggleMute}
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-white/20"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
        
        <Button
          onClick={handleDownload}
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-white/20"
        >
          <Download className="w-5 h-5" />
        </Button>
        
        <Button
          onClick={toggleFullscreen}
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-white/20"
        >
          <Maximize className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default VideoControls;
