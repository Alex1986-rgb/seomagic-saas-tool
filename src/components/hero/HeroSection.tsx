
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
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  console.log("HeroSection rendering");

  return (
    <section className="relative pt-24 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <HeroBackground />
      
      {/* Main content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          className="flex flex-col items-center text-center space-y-10 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <HeroTitle itemVariants={itemVariants} />
          
          {/* Enhanced CTA section */}
          <motion.div 
            className="w-full max-w-3xl space-y-6"
            variants={itemVariants}
          >
            <UrlForm />
            
            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Более 50,000 сайтов проанализировано</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Средний прирост трафика +43%</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            className="w-full"
          >
            <FeatureGrid />
          </motion.div>

          {/* Social proof */}
          <motion.div 
            variants={itemVariants}
            className="pt-8"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-background"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-background"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-2 border-background"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full border-2 border-background flex items-center justify-center text-xs font-medium text-white">
                    +5K
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">Довольных клиентов</span>
              </div>
              
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 text-yellow-400 fill-current">⭐</div>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">4.9/5 рейтинг</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <FloatingIndicators />
    </section>
  );
};

export default HeroSection;
