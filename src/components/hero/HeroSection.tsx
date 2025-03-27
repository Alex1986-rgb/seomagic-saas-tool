
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { LineChart } from 'lucide-react';
import UrlForm from '../url-form';
import HeroTitle from './HeroTitle';
import HeroBackground from './HeroBackground';
import FeatureGrid from './FeatureGrid';
import FloatingIndicators from './FloatingIndicators';
import { PriorityImage } from '../LazyImage';

// Оптимизированные варианты анимаций
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      type: "spring",
      stiffness: 50
    }
  }
};
  
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const HeroSection: React.FC = () => {
  return (
    <section className="pt-20 pb-16 md:pt-32 md:pb-20 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent -z-10" />
      <HeroBackground />
      
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <HeroTitle itemVariants={itemVariants} />
          
          <motion.div 
            className="w-full max-w-2xl"
            variants={itemVariants}
          >
            <UrlForm />
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            className="w-full"
          >
            <div className="flex items-center justify-center mb-6">
              <LineChart className="text-primary mr-2" size={18} aria-hidden="true" />
              <p className="text-sm font-medium">Увеличьте органический трафик в среднем на 150%</p>
            </div>
            
            <FeatureGrid />
          </motion.div>
        </motion.div>
      </div>
      
      <FloatingIndicators />
      
      {/* Скрытое изображение с данными для SEO */}
      <div className="hidden">
        <PriorityImage 
          src="/img/seo-optimization.jpg" 
          alt="SEO оптимизация и аудит сайтов - повышение позиций в поисковых системах" 
          width={1200} 
          height={630}
        />
      </div>
    </section>
  );
};

export default memo(HeroSection);
