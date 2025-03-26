
import React from 'react';
import { motion } from 'framer-motion';
import Testimonial from './Testimonial';

const TestimonialsSection = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mb-32"
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-6">Отзывы клиентов</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Что говорят о нас клиенты после использования сервиса
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <Testimonial 
          quote="SEO Market помог нам увеличить органический трафик на 180% за 6 месяцев. Рекомендации были точными и действенными."
          author="Ольга Смирнова"
          company="Директор по маркетингу, ООО «ТехноПлюс»"
        />
        <Testimonial 
          quote="Благодаря подробному аудиту мы смогли выявить и устранить критические ошибки на сайте, что привело к росту конверсии на 35%."
          author="Игорь Васильев"
          company="Владелец интернет-магазина «ЭкоТовары»"
        />
      </div>
    </motion.section>
  );
};

export default TestimonialsSection;
