
import React from 'react';
import { motion } from 'framer-motion';

const Blog = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-12 md:pb-20">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-4xl font-bold mb-2 md:mb-4"
        >
          Блог SeoMarket
        </motion.h1>
        <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
          Актуальные статьи, руководства и новости SEO-оптимизации
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="neo-card p-4 md:p-6 flex flex-col h-full">
              <div className="aspect-video bg-secondary/30 rounded-md mb-3 md:mb-4"></div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Заголовок статьи о SEO #{item}</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 flex-grow">
                Краткое описание статьи о том, как улучшить SEO вашего сайта и повысить позиции в поисковых системах.
              </p>
              <div className="flex items-center justify-between mt-auto pt-3 md:pt-4 border-t border-border">
                <span className="text-xs md:text-sm text-muted-foreground">15 мая 2023</span>
                <a href="#" className="text-primary hover:underline text-sm md:text-base">Читать</a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <button className="px-4 md:px-6 py-2 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors text-sm md:text-base">
            Загрузить еще
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
