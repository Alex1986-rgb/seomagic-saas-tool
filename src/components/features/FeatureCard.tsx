
import React from 'react';
import { motion } from 'framer-motion';
import { FeatureCardProps } from './types';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  link,
  layoutId 
}) => {
  const cardContent = (
    <motion.div 
      className="h-full flex flex-col p-6 bg-card/60 backdrop-blur-sm border border-border rounded-lg hover:border-primary/40 transition-all"
      whileHover={{ y: -5, boxShadow: '0 10px 30px -15px rgba(0, 0, 0, 0.3)' }}
      layoutId={layoutId}
    >
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm flex-grow mb-4">{description}</p>
      {link && (
        <div className="mt-auto">
          <div className="flex items-center text-primary text-sm font-medium">
            <span>Подробнее</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </div>
      )}
    </motion.div>
  );
  
  if (link) {
    return (
      <Link to={link} className="block h-full">
        {cardContent}
      </Link>
    );
  }
  
  return cardContent;
};

export default FeatureCard;
