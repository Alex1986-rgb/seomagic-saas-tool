
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-4xl py-32 sm:py-48">
        <div className="text-center">
          <motion.h1
            className="text-4xl font-bold tracking-tight text-primary sm:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Улучшите SEO вашего сайта
          </motion.h1>
          
          <motion.p
            className="mt-6 text-lg leading-8 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Автоматический анализ и рекомендации для улучшения поисковой оптимизации. 
            Отслеживайте позиции в поисковых системах и получайте подробные отчеты.
          </motion.p>

          <motion.div
            className="mt-10 flex items-center justify-center gap-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              size="lg"
              className="gap-2"
              onClick={() => navigate('/audit')}
            >
              <Search className="h-4 w-4" />
              Начать анализ
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/features')}
            >
              Узнать больше
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
