
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Shield, Award, Target } from 'lucide-react';
import TestimonialCard from '../testimonials/TestimonialCard';

const TestimonialsSection: React.FC = () => (
  <section className="py-20 overflow-hidden relative">
    <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/50 -z-10" />
    <div className="absolute inset-0 bg-[url('/img/metal-texture.jpg')] opacity-10 mix-blend-overlay -z-10" />
    
    <div className="container mx-auto px-4 md:px-6">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4 border border-primary/20"
        >
          <Star className="w-4 h-4 mr-2 fill-primary" />
          Истории успеха
        </motion.div>
        
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4 font-playfair relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block relative">
            Нам доверяют SEO-профессионалы
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
          Узнайте, что говорят пользователи о мощных инструментах оптимизации SeoMarket.
        </motion.p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <TestimonialCard
          quote="SeoMarket помог нам выявить критические SEO-проблемы, которые мы пропускали месяцами. Наш органический трафик увеличился на 43% после внедрения их рекомендаций."
          author="Сергей Иванов"
          role="Директор по маркетингу, ТехКорп"
          icon={<Target className="w-10 h-10" />}
        />
        <TestimonialCard
          quote="Функция автоматической оптимизации сайта сэкономила нам бесчисленные часы ручной работы. PDF-отчеты идеально подходят для совместного использования с клиентами."
          author="Алексей Чен"
          role="SEO-консультант"
          icon={<Shield className="w-10 h-10" />}
        />
        <TestimonialCard
          quote="Как владельцу малого бизнеса мне нужно было доступное SEO-решение. SeoMarket предоставил корпоративные инсайты по доступной цене."
          author="Михаил Браун"
          role="Основатель, СтильБутик"
          icon={<Award className="w-10 h-10" />}
        />
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
