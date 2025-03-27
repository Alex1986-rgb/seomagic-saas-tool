import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, BarChart2, CheckCircle, ArrowRight, Star, Pause, Play, Volume2 } from 'lucide-react';
import { Button } from '../ui/button';

interface AnimatedVideoPlaceholderProps {
  isPlaying: boolean;
}

const AnimatedVideoPlaceholder: React.FC<AnimatedVideoPlaceholderProps> = ({ isPlaying }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(!isPlaying);
  
  const slides = [
    {
      title: "SEO Аудит сайта",
      icon: <LineChart className="w-14 h-14 text-primary" />,
      content: "Анализ более 100 SEO-факторов",
      color: "#9b87f5"
    },
    {
      title: "Отслеживание позиций",
      icon: <BarChart2 className="w-14 h-14 text-[#0EA5E9]" />,
      content: "Мониторинг ключевых слов в поисковых системах",
      color: "#0EA5E9"
    },
    {
      title: "Оптимизация контента",
      icon: <Star className="w-14 h-14 text-[#F97316]" />,
      content: "ИИ-рекомендации для улучшения контента",
      color: "#F97316"
    },
    {
      title: "Рост трафика",
      icon: <ArrowRight className="w-14 h-14 text-[#22c55e]" />,
      content: "Увеличение органического трафика до 150%",
      color: "#22c55e"
    },
    {
      title: "Проверено экспертами",
      icon: <CheckCircle className="w-14 h-14 text-primary" />,
      content: "Надежное решение для SEO-оптимизации",
      color: "#9b87f5"
    }
  ];
  
  useEffect(() => {
    setIsPaused(!isPlaying);
  }, [isPlaying]);
  
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.5 } }
  };
  
  // Графическое представление для имитации графика
  const generateBarChart = () => {
    return (
      <div className="flex items-end justify-center h-28 gap-2 mt-6">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-gradient-to-t from-primary/40 to-primary w-6 rounded-t-md"
            initial={{ height: 20 }}
            animate={{ 
              height: Math.random() * 70 + 30,
              backgroundColor: i === currentSlide % 12 
                ? slides[currentSlide].color 
                : `${slides[currentSlide].color}80`
            }}
            transition={{ duration: 0.8, delay: i * 0.05 }}
          />
        ))}
      </div>
    );
  };
  
  // Генерация пузырьковой диаграммы для разнообразия визуализации
  const generateBubbleChart = () => {
    return (
      <div className="relative h-28 mt-6">
        {[...Array(12)].map((_, i) => {
          const size = Math.random() * 40 + 20;
          const posX = Math.random() * 80 + 10;
          const posY = Math.random() * 80;
          const delay = Math.random() * 0.5;
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                backgroundColor: i % 3 === 0 
                  ? slides[currentSlide].color 
                  : `${slides[currentSlide].color}80`,
                width: size,
                height: size,
                left: `${posX}%`,
                top: `${posY}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 0.8 - (size / 120)
              }}
              transition={{ duration: 0.7, delay }}
            />
          );
        })}
      </div>
    );
  };
  
  // Функция для отображения разных типов диаграмм в зависимости от слайда
  const renderVisualization = () => {
    switch (currentSlide % 3) {
      case 0: 
        return generateBarChart();
      case 1:
        return generateBubbleChart();
      default:
        return (
          <motion.div 
            className="h-28 mt-6 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border-2"
                  style={{ 
                    borderColor: slides[currentSlide].color,
                    width: 100 + i * 60, 
                    height: 100 + i * 60,
                    top: -(i * 30),
                    left: -(i * 30)
                  }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.6 - (i * 0.15) }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                />
              ))}
              <motion.div 
                className="h-16 w-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: slides[currentSlide].color }}
              >
                {slides[currentSlide].icon}
              </motion.div>
            </div>
          </motion.div>
        );
    }
  };
  
  return (
    <div className="aspect-video bg-gradient-to-br from-black/90 via-[#1a1a2e] to-black/95 rounded-xl overflow-hidden relative flex flex-col items-center justify-center text-center p-8 shadow-inner">
      {/* Имитация интерфейса видеоплеера */}
      <div className="absolute top-0 left-0 w-full h-10 bg-black/50 flex items-center px-4 z-20">
        <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <div className="text-xs text-white/70 ml-4 font-medium">SeoMarket - Демонстрация платформы</div>
      </div>
      
      {/* Фоновые элементы дизайна */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-[#0EA5E9]/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 rounded-full bg-[#F97316]/20 blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      
      {/* Анимированный контент имитирующий демо-видео */}
      <div className="flex-grow flex flex-col items-center justify-center w-full relative z-10 p-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideVariants}
            className="absolute inset-0 flex flex-col items-center justify-center p-8"
          >
            <div className="mb-4 transform hover:scale-110 transition-transform duration-300">
              {slides[currentSlide].icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{slides[currentSlide].title}</h3>
            <p className="text-white/80 mb-6 max-w-md">{slides[currentSlide].content}</p>
            
            {renderVisualization()}
            
            <div className="flex items-center justify-center gap-2 mt-8">
              <div 
                className="px-3 py-1 rounded-full text-xs text-white border border-white/20"
                style={{ backgroundColor: `${slides[currentSlide].color}40` }}
              >
                Функция {currentSlide + 1}/{slides.length}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Индикаторы слайдов */}
      <div className="flex justify-center gap-3 absolute bottom-12 left-0 right-0 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-primary scale-110' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
            style={{
              backgroundColor: currentSlide === index ? slides[currentSlide].color : ''
            }}
          />
        ))}
      </div>
      
      {/* Контроли плеера */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between z-20">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={togglePause}
        >
          {isPaused ? (
            <Play className="h-5 w-5" />
          ) : (
            <Pause className="h-5 w-5" />
          )}
        </Button>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <Volume2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Прогресс-бар */}
      <motion.div 
        className="absolute bottom-14 left-0 w-full h-2 bg-gray-800/60 overflow-hidden rounded-full px-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div 
          className="h-full rounded-full"
          style={{ 
            background: `linear-gradient(90deg, ${slides[currentSlide].color} 0%, ${slides[(currentSlide + 1) % slides.length].color} 100%)` 
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </div>
  );
};

export default AnimatedVideoPlaceholder;
