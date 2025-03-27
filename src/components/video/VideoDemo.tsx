
import React from 'react';
import { motion } from 'framer-motion';
import { VideoIcon, Star, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import VideoPlayer from './VideoPlayer';
import VideoInfo from './VideoInfo';

const VideoDemo: React.FC = () => {
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
          <VideoPlayer />
          <VideoInfo />
        </motion.div>
      </div>
    </section>
  );
};

export default VideoDemo;
