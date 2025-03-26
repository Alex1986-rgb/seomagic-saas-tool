
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MissionSection = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-32"
    >
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Наша миссия
          </div>
          <h2 className="font-playfair text-4xl font-bold mb-6 leading-tight">
            Делаем SEO доступным и <span className="heading-gradient">эффективным</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Мы создали инструмент, который помогает владельцам сайтов и маркетологам 
            улучшить видимость их ресурсов в поисковых системах, используя передовые 
            технологии анализа и понятные рекомендации.
          </p>
          
          <div className="py-2">
            <div className="flex items-center gap-3 mb-2">
              <BarChart2 className="text-primary h-5 w-5" />
              <p className="font-semibold">Увеличение органического трафика до 190%</p>
            </div>
            <div className="bg-secondary/50 h-2 w-full rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary/70 h-full rounded-full" style={{ width: '87%' }}></div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">87% наших клиентов отмечают значительный рост</p>
          </div>
          
          <Button size="lg" className="rounded-full gap-2 premium-gradient" asChild>
            <Link to="/audit">
              Попробовать бесплатно <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl transform rotate-3"></div>
          <img 
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
            alt="Команда SEO Market за работой" 
            className="rounded-3xl shadow-2xl transform -rotate-3 transition-transform hover:rotate-0 duration-500 object-cover h-full max-h-96 w-full"
          />
          <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-3 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <p className="text-sm font-medium">Рост позиций в поиске</p>
            <p className="text-2xl font-bold text-primary">+320%</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default MissionSection;
