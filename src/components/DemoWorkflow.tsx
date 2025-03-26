
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, ArrowRight, BarChart2, LineChart, 
  FileText, Globe, Settings, Sparkles, CheckCircle, Activity 
} from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

const DemoWorkflow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Auto-advance steps
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setTimeout(() => {
      setCurrentStep((prev) => (prev < 4 ? prev + 1 : 0));
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [currentStep, isAutoPlaying]);

  const steps = [
    {
      title: "Анализ сайта",
      description: "Введите URL вашего сайта для комплексного SEO-аудита",
      icon: <Search className="w-10 h-10 text-primary" />,
      animation: "fade-in"
    },
    {
      title: "Выявление проблем",
      description: "Получите подробный отчет о всех SEO-проблемах сайта",
      icon: <BarChart2 className="w-10 h-10 text-primary" />,
      animation: "slide-up"
    },
    {
      title: "Рекомендации по оптимизации",
      description: "Пошаговые инструкции для улучшения вашего сайта",
      icon: <FileText className="w-10 h-10 text-primary" />,
      animation: "scale-in"
    },
    {
      title: "Внедрение изменений",
      description: "Автоматическое внедрение исправлений SEO-проблем",
      icon: <Settings className="w-10 h-10 text-primary" />,
      animation: "float"
    },
    {
      title: "Оптимизированный сайт",
      description: "Наслаждайтесь увеличенным трафиком и высокими позициями",
      icon: <Globe className="w-10 h-10 text-primary" />,
      animation: "pulse-slow"
    }
  ];

  return (
    <section className="py-20 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background via-background/80 to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background via-background/80 to-transparent z-10"></div>
      
      <div className="container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4">
            <Activity className="w-4 h-4 mr-2" />
            Процесс работы
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">От аудита до оптимизированного сайта</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Посмотрите, как SeoMarket анализирует и оптимизирует ваш сайт всего за несколько шагов
          </p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <Button 
            variant={isAutoPlaying ? "default" : "outline"}
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="rounded-full"
          >
            {isAutoPlaying ? "Остановить демо" : "Запустить демо"}
          </Button>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Process steps */}
          <div className="flex justify-between items-center mb-10 relative">
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-secondary -z-10"></div>
            
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                className={`relative flex flex-col items-center cursor-pointer z-20 ${currentStep === index ? 'scale-110' : ''}`}
                onClick={() => setCurrentStep(index)}
                whileHover={{ scale: 1.1 }}
                animate={{ scale: currentStep === index ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center 
                  ${currentStep === index 
                    ? 'bg-primary text-white' 
                    : currentStep > index 
                      ? 'bg-primary/50 text-white' 
                      : 'bg-secondary text-foreground'
                  }`}>
                  {currentStep > index ? (
                    <CheckCircle className="w-7 h-7" />
                  ) : (
                    <span className="font-bold text-xl">{index + 1}</span>
                  )}
                </div>
                <p className={`text-sm mt-2 font-medium max-w-[100px] text-center ${
                  currentStep === index ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </p>
              </motion.div>
            ))}
          </div>
          
          {/* Current step content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="p-10 neo-glass rounded-xl border border-primary/20 shadow-xl min-h-[320px] flex flex-col items-center justify-center"
          >
            <motion.div
              className={`mb-6 ${steps[currentStep].animation}`}
              animate={{ 
                y: steps[currentStep].animation === 'float' ? [0, -8, 0] : 0,
                scale: steps[currentStep].animation === 'pulse-slow' ? [1, 1.05, 1] : 1
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              {steps[currentStep].icon}
            </motion.div>
            
            <h3 className="text-2xl font-bold mb-3">{steps[currentStep].title}</h3>
            <p className="text-lg text-muted-foreground max-w-lg mb-8">{steps[currentStep].description}</p>
            
            <div className="flex gap-4">
              {currentStep === 0 && (
                <Button asChild className="gap-2">
                  <Link to="/audit">
                    Начать аудит <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              )}
              
              {currentStep < steps.length - 1 && (
                <Button variant={currentStep === 0 ? "outline" : "default"} onClick={() => setCurrentStep(curr => curr + 1)} className="gap-2">
                  Следующий шаг <ArrowRight className="w-4 h-4" />
                </Button>
              )}
              
              {currentStep === steps.length - 1 && (
                <Button className="gap-2">
                  <Sparkles className="w-4 h-4" /> Оптимизировать мой сайт
                </Button>
              )}
            </div>
          </motion.div>
          
          {/* Step indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentStep === index ? 'bg-primary w-6' : 'bg-primary/30'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoWorkflow;
