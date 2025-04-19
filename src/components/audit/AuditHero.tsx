
import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target } from 'lucide-react';

interface AuditHeroProps {
  url: string;
}

const AuditHero: React.FC<AuditHeroProps> = ({ url }) => {
  return (
    <motion.div 
      className="mb-12 text-center max-w-3xl mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="inline-flex items-center px-4 py-2 rounded-sm bg-secondary text-primary font-medium mb-4">
        {url ? <Target className="w-4 h-4 mr-2" /> : <Rocket className="w-4 h-4 mr-2" />}
        {url ? 'SEO Анализ' : 'SEO Аудит'}
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">
        {url ? 'Результаты SEO аудита' : 'Начните SEO аудит'}
      </h1>
      
      <p className="text-lg text-muted-foreground">
        {url 
          ? `Комплексный анализ ${url}`
          : 'Введите URL вашего сайта для получения детального SEO анализа'
        }
      </p>
    </motion.div>
  );
};

export default AuditHero;
