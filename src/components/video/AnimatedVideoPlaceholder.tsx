
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, BarChart2, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { Button } from '../ui/button';

const AnimatedVideoPlaceholder: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const slides = [
    {
      title: "SEO Аудит сайта",
      icon: <LineChart className="w-12 h-12 text-primary" />,
      content: "Анализ более 100 SEO-факторов"
    },
    {
      title: "Отслеживание позиций",
      icon: <BarChart2 className="w-12 h-12 text-primary" />,
      content: "Мониторинг ключевых слов в поисковых системах"
    },
    {
      title: "Оптимизация контента",
      icon: <Star className="w-12 h-12 text-primary" />,
      content: "ИИ-рекомендации для улучшения контента"
    },
    {
      title: "Рост трафика",
      icon: <ArrowRight className="w-12 h-12 text-primary" />,
      content: "Увеличение органического трафика до 150%"
    },
    {
      title: "Проверено экспертами",
      icon: <CheckCircle className="w-12 h-12 text-primary" />,
      content: "Надежное решение для SEO-оптимизации"
    }
  ];
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!isPaused) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 3000);
    }
    
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);
  
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  // Плавность перехода между слайдами
  const slideVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.5 } }
  };
  
  // Графическое представление для имитации графика
  const generateBarChart = () => {
    return (
      <div className="flex items-end justify-center h-24 gap-2 mt-4">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-gradient-to-t from-primary/40 to-primary w-6 rounded-t-md"
            initial={{ height: 20 }}
            animate={{ 
              height: Math.random() * 70 + 30,
              backgroundColor: i === currentSlide % 12 ? 'rgba(var(--primary), 0.9)' : 'rgba(var(--primary), 0.4)'
            }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="aspect-video bg-black/90 rounded-xl overflow-hidden relative flex flex-col items-center justify-center text-center p-8 border border-primary/30">
      {/* Имитация интерфейса видеоплеера */}
      <div className="absolute top-0 left-0 w-full h-8 bg-black/50 flex items-center px-4">
        <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <div className="text-xs text-white/70 ml-4">SeoMarket - Демо</div>
      </div>
      
      {/* Анимированный контент имитирующий демо-видео */}
      <div className="flex-grow flex flex-col items-center justify-center w-full">
        <motion.div
          key={currentSlide}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={slideVariants}
          className="absolute inset-0 flex flex-col items-center justify-center p-8"
        >
          <div className="mb-4">{slides[currentSlide].icon}</div>
          <h3 className="text-2xl font-bold text-white mb-2">{slides[currentSlide].title}</h3>
          <p className="text-white/80 mb-6">{slides[currentSlide].content}</p>
          
          {generateBarChart()}
          
          <div className="flex items-center justify-center gap-2 mt-8">
            <div className="bg-primary/20 px-3 py-1 rounded-full text-xs text-white">Функция {currentSlide + 1}/{slides.length}</div>
          </div>
        </motion.div>
      </div>
      
      {/* Индикаторы слайдов */}
      <div className="flex justify-center gap-2 absolute bottom-12 left-0 right-0">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full ${
              currentSlide === index ? 'bg-primary' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
      
      {/* Контроли плеера */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={togglePause}
        >
          {isPaused ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          )}
        </Button>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          </Button>
        </div>
      </div>
      
      {/* Прогресс-бар */}
      <div className="absolute bottom-14 left-0 w-full h-1.5 bg-gray-800/60">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary/80 to-primary"
          initial={{ width: "0%" }}
          animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

export default AnimatedVideoPlaceholder;
