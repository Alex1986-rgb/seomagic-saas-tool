
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingHero: React.FC = () => {
  return (
    <div className="text-center max-w-4xl mx-auto mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <Zap className="w-3 h-3 mr-2" />
          Профессиональная SEO-оптимизация
        </Badge>
      </motion.div>

      <motion.h1 
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Выберите подходящий тариф
      </motion.h1>
      
      <motion.p 
        className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Мы предлагаем гибкие варианты подписки для любых потребностей - от личных блогов до крупных корпоративных сайтов
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium">7 дней бесплатно</span>
        </div>
        
        <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800">
          <Shield className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium">Гарантия качества</span>
        </div>
        
        <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border border-purple-200 dark:border-purple-800">
          <Zap className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-medium">Быстрый результат</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button size="lg" className="rounded-full px-8" asChild>
          <Link to="/audit">
            Попробовать бесплатно
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
          <Link to="/contact">Получить консультацию</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default PricingHero;
