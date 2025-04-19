
import React from 'react';
import { motion } from 'framer-motion';
import FeatureList from './FeatureList';
import FeatureHeader from './FeatureHeader';

const Features: React.FC = () => {
  return (
    <div className="w-full">
      <FeatureHeader />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FeatureList />
      </motion.div>
    </div>
  );
};

export default Features;
