
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, FileText, Globe, Wrench, Sparkles, LineChart, Check } from 'lucide-react';
import UrlForm from './UrlForm';

const HeroSection: React.FC = () => {
  // Анимация для появления элементов
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="pt-20 pb-16 md:pt-32 md:pb-20 overflow-hidden relative">
      {/* Фоновые элементы с анимацией */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent -z-10" />
      <motion.div 
        className="absolute top-1/3 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2
        }}
      />
      
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Sparkles className="w-4 h-4 mr-2 animate-pulse-slow" />
            Профессиональная SEO оптимизация
            <motion.span 
              className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity
              }}
            />
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-playfair"
            variants={itemVariants}
          >
            <span className="relative inline-block">
              Оптимизируйте ваш сайт с 
              <span className="heading-gradient block md:inline"> профессиональным SEO</span>
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/60 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 0.8 }}
              />
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl"
            variants={itemVariants}
          >
            SeoMarket анализирует ваш сайт, генерирует мгновенные отчеты и предоставляет подробные рекомендации для улучшения позиций в поисковой выдаче.
          </motion.p>
          
          <motion.div 
            className="w-full max-w-2xl"
            variants={itemVariants}
          >
            <UrlForm />
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            className="w-full"
          >
            <div className="flex items-center justify-center mb-6">
              <LineChart className="text-primary mr-2" size={18} />
              <p className="text-sm font-medium">Увеличьте органический трафик в среднем на 150%</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full">
              <FeatureItem 
                icon={<Search size={24} />}
                text="Глубокий SEO Анализ" 
              />
              <FeatureItem 
                icon={<FileText size={24} />}
                text="Детальный PDF Отчет" 
              />
              <FeatureItem 
                icon={<Wrench size={24} />}
                text="Автоматическое исправление" 
              />
              <FeatureItem 
                icon={<Globe size={24} />}
                text="Оптимизированная копия" 
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Плавающие индикаторы */}
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
          <div className="flex items-center gap-2 bg-primary/10 px-2 py-1 rounded-full">
            <Check size={12} className="text-primary" />
            <span className="text-xs">PageSpeed 98/100</span>
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
          <div className="flex items-center gap-2 bg-primary/10 px-2 py-1 rounded-full">
            <Check size={12} className="text-primary" />
            <span className="text-xs">SEO Score +45%</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FeatureItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => {
  return (
    <motion.div 
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center space-y-3 p-4 neo-glass rounded-xl relative overflow-hidden group"
    >
      <div className="p-3 bg-primary/10 text-primary rounded-full relative z-10">
        {icon}
      </div>
      <p className="text-sm md:text-base font-medium text-center relative z-10">{text}</p>
      
      {/* Анимированный фон при наведении */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <motion.div 
        className="absolute -bottom-10 -right-10 w-20 h-20 bg-primary/5 rounded-full z-0"
        initial={{ scale: 0 }}
        whileHover={{ scale: 4 }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
};

export default HeroSection;
