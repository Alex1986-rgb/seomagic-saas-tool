
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, BarChart, PieChart, Zap, CheckCircle } from 'lucide-react';
import VideoDemo from '../components/VideoDemo';
import HeroSection from '../components/hero/HeroSection';
import PositionTrackerFeature from '../components/position-tracker/PositionTrackerFeature';
import FeatureSection from '../components/features';
import CTASection from '../components/sections/CTASection';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = React.useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (url.trim()) {
      // Redirect to audit page with the entered URL
      navigate(`/audit?url=${encodeURIComponent(url)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Возможности платформы</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-card rounded-lg p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">SEO Аудит</h3>
              <p className="text-muted-foreground">
                Комплексное сканирование сайта для выявления всех SEO-проблем и возможностей для улучшения.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-card rounded-lg p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">ИИ оптимизация</h3>
              <p className="text-muted-foreground">
                Автоматическое применение оптимизаций с использованием продвинутых алгоритмов искусственного интеллекта.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-card rounded-lg p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Отслеживание позиций</h3>
              <p className="text-muted-foreground">
                Мониторинг позиций вашего сайта в поисковых системах по важным ключевым словам.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Demo Video Section */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Как это работает</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Посмотрите короткое видео о том, как наша платформа проводит аудит и оптимизацию сайтов
            </p>
          </div>
          
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <VideoDemo />
          </motion.div>
        </div>
      </section>
      
      {/* All features section */}
      <FeatureSection />
      
      {/* Position Tracker Feature */}
      <PositionTrackerFeature />
      
      {/* Call to Action Section */}
      <CTASection />
      
      {/* Final CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">Готовы улучшить SEO вашего сайта?</h2>
            <p className="text-lg mb-8">
              Начните бесплатный аудит прямо сейчас и получите детальные рекомендации по оптимизации
            </p>
            <Button 
              onClick={() => navigate('/audit')} 
              size="lg" 
              variant="secondary"
              className="px-8"
            >
              Начать бесплатно
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
