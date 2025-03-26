
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface HeroTitleProps {
  itemVariants: {
    hidden: { opacity: number; y: number };
    visible: { opacity: number; y: number };
  };
}

const HeroTitle: React.FC<HeroTitleProps> = ({ itemVariants }) => {
  return (
    <>
      <motion.div 
        variants={itemVariants}
        className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-600/20 text-indigo-400 font-medium relative"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Sparkles className="w-4 h-4 mr-2 animate-pulse-slow" />
        Бесплатный SEO аудит всех страниц сайта
        <motion.span 
          className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity
          }}
        />
      </motion.div>
      
      <motion.h1 
        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-playfair"
        variants={itemVariants}
      >
        <span className="relative inline-block">
          Оптимизируйте ваш сайт с 
          <span className="bg-gradient-to-r from-primary via-indigo-400 to-primary/80 bg-clip-text text-transparent block md:inline"> профессиональным SEO</span>
          <motion.div 
            className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 to-indigo-400/60 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.8, duration: 0.8 }}
          />
        </span>
      </motion.h1>
      
      <motion.p 
        className="text-lg md:text-xl text-muted-foreground max-w-2xl"
        variants={itemVariants}
      >
        SeoMarket <span className="font-bold">бесплатно</span> анализирует ваш сайт, генерирует мгновенные отчеты и предоставляет подробные рекомендации для улучшения позиций в поисковой выдаче.
      </motion.p>
    </>
  );
};

export default HeroTitle;
