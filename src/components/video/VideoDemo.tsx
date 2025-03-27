
import React from 'react';
import { motion } from 'framer-motion';
import { VideoIcon, Star, ArrowRight } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import VideoInfo from './VideoInfo';

const VideoDemo: React.FC = () => {
  return (
    <section className="py-20 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-primary/5 to-background/80 -z-10" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent z-0" />
      <div className="absolute inset-0 bg-[url('/img/grid-pattern.png')] opacity-5 mix-blend-overlay -z-5" />
      
      {/* Декоративные элементы */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-5" />
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-[#0EA5E9]/5 rounded-full blur-3xl -z-5" />
      
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4 border border-primary/20 shadow-sm hover:bg-primary/15 transition-colors">
            <VideoIcon className="w-4 h-4 mr-2" />
            Видео демонстрация
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">
            <span className="inline-block relative">
              Увидеть наши возможности в действии
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/60 rounded-full"
                initial={{ width: 0, left: '50%' }}
                whileInView={{ width: '100%', left: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              ></motion.div>
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
          className="relative max-w-4xl mx-auto"
        >
          {/* Декоративная рамка */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-[#0EA5E9]/30 to-primary/30 rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition duration-1000"></div>
          
          {/* Видео контейнер */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl bg-black">
            <VideoPlayer />
            <VideoInfo />
            
            {/* Декоративные элементы */}
            <div className="absolute top-5 right-5 text-primary/80">
              <Star className="w-6 h-6 animate-pulse" />
            </div>
            <div className="absolute bottom-20 left-5 text-primary/80 rotate-[-30deg]">
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
        
        {/* Индикаторы внизу */}
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(5)].map((_, i) => (
            <motion.div 
              key={i} 
              className="w-2 h-2 rounded-full bg-primary/50"
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoDemo;
