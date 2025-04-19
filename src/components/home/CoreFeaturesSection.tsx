
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Zap, BarChart } from 'lucide-react';

const CoreFeaturesSection: React.FC = () => {
  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background -z-10" />
      
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4 border border-primary/20">
            <CheckCircle className="w-4 h-4 mr-2 animate-pulse-slow" />
            Комплексное SEO решение
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">
            <span className="relative inline-block">
              Основные возможности
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
            Набор инструментов для полного анализа и оптимизации вашего сайта
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div 
            className="neo-card p-8 relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <div className="mb-5 p-3 bg-primary/10 rounded-full inline-block">
              <Search className="h-6 w-6 text-primary animate-pulse-slow" />
            </div>
            <h3 className="text-xl font-medium mb-3">SEO Аудит</h3>
            <p className="text-muted-foreground">
              Комплексное сканирование сайта для выявления всех SEO-проблем и возможностей для улучшения.
            </p>
          </motion.div>
          
          <motion.div 
            className="neo-card p-8 relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <div className="mb-5 p-3 bg-primary/10 rounded-full inline-block">
              <Zap className="h-6 w-6 text-primary animate-pulse-slow" />
            </div>
            <h3 className="text-xl font-medium mb-3">ИИ оптимизация</h3>
            <p className="text-muted-foreground">
              Автоматическое применение оптимизаций с использованием продвинутых алгоритмов искусственного интеллекта.
            </p>
          </motion.div>
          
          <motion.div 
            className="neo-card p-8 relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <div className="mb-5 p-3 bg-primary/10 rounded-full inline-block">
              <BarChart className="h-6 w-6 text-primary animate-pulse-slow" />
            </div>
            <h3 className="text-xl font-medium mb-3">Отслеживание позиций</h3>
            <p className="text-muted-foreground">
              Мониторинг позиций вашего сайта в поисковых системах по важным ключевым словам.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CoreFeaturesSection;
