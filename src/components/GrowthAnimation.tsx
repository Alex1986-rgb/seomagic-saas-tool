
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Star, ArrowUp, ArrowRight } from 'lucide-react';

const GrowthAnimation: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      
      // Последовательная анимация шагов
      const stepInterval = setInterval(() => {
        setStep(prev => {
          if (prev >= 3) {
            clearInterval(stepInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
      
      return () => clearInterval(stepInterval);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const growthItems = [
    { position: "10", newPosition: "3", keyword: "SEO оптимизация" },
    { position: "15", newPosition: "4", keyword: "Аудит сайта" },
    { position: "24", newPosition: "7", keyword: "Анализ конкурентов" },
    { position: "32", newPosition: "11", keyword: "Продвижение сайта" }
  ];

  return (
    <div className="my-12 py-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-4 font-playfair">Реальный рост позиций после оптимизации</h3>
        <p className="text-muted-foreground">Клиенты отмечают значительное улучшение позиций в поисковой выдаче</p>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {growthItems.map((item, index) => (
          <motion.div
            key={index}
            className="relative p-6 border border-primary/20 rounded-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ 
              y: step >= index ? 0 : 20, 
              opacity: step >= index ? 1 : 0 
            }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="absolute top-0 left-0 w-[30px] h-[30px] border-t border-l border-primary/40 -mt-px -ml-px" />
            <div className="absolute top-0 right-0 w-[30px] h-[30px] border-t border-r border-primary/40 -mt-px -mr-px" />
            <div className="absolute bottom-0 left-0 w-[30px] h-[30px] border-b border-l border-primary/40 -mb-px -ml-px" />
            <div className="absolute bottom-0 right-0 w-[30px] h-[30px] border-b border-r border-primary/40 -mb-px -mr-px" />
            
            <p className="text-sm text-muted-foreground mb-2">Ключевая фраза</p>
            <h4 className="text-lg font-medium mb-4">{item.keyword}</h4>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full mr-3">
                  <span className="font-bold">{item.position}</span>
                </div>
                <ArrowRight className="mx-2 text-muted-foreground" size={16} />
                <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                  <span className="font-bold">{item.newPosition}</span>
                </div>
              </div>
              
              <motion.div 
                className="flex items-center text-green-600 dark:text-green-400"
                initial={{ x: -10, opacity: 0 }}
                animate={{ 
                  x: step > index ? 0 : -10, 
                  opacity: step > index ? 1 : 0 
                }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <TrendingUp className="mr-1" size={16} />
                <span className="font-bold">
                  +{parseInt(item.position) - parseInt(item.newPosition)} позиций
                </span>
              </motion.div>
            </div>
            
            <motion.div
              className="h-2 bg-gray-200 dark:bg-gray-700 mt-4 rounded-full overflow-hidden"
              initial={{ width: "100%" }}
              animate={{ width: "100%" }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                initial={{ width: "0%" }}
                animate={{ 
                  width: step > index ? `${((parseInt(item.position) - parseInt(item.newPosition)) / parseInt(item.position)) * 100}%` : "0%" 
                }}
                transition={{ duration: 1, delay: index * 0.3 }}
              />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div 
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: step >= 3 ? 1 : 0,
          y: step >= 3 ? 0 : 20
        }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <p className="text-lg font-medium mb-4">Средний рост в ТОП-10 за 2-3 месяца работы</p>
        <a 
          href="/audit" 
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-3 rounded-md inline-flex items-center justify-center gap-2 transition-colors shadow-lg hover:shadow-xl"
        >
          Проверить мой сайт
          <ArrowRight className="w-4 h-4" />
        </a>
      </motion.div>
    </div>
  );
};

export default GrowthAnimation;
