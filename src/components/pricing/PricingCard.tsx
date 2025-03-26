
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  pagesRange: string;
  features: string[];
  recommended: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ title, price, pagesRange, features, recommended }) => (
  <motion.div 
    className={`relative rounded-xl p-6 border ${
      recommended 
        ? 'border-primary shadow-lg shadow-primary/20' 
        : 'border-primary/30'
    } flex flex-col h-full`}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    whileHover={{ y: -10, boxShadow: recommended ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : 'none' }}
  >
    {recommended && (
      <div className="absolute -top-3 left-0 right-0 mx-auto w-max px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
        Рекомендуемый
      </div>
    )}
    
    <h3 className="text-xl font-bold mb-1">{title}</h3>
    <p className="text-muted-foreground text-sm mb-6">{pagesRange}</p>
    
    <div className="mb-6">
      <span className="text-3xl font-bold">{price} ₽</span>
      <span className="text-muted-foreground ml-1">/ месяц</span>
    </div>
    
    <ul className="space-y-3 mb-8 flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
          <span className="text-sm">{feature}</span>
        </li>
      ))}
    </ul>
    
    <a 
      href="/audit"
      className={`w-full py-2 px-4 rounded-md text-center font-medium ${
        recommended 
          ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
          : 'bg-primary/10 text-primary hover:bg-primary/20'
      } transition-colors`}
    >
      Начать
    </a>
  </motion.div>
);

export default PricingCard;
