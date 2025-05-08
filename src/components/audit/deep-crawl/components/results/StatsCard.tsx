
import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  value: string | number;
  label: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ value, label }) => {
  return (
    <motion.div 
      className="bg-card/30 p-4 rounded-lg border border-border flex flex-col items-center justify-center backdrop-blur-sm"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-3xl font-bold text-primary">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
};

export default StatsCard;
