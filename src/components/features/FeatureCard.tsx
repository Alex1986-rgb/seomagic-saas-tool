
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FeatureCardProps } from './types';

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  link,
  layoutId 
}) => {
  // Если не предоставлена ссылка, создаем ее на основе заголовка
  const pageLink = link || `/features/${title.toLowerCase().replace(/\s+/g, '-')}`;
  
  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.4
      }
    }
  };
  
  return (
    <motion.div 
      variants={itemVariant}
      layoutId={layoutId}
      className="glass-panel p-4 rounded-lg h-full flex flex-col justify-between group relative overflow-hidden"
      whileHover={{ 
        y: -5, 
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
    >
      <div>
        <div className="mb-3 p-2 bg-primary/10 rounded-full inline-block">{icon}</div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </div>
      
      <div className="mt-3 w-full">
        <Button 
          variant="link" 
          className="p-0 h-auto text-primary flex items-center gap-1 hover:gap-2 transition-all"
          asChild
        >
          <Link to={pageLink}>
            <span>Подробнее</span>
            <ChevronRight size={16} className="transition-transform duration-200" />
          </Link>
        </Button>
      </div>
      
      {/* Decorative background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

export default FeatureCard;
