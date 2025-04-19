
import React from 'react';
import { motion } from 'framer-motion';

interface HeroTitleProps {
  itemVariants: any;
}

const HeroTitle: React.FC<HeroTitleProps> = ({ itemVariants }) => {
  console.log("HeroTitle rendering");
  
  return (
    <>
      <motion.h1 
        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 font-playfair"
        variants={itemVariants}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
          SEO анализ
        </span>{" "}
        и оптимизация вашего сайта
      </motion.h1>
      <motion.p 
        className="text-lg md:text-xl text-muted-foreground max-w-3xl"
        variants={itemVariants}
      >
        Комплексный аудит и автоматическая оптимизация SEO параметров вашего сайта
        с использованием передовых алгоритмов искусственного интеллекта
      </motion.p>
    </>
  );
};

export default HeroTitle;
