
import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AboutHero = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative text-center mb-24 py-28 rounded-3xl overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-background"
    >
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
      
      <div className="absolute top-10 left-10 flex items-center justify-center">
        <Star className="text-primary/40 h-6 w-6" />
      </div>
      <div className="absolute top-20 right-20 flex items-center justify-center">
        <Star className="text-primary/40 h-8 w-8" />
      </div>
      <div className="absolute bottom-20 left-1/4 flex items-center justify-center">
        <Star className="text-primary/40 h-5 w-5" />
      </div>
      
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        О сервисе SEO Market
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
        Профессиональный инструмент для анализа и 
        <span className="text-primary font-semibold"> оптимизации SEO показателей</span> вашего сайта
      </p>
      
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
