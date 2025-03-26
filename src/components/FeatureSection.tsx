
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, FileText, Globe, RefreshCw, ShieldCheck, Zap, ChevronRight } from 'lucide-react';

const FeatureSection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background -z-10" />
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent z-10"></div>
      
      {/* Анимированные фоновые элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-40 left-10 w-40 h-40 bg-primary/5 rounded-full"
          animate={{
            y: [0, 20, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-40 right-10 w-60 h-60 bg-primary/5 rounded-full"
          animate={{
            y: [0, -30, 0],
            x: [0, -15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 md:px-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <FeatureCard
            icon={<CheckCircle2 size={24} className="text-primary" />}
            title="Полный SEO аудит"
            description="Глубокий анализ мета-тегов, заголовков, изображений, ссылок и многого другого для выявления всех SEO-проблем."
          />
          <FeatureCard
            icon={<FileText size={24} className="text-primary" />}
            title="Подробные отчеты"
            description="Получите комплексные PDF-отчеты с практическими рекомендациями и приоритизированными рекомендациями."
          />
          <FeatureCard
            icon={<Globe size={24} className="text-primary" />}
            title="Оптимизированная копия сайта"
            description="Получите полностью оптимизированную версию вашего сайта с улучшенными SEO-элементами."
          />
          <FeatureCard
            icon={<RefreshCw size={24} className="text-primary" />}
            title="Сравнение До/После"
            description="Увидьте разницу между вашим оригинальным сайтом и оптимизированной версией."
          />
          <FeatureCard
            icon={<ShieldCheck size={24} className="text-primary" />}
            title="Технические SEO исправления"
            description="Автоматическая генерация sitemap.xml, robots.txt и структурированных данных."
          />
          <FeatureCard
            icon={<Zap size={24} className="text-primary" />}
            title="ИИ-рекомендации"
            description="Интеллектуальные рекомендации для мета-заголовков, описаний и оптимизации контента."
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="neo-card p-6 border border-primary/10 h-full relative overflow-hidden group"
    >
      <div className="mb-5 p-3 bg-primary/10 rounded-full inline-block relative z-10">{icon}</div>
      <h3 className="text-xl font-semibold mb-3 relative z-10">{title}</h3>
      <p className="text-muted-foreground relative z-10">{description}</p>
      
      {/* Индикатор "Подробнее" при наведении */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center text-sm text-primary font-medium gap-1">
        <span>Подробнее</span>
        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
      </div>
      
      {/* Декоративный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

export default FeatureSection;
