
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureItemProps {
  feature: {
    name: string;
    description: string;
    icon: LucideIcon;
  };
  index: number;
}

const FeatureItem = ({ feature, index }: FeatureItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col"
    >
      <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary">
          <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        {feature.name}
      </dt>
      <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
        <p className="flex-auto">{feature.description}</p>
      </dd>
    </motion.div>
  );
};

export default FeatureItem;
