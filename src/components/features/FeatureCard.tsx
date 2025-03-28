
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FeatureCardProps } from './types';

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, link }) => {
  // Если ссылка не указана, создадим ее на основе названия
  const pageLink = link || `/features/${title.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-panel p-6 h-full relative overflow-hidden group"
    >
      <div className="mb-5 p-3 bg-primary/10 rounded-full inline-block relative z-10">{icon}</div>
      <h3 className="text-xl font-semibold mb-3 relative z-10">{title}</h3>
      <p className="text-muted-foreground relative z-10">{description}</p>
      
      <div className="mt-6 relative z-10">
        <Link to={pageLink}>
          <Button variant="link" className="p-0 h-auto text-primary flex items-center gap-1 hover:gap-2 transition-all">
            <span>Подробнее</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </Link>
      </div>
      
      {/* Декоративные элементы */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

export default FeatureCard;
