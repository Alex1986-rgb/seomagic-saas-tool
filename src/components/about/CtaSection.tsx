
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CtaSection = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="relative text-center rounded-3xl overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 py-20 px-8 mb-20"
    >
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold mb-6">Готовы улучшить SEO вашего сайта?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Получите бесплатный базовый аудит и узнайте, как увеличить видимость вашего сайта
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90 transition-all duration-300">
            <Link to="/audit" className="gap-2">
              Провести SEO-аудит <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="border-primary/20 hover:border-primary/40 transition-all duration-300">
            <Link to="/pricing">Посмотреть тарифы</Link>
          </Button>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default CtaSection;
