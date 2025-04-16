
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { SearchIcon, ChevronRight } from 'lucide-react';
import { Input } from "@/components/ui/input";
import UrlForm from "@/components/url-form";

const HeroSection = () => {
  const navigate = useNavigate();
  
  const handleAuditClick = () => {
    navigate('/audit');
  };
  
  return (
    <section className="px-4 py-20 md:py-32 mx-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 to-transparent -z-10" />
      
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div 
            className="lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Комплексный SEO аудит и мониторинг вашего сайта
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              Получите подробный анализ вашего сайта и отслеживайте его позиции в поисковых системах
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                onClick={handleAuditClick}
                className="text-md px-8 py-6 h-auto"
              >
                Начать бесплатный аудит
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-md px-8 py-6 h-auto"
                onClick={() => navigate('/features')}
              >
                Узнать больше
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-card/70 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-primary/10 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-center">Проверить SEO сайта</h2>
              <UrlForm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
