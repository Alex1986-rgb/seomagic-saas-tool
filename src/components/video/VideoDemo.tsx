
import React from 'react';
import VideoPlayer from './VideoPlayer';

interface VideoDemoProps {
  src?: string;
  poster?: string;
  title?: string;
  description?: string;
  showInfo?: boolean;
  className?: string;
}

const VideoDemo: React.FC<VideoDemoProps> = (props) => {
  // Simply pass all props to the VideoPlayer component
  return <VideoPlayer {...props} />;
};

export default VideoDemo;
