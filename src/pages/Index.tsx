import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import { Quote, Star, ArrowRight } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <FeatureSection />
      
      {/* Testimonials Section */}
      <section className="py-20 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4"
            >
              <Star className="w-4 h-4 mr-2" />
              Истории успеха
            </motion.div>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 font-playfair"
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
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 -z-10 bg-animate" />
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)] -z-10" />
        
        <div className="container mx-auto px-4 md:px-6">
          <div className="neo-glass p-8 md:p-12 text-center max-w-4xl mx-auto rounded-3xl">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6 font-playfair"
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
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a 
                href="#top" 
                className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-4 rounded-full inline-flex items-center justify-center gap-2 transition-colors shadow-lg hover:shadow-xl"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Получить бесплатный SEO-аудит
                <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="/pricing" 
                className="bg-transparent border border-primary/20 hover:border-primary/40 text-foreground font-medium px-8 py-4 rounded-full inline-block transition-colors"
              >
                Узнать о тарифах
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
    className="neo-glass p-6 h-full"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    whileHover={{ y: -10 }}
  >
    <div className="mb-4 flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className="h-5 w-5 text-primary fill-primary"
        />
      ))}
    </div>
    <div className="mb-4 text-5xl text-primary/20">
      <Quote />
    </div>
    <blockquote className="mb-6 text-foreground">{quote}</blockquote>
    <div>
      <p className="font-medium font-playfair">{author}</p>
      <p className="text-sm text-muted-foreground">{role}</p>
    </div>
  </motion.div>
);

export default Index;
