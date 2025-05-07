
import React from 'react';
import { motion } from 'framer-motion';
import UrlForm from '../url-form';
import HeroTitle from './HeroTitle';
import HeroBackground from './HeroBackground';
import FeatureGrid from './FeatureGrid';
import FloatingIndicators from './FloatingIndicators';

const HeroSection: React.FC = () => {
  // Animation container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="pt-16 pb-12 md:pt-24 lg:pt-32 md:pb-16 lg:pb-20 overflow-hidden relative">
      <HeroBackground />
      
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="flex flex-col items-center text-center space-y-6 md:space-y-8 max-w-4xl mx-auto"
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
            <FeatureGrid />
          </motion.div>
        </motion.div>
      </div>
      
      <FloatingIndicators />
    </section>
  );
};

export default HeroSection;
