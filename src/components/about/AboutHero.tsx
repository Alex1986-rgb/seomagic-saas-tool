
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const AboutHero = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative text-center mb-24 py-20 rounded-3xl overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background"
    >
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        О сервисе SEO Market
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
        Профессиональный инструмент для анализа и 
        <span className="text-primary font-semibold"> оптимизации SEO показателей</span> вашего сайта
      </p>
    </motion.div>
  );
};

export default AboutHero;
