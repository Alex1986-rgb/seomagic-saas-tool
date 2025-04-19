
import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import VideoPlayer from '../video/VideoPlayer';

const LoadingFallback = () => (
  <div className="w-full py-16 flex items-center justify-center">
    <div className="spinner-gradient"></div>
  </div>
);

const VideoSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4 border border-primary/20">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse-slow" />
              Посмотрите сервис в действии
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair relative inline-block">
              Как это работает
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/60 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </h2>
            <p className="text-lg text-muted-foreground mx-auto">
              Посмотрите короткое видео о том, как наша платформа проводит аудит и оптимизацию сайтов
            </p>
          </motion.div>
        </div>
        
        <motion.div
          className="max-w-4xl mx-auto neo-card p-1 rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <div className="w-full h-[300px] md:h-[450px]">
              <VideoPlayer 
                src="/video/seo-demo.mp4"
                poster="/img/video-poster.jpg"
                title="SEO Аудит и оптимизация сайта"
                description="Демонстрация процесса анализа и оптимизации"
                controls={true}
                overlay={true}
                showInfo={true}
              />
            </div>
          </Suspense>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;
