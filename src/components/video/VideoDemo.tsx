
import React, { useState, useRef } from 'react';
import { PlayCircle, PauseCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './VideoDemo.module.css';

interface VideoDemoProps {
  videoSrc?: string;
  posterSrc?: string;
  autoPlay?: boolean;
  className?: string;
}

const VideoDemo: React.FC<VideoDemoProps> = ({
  videoSrc = '/video/seo-demo.mp4',
  posterSrc = '/img/video-poster.jpg',
  autoPlay = false,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const slides = [
    "Анализ структуры сайта",
    "Проверка метаданных",
    "SEO оптимизация",
  ];

  return (
    <div className={`${styles.videoContainer} ${className} mx-auto w-full max-w-5xl`}>
      <div className={styles.videoOverlay}>
        <motion.div 
          className="absolute inset-0 flex flex-col justify-center items-center p-4 md:p-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-4">
            {slides[currentSlide]}
          </h2>
          <p className="text-sm md:text-base text-white/80 max-w-xl">
            Наши инструменты помогут вам улучшить видимость вашего сайта в поисковых системах и привлечь больше целевого трафика
          </p>
        </motion.div>
      </div>
      
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={posterSrc}
        muted
        loop
        playsInline
        autoPlay={autoPlay}
      >
        <source src={videoSrc} type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>
      
      <div className={styles.slideIndicators}>
        {slides.map((_, index) => (
          <div
            key={index}
            className={`${styles.slideIndicator} ${
              index === currentSlide ? styles.slideIndicatorActive : ''
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
      
      <button
        onClick={handlePlayPause}
        className={styles.playPauseButton}
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
      >
        {isPlaying ? (
          <PauseCircle className="h-6 w-6" />
        ) : (
          <PlayCircle className="h-6 w-6" />
        )}
      </button>
    </div>
  );
};

export default VideoDemo;
