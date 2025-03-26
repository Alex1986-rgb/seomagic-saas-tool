
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
      className="flex flex-col items-center space-y-3 p-4 neo-glass rounded-xl relative overflow-hidden group"
    >
      <div className="p-3 bg-gradient-to-br from-primary/10 to-indigo-500/10 text-indigo-400 rounded-full relative z-10">
        {icon}
      </div>
      <p className="text-sm md:text-base font-medium text-center relative z-10">{text}</p>
      
      {/* Animated background on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <motion.div 
        className="absolute -bottom-10 -right-10 w-20 h-20 bg-indigo-500/5 rounded-full z-0"
        initial={{ scale: 0 }}
        whileHover={{ scale: 4 }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
};

export default FeatureItem;
