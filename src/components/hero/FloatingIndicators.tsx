
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

/**
 * Плавающие плашки на главной показывали «PageSpeed 98/100», «SEO Score +45%»
 * и «Конверсия +22%» — выглядело как результаты клиентов, но это просто числа
 * из вёрстки. Теперь на плашках то, что аудит действительно проверяет, без
 * выдуманных цифр.
 */
const FloatingIndicators: React.FC = () => {
  return (
    <div className="hidden md:block">
      <motion.div 
        className="absolute top-20 left-20 opacity-30"
        animate={{ 
          y: [0, -10, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <div className="flex items-center gap-2 glass-panel px-2 py-1 rounded-full">
          <Check size={12} className="text-primary" />
          <span className="text-xs">Скорость ответа</span>
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-40 right-20 opacity-30"
        animate={{ 
          y: [0, -10, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      >
        <div className="flex items-center gap-2 glass-panel px-2 py-1 rounded-full">
          <Check size={12} className="text-primary" />
          <span className="text-xs">Мета-теги</span>
        </div>
      </motion.div>
      
      {/* Добавим еще один плавающий индикатор */}
      <motion.div 
        className="absolute top-40 right-40 opacity-30"
        animate={{ 
          y: [0, -8, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1.5
        }}
      >
        <div className="flex items-center gap-2 glass-panel px-2 py-1 rounded-full">
          <Check size={12} className="text-primary" />
          <span className="text-xs">Индексируемость</span>
        </div>
      </motion.div>
    </div>
  );
};

export default FloatingIndicators;
