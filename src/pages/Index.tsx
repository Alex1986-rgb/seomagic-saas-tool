
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';

const Index: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <FeatureSection />
      
      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Нам доверяют SEO-профессионалы
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
            />
            <TestimonialCard
              quote="Функция автоматической оптимизации сайта сэкономила нам бесчисленные часы ручной работы. PDF-отчеты идеально подходят для совместного использования с клиентами."
              author="Алексей Чен"
              role="SEO-консультант"
            />
            <TestimonialCard
              quote="Как владельцу малого бизнеса мне нужно было доступное SEO-решение. SeoMarket предоставил корпоративные инсайты по доступной цене."
              author="Михаил Браун"
              role="Основатель, СтильБутик"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="glass-panel p-8 md:p-12 text-center max-w-4xl mx-auto">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Готовы оптимизировать ваш сайт?
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Начните с бесплатного SEO-аудита сегодня и узнайте, как SeoMarket может преобразить ваше онлайн-присутствие.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <a 
                href="#top" 
                className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-4 rounded-full inline-block transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Получить бесплатный SEO-аудит
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

const TestimonialCard: React.FC<{
  quote: string;
  author: string;
  role: string;
}> = ({ quote, author, role }) => (
  <motion.div 
    className="neo-card p-6"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <div className="mb-4">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5 inline-block text-amber-500"
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clipRule="evenodd"
          />
        </svg>
      ))}
    </div>
    <blockquote className="mb-4 text-foreground italic">"{quote}"</blockquote>
    <div>
      <p className="font-medium">{author}</p>
      <p className="text-sm text-muted-foreground">{role}</p>
    </div>
  </motion.div>
);

export default Index;
