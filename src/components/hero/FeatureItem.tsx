
import React from 'react';
import { motion } from 'framer-motion';

interface FeatureItemProps {
  icon: React.ReactNode;
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text }) => {
  return (
    <motion.div 
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
      className="gradient-border group"
    >
      <div className="flex flex-col items-center space-y-3 p-4 rounded-lg relative overflow-hidden">
        <div className="p-3 bg-primary/10 text-primary rounded-full relative z-10">
          {icon}
        </div>
        <p className="text-sm md:text-base font-medium text-center relative z-10">{text}</p>
        
        {/* Анимация фона при наведении */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <motion.div 
          className="absolute -bottom-10 -right-10 w-20 h-20 bg-primary/5 rounded-full z-0"
          initial={{ scale: 0 }}
          whileHover={{ scale: 4 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
};

export default FeatureItem;
