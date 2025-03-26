
import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
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
            <Star className="w-4 h-4 mr-2" />
            Наша миссия
          </div>
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Делаем SEO доступным и <span className="text-primary">эффективным</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Мы создали инструмент, который помогает владельцам сайтов и маркетологам 
            улучшить видимость их ресурсов в поисковых системах, используя передовые 
            технологии анализа и понятные рекомендации.
          </p>
          <Button size="lg" variant="outline" className="gap-2" asChild>
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
            className="rounded-3xl shadow-2xl transform -rotate-3 transition-transform hover:rotate-0 duration-500"
          />
        </div>
      </div>
    </motion.section>
  );
};

export default MissionSection;
