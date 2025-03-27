
import React from 'react';
import { motion } from 'framer-motion';
import GrowthItem from './GrowthItem';

interface GrowthItemData {
  position: string;
  newPosition: string;
  keyword: string;
}

interface GrowthItemsGridProps {
  items: GrowthItemData[];
  isVisible: boolean;
  step: number;
}

const GrowthItemsGrid: React.FC<GrowthItemsGridProps> = ({ items, isVisible, step }) => {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-4 md:px-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {items.map((item, index) => (
        <GrowthItem
          key={index}
          position={item.position}
          newPosition={item.newPosition}
          keyword={item.keyword}
          index={index}
          step={step}
        />
      ))}
    </motion.div>
  );
};

export default GrowthItemsGrid;
