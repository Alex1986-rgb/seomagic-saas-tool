
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const FeatureHeader: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4 border border-primary/20">
        <CheckCircle2 className="w-4 h-4 mr-2" />
        Комплексное SEO решение
      </div>
      <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">
        <span className="relative inline-block">
          Полный набор SEO инструментов
          <motion.div 
            className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/60 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </span>
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Анализируйте, оптимизируйте и контролируйте SEO-производительность вашего сайта с помощью нашего полного набора инструментов.
      </p>
    </motion.div>
  );
};

export default FeatureHeader;
