
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureProps {
  feature: {
    name: string;
    description: string;
    icon: LucideIcon;
  };
  index: number;
}

const FeatureItem: React.FC<FeatureProps> = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
      className="group relative backdrop-blur-sm bg-card/60 p-6 rounded-xl shadow-sm border border-primary/5 transition-all duration-300 hover:border-primary/20"
    >
      <dt className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <feature.icon className="h-8 w-8 text-primary" aria-hidden="true" />
        </div>
        <p className="text-xl font-semibold mb-3">{feature.name}</p>
      </dt>
      <dd className="text-center text-muted-foreground">
        {feature.description}
      </dd>
    </motion.div>
  );
};

export default FeatureItem;
