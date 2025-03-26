
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, 
  Video as VideoIcon, Star, ArrowRight, Download
} from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

const VideoDemo: React.FC = () => {
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
    <section className="py-20 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-primary/5 to-background/80 -z-10" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent z-0" />
      <div className="absolute inset-0 bg-[url('/img/grid-pattern.png')] opacity-5 mix-blend-overlay -z-5" />
      
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4 border border-primary/20">
            <VideoIcon className="w-4 h-4 mr-2" />
            Видео демонстрация
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">
            <span className="inline-block relative">
              Увидеть наши возможности в действии
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/60 rounded-full"></div>
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Посмотрите, как SeoMarket может преобразить ваш сайт и поднять его в поисковой выдаче
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl"
        >
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
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between z-20 video-controls">
              <Button
                onClick={togglePlay}
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              
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
          </div>

          {/* Video Info */}
          <div className="neo-glass p-6 md:p-8 mt-6 rounded-xl border border-primary/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Полный SEO-аудит за 60 секунд</h3>
              </div>
              <Button className="gap-2">
                Получить свой аудит <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-3 text-center bg-background/60 rounded-lg border border-primary/10">
                <div className="font-bold text-lg">100+</div>
                <div className="text-sm text-muted-foreground">SEO-факторов</div>
              </div>
              <div className="p-3 text-center bg-background/60 rounded-lg border border-primary/10">
                <div className="font-bold text-lg">150%</div>
                <div className="text-sm text-muted-foreground">Рост трафика</div>
              </div>
              <div className="p-3 text-center bg-background/60 rounded-lg border border-primary/10">
                <div className="font-bold text-lg">3 мин</div>
                <div className="text-sm text-muted-foreground">Время анализа</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoDemo;
