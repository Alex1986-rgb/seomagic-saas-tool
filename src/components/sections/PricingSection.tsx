
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Target } from 'lucide-react';
import PricingCard from '../pricing/PricingCard';

const PricingSection: React.FC = () => (
  <section className="py-16 overflow-hidden relative">
    <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background/30 -z-10" />
    <div className="container mx-auto px-4 md:px-6">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4 border border-primary/20"
        >
          <Target className="w-4 h-4 mr-2 fill-primary" />
          Прозрачное ценообразование
        </motion.div>
        
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4 font-playfair relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block relative">
            Оплата за страницы, а не за весь сайт
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/60 rounded-full"></div>
          </span>
        </motion.h2>
        <motion.p 
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Мы адаптируем стоимость услуг под размер вашего проекта. Платите только за то, что действительно нужно оптимизировать.
        </motion.p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <PricingCard 
          title="Небольшой сайт"
          price="500"
          pagesRange="до 50 страниц"
          features={[
            "500₽ за базовую оптимизацию страницы",
            "Оптимизация мета-тегов от 50₽",
            "Исправление технических ошибок",
            "Улучшение текстового контента от 150₽",
            "Поддержка 14 дней"
          ]}
          recommended={false}
        />
        
        <PricingCard 
          title="Средний бизнес"
          price="300"
          pagesRange="от 50 до 500 страниц"
          features={[
            "300₽ за базовую оптимизацию страницы",
            "Оптимизация мета-тегов от 40₽",
            "Оптимизация alt-тегов от 20₽",
            "Исправление дублей контента от 200₽",
            "Улучшение текстов от 150₽",
            "Поддержка 30 дней"
          ]}
          recommended={true}
        />
        
        <PricingCard 
          title="Корпоративный"
          price="150"
          pagesRange="от 500 страниц"
          features={[
            "150₽ за базовую оптимизацию страницы",
            "Оптимизация мета-тегов от 35₽",
            "Оптимизация ключевых слов от 25₽",
            "Исправление дублей от 180₽",
            "Улучшение текстов от 130₽",
            "Техническая поддержка 24/7",
            "Скидки от объема до 15%"
          ]}
          recommended={false}
        />
      </div>
      
      <div className="text-center mt-12">
        <p className="text-muted-foreground mb-4">
          Нужно больше? У нас есть индивидуальные решения для крупных проектов
        </p>
        <a 
          href="/pricing" 
          className="text-primary hover:text-primary/80 font-medium inline-flex items-center"
        >
          Узнать подробнее
          <ArrowRight className="ml-1 h-4 w-4" />
        </a>
      </div>
    </div>
  </section>
);

export default PricingSection;
