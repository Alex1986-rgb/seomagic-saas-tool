
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CTASection: React.FC = () => (
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
);

export default CTASection;
