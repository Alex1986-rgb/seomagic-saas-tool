
import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AboutHero = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative text-center mb-24 py-28 rounded-3xl overflow-hidden neo-glass bg-gradient-to-r from-primary/5 via-primary/10 to-background bg-animate"
    >
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-spin-slow"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
      </div>
      
      <div className="absolute top-10 left-10 flex items-center justify-center">
        <Star className="text-primary/40 h-6 w-6 animate-pulse-slow" />
      </div>
      <div className="absolute top-20 right-20 flex items-center justify-center">
        <Star className="text-primary/40 h-8 w-8 animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>
      <div className="absolute bottom-20 left-1/4 flex items-center justify-center">
        <Star className="text-primary/40 h-5 w-5 animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="relative z-10">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-6">
          <Sparkles className="w-4 h-4 mr-2" />
          SEO технологии будущего
        </div>
        
        <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold mb-6 heading-gradient">
          О сервисе SEO Market
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
          Профессиональный инструмент для анализа и 
          <span className="text-primary font-semibold"> оптимизации SEO показателей</span> вашего сайта
        </p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-full px-8 gap-2">
            <Link to="/audit">Попробовать бесплатно</Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8">
            <Link to="/pricing">Узнать больше</Link>
          </Button>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-0 right-0 flex justify-center"
      >
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full animate-bounce"
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth'
            });
          }}
        >
          <ArrowDown className="h-5 w-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default AboutHero;
