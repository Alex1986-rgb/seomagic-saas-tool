
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import VideoDemo from '@/components/VideoDemo';
import FeatureSection from '@/components/FeatureSection';
import DemoWorkflow from '@/components/DemoWorkflow';
import { Quote, Star, ArrowRight, Shield, Award, Target } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Video Demo Section - перемещено выше для лучшего ознакомления */}
      <VideoDemo />
      
      {/* Feature Section */}
      <FeatureSection />
      
      {/* Demo Workflow Section */}
      <DemoWorkflow />
      
      {/* Testimonials Section */}
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
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 -z-10" />
        <div className="absolute inset-0 bg-[url('/img/grid-pattern.png')] opacity-5 -z-10" />
        
        <div className="container mx-auto px-4 md:px-6">
          <div className="battle-card p-8 md:p-12 text-center max-w-4xl mx-auto rounded-lg relative border border-primary/30 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/50 rounded-lg -z-10" />
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 rounded-full" />
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary/0 via-primary to-primary/0 rounded-full" />
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 rounded-full" />
            <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-primary/0 via-primary to-primary/0 rounded-full" />
            
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
                className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-4 rounded-md inline-flex items-center justify-center gap-2 transition-colors shadow-lg hover:shadow-xl relative overflow-hidden group"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 group-hover:translate-x-full transition-transform duration-700 ease-in-out -z-10"></span>
                Получить бесплатный SEO-аудит
                <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="/pricing" 
                className="bg-transparent border border-primary/40 hover:border-primary/80 text-foreground font-medium px-8 py-4 rounded-md inline-block transition-colors relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 group-hover:translate-x-full transition-transform duration-700 ease-in-out -z-10"></span>
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
  icon: React.ReactNode;
}> = ({ quote, author, role, icon }) => (
  <motion.div 
    className="tanks-card p-6 h-full relative border border-primary/20"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    whileHover={{ y: -10 }}
  >
    <div className="absolute top-0 left-0 w-[40px] h-[40px] border-t border-l border-primary/40 -mt-px -ml-px" />
    <div className="absolute top-0 right-0 w-[40px] h-[40px] border-t border-r border-primary/40 -mt-px -mr-px" />
    <div className="absolute bottom-0 left-0 w-[40px] h-[40px] border-b border-l border-primary/40 -mb-px -ml-px" />
    <div className="absolute bottom-0 right-0 w-[40px] h-[40px] border-b border-r border-primary/40 -mb-px -mr-px" />
    
    <div className="mb-4 flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className="h-5 w-5 text-primary fill-primary"
        />
      ))}
    </div>
    <div className="mb-4 text-primary/60 absolute top-4 right-4">
      {icon || <Quote className="w-10 h-10" />}
    </div>
    <div className="mt-6 mb-6 text-lg text-foreground/90">{quote}</div>
    <div className="border-t border-primary/10 pt-4 mt-auto">
      <p className="font-medium font-playfair">{author}</p>
      <p className="text-sm text-muted-foreground">{role}</p>
    </div>
  </motion.div>
);

export default Index;
