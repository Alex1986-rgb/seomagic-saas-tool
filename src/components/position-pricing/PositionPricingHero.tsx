
import React from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, LineChart } from 'lucide-react';

const PositionPricingHero: React.FC = () => {
  return (
    <div className="text-center mb-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4 border border-primary/20"
      >
        <Search className="w-4 h-4 mr-2" />
        Мониторинг позиций в поисковых системах
      </motion.div>
      
      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Отслеживайте позиции вашего сайта
        <br />
        <span className="text-primary">по всем ключевым запросам</span>
      </motion.h1>
      
      <motion.p
        className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        Ежедневный мониторинг позиций, детальная статистика и уведомления об изменениях. 
        Следите за эффективностью SEO-оптимизации в режиме реального времени.
      </motion.p>
      
      <motion.div
        className="flex flex-wrap justify-center gap-4 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span>Точность данных 99.8%</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
          <LineChart className="h-4 w-4 text-blue-500" />
          <span>История изменений до 90 дней</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
          <Search className="h-4 w-4 text-purple-500" />
          <span>Яндекс, Google, Bing</span>
        </div>
      </motion.div>
    </div>
  );
};

export default PositionPricingHero;
