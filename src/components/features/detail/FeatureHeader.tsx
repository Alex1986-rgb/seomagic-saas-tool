
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { IconType } from '@/components/features/types';

interface FeatureHeaderProps {
  icon: IconType;
  title: string;
  description: string;
  category?: string;
}

const FeatureHeader: React.FC<FeatureHeaderProps> = ({
  icon: Icon,
  title,
  description,
  category
}) => {
  return (
    <>
      <div className="mb-8">
        <Link to="/features" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          <span>Все функции</span>
        </Link>
      </div>
      
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-4 rounded-full bg-primary/10">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          {category && (
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
          )}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          {description}
        </p>
      </motion.div>
    </>
  );
};

export default FeatureHeader;
