
import React from 'react';
import { motion } from 'framer-motion';

interface HeroTitleProps {
  itemVariants: any;
}

const HeroTitle: React.FC<HeroTitleProps> = ({ itemVariants }) => {
  console.log("HeroTitle rendering");
  
  return (
    <>
      <motion.div
        className="space-y-6"
        variants={itemVariants}
      >
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Новый уровень SEO-анализа
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight font-playfair">
          <span className="block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/80">
              SEO анализ
            </span>
          </span>
          <span className="block mt-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
              нового поколения
            </span>
          </span>
        </h1>
      </motion.div>

      <motion.p 
        className="text-xl md:text-2xl text-muted-foreground max-w-4xl leading-relaxed"
        variants={itemVariants}
      >
        Революционная платформа для глубокого анализа и автоматической оптимизации SEO параметров 
        с использованием{" "}
        <span className="text-primary font-semibold">искусственного интеллекта</span>
      </motion.p>
    </>
  );
};

export default HeroTitle;
