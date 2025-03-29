
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import FeatureList from './FeatureList';

const FeatureSection: React.FC = () => {
  return (
    <section className="py-24 bg-muted/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background -z-10" />
      
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4 border border-primary/20">
            <Sparkles className="w-4 h-4 mr-2 animate-pulse-slow" />
            Полный комплекс SEO-инструментов
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair">
            <span className="relative inline-block">
              Возможности платформы
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/60 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Все необходимые инструменты для комплексного анализа, оптимизации и 
            мониторинга вашего сайта в одном месте
          </p>
        </motion.div>
        
        <FeatureList />
      </div>
    </section>
  );
};

export default FeatureSection;
