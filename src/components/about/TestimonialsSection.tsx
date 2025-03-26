
import React from 'react';
import { motion } from 'framer-motion';
import Testimonial from './Testimonial';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "SEO Market помог нам увеличить органический трафик на 180% за 6 месяцев. Рекомендации были точными и действенными.",
      author: "Ольга Смирнова",
      company: "Директор по маркетингу, ООО «ТехноПлюс»",
      rating: 5
    },
    {
      quote: "Благодаря подробному аудиту мы смогли выявить и устранить критические ошибки на сайте, что привело к росту конверсии на 35%.",
      author: "Игорь Васильев",
      company: "Владелец интернет-магазина «ЭкоТовары»",
      rating: 5
    },
    {
      quote: "Сервис очень понятный и удобный. Даже новичку в SEO будет легко разобраться с отчетами и рекомендациями.",
      author: "Марина Козлова",
      company: "Менеджер проектов, «Инфо-Стиль»",
      rating: 4
    },
    {
      quote: "После внедрения предложенных улучшений наш сайт поднялся в выдаче по ключевым запросам с 5-й страницы на первую.",
      author: "Александр Петров",
      company: "CEO, «DigitalWave»",
      rating: 5
    }
  ];

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
        {testimonials.map((testimonial, index) => (
          <Testimonial 
            key={index}
            quote={testimonial.quote}
            author={testimonial.author}
            company={testimonial.company}
            rating={testimonial.rating}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default TestimonialsSection;
