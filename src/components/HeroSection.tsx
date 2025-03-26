
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, FileText, Globe, Wrench, Sparkles, LineChart } from 'lucide-react';
import UrlForm from './UrlForm';

const HeroSection: React.FC = () => {
  return (
    <section className="pt-20 pb-16 md:pt-32 md:pb-20 overflow-hidden relative">
      {/* Фоновые элементы */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent -z-10" />
      <div className="absolute top-1/3 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Профессиональная SEO оптимизация
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-playfair"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="relative inline-block">
              Оптимизируйте ваш сайт с 
              <span className="heading-gradient block md:inline"> профессиональным SEO</span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/60 rounded-full hidden md:block"></div>
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            SeoMarket анализирует ваш сайт, генерирует мгновенные отчеты и предоставляет подробные рекомендации для улучшения позиций в поисковой выдаче.
          </motion.p>
          
          <motion.div 
            className="w-full max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <UrlForm />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
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
        </div>
      </div>
    </section>
  );
};

const FeatureItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => {
  return (
    <motion.div 
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center space-y-3 p-4 neo-glass rounded-xl"
    >
      <div className="p-3 bg-primary/10 text-primary rounded-full">
        {icon}
      </div>
      <p className="text-sm md:text-base font-medium text-center">{text}</p>
    </motion.div>
  );
};

export default HeroSection;
