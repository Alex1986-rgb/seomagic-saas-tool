
import React from 'react';
import { motion } from 'framer-motion';

interface FeatureItemProps {
  icon: React.ReactNode;
  text: string;
  description?: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text, description }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ 
        y: -8, 
        transition: { duration: 0.2 } 
      }}
      className="group cursor-pointer"
    >
      <div className="relative p-6 rounded-2xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
        {/* Gradient background on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-3">
          <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary/20 transition-colors duration-300 group-hover:scale-110 transform">
            {icon}
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-sm md:text-base group-hover:text-primary transition-colors duration-300">
              {text}
            </p>
            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <motion.div 
          className="absolute -top-2 -right-2 w-4 h-4 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100"
          initial={{ scale: 0 }}
          whileHover={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div 
          className="absolute -bottom-2 -left-2 w-3 h-3 bg-secondary/30 rounded-full opacity-0 group-hover:opacity-100"
          initial={{ scale: 0 }}
          whileHover={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
      </div>
    </motion.div>
  );
};

export default FeatureItem;
