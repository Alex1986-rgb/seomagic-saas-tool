
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DetailedFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  index: number;
}

const DetailedFeatureCard: React.FC<DetailedFeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  link,
  index 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <div className="neo-card p-6 h-full relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/40">
        {/* Background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10">
          {/* Icon */}
          <div className="mb-4 p-3 bg-primary/10 rounded-full inline-block group-hover:bg-primary/20 transition-colors duration-300">
            <Icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          
          {/* Description */}
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {description}
          </p>
          
          {/* Arrow Link */}
          <Link 
            to={link}
            className="inline-flex items-center text-primary font-medium hover:gap-3 transition-all duration-300 group/link"
          >
            <span>Подробнее</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
        
        {/* Decorative element */}
        <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
      </div>
    </motion.div>
  );
};

export default DetailedFeatureCard;
