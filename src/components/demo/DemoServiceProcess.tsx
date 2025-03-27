
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, BarChart2, FileText, Settings, 
  Globe, ArrowRight, CheckCircle 
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const DemoServiceProcess: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    {
      title: "Анализ вашего сайта",
      description: "Введите URL вашего сайта, и наша система автоматически проанализирует более 100 SEO-факторов",
      icon: <Search className="w-10 h-10 text-primary" />,
      image: "/img/demo-step1.jpg"
    },
    {
      title: "Выявление проблем",
      description: "Система проанализирует сайт и составит подробный отчет с выявленными проблемами и рекомендациями",
      icon: <BarChart2 className="w-10 h-10 text-primary" />,
      image: "/img/demo-step2.jpg"
    },
    {
      title: "Рекомендации",
      description: "Получите детальные рекомендации по улучшению каждого аспекта SEO вашего сайта",
      icon: <FileText className="w-10 h-10 text-primary" />,
      image: "/img/demo-step3.jpg"
    },
    {
      title: "Автоматическая оптимизация",
      description: "Наша система автоматически исправит большинство выявленных проблем с минимальным участием с вашей стороны",
      icon: <Settings className="w-10 h-10 text-primary" />,
      image: "/img/demo-step4.jpg"
    },
    {
      title: "Рост позиций",
      description: "Наблюдайте рост позиций вашего сайта в поисковых системах и увеличение органического трафика",
      icon: <Globe className="w-10 h-10 text-primary" />,
      image: "/img/demo-step5.jpg"
    }
  ];
  
  // Функция для автоматического переключения шагов
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Как работает SeoMarket</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Пять простых шагов для преобразования вашего сайта и повышения его позиций в поиске
        </p>
      </div>
      
      {/* Шаги процесса */}
      <div className="flex justify-between items-center mb-10 relative">
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-primary/20 -z-10"></div>
        
        {steps.map((step, index) => (
          <motion.div 
            key={index}
            className={`relative flex flex-col items-center cursor-pointer z-20 ${activeStep === index ? 'scale-110' : ''}`}
            onClick={() => setActiveStep(index)}
            whileHover={{ scale: 1.1 }}
            animate={{ scale: activeStep === index ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md
              ${activeStep === index 
                ? 'bg-primary text-white' 
                : activeStep > index 
                  ? 'bg-primary/50 text-white' 
                  : 'bg-secondary text-foreground'
              }`}
            >
              {activeStep > index ? (
                <CheckCircle className="w-7 h-7" />
              ) : (
                <span className="font-bold text-xl">{index + 1}</span>
              )}
            </div>
            <p className={`text-sm mt-2 font-medium max-w-[100px] text-center hidden md:block ${
              activeStep === index ? 'text-primary' : 'text-muted-foreground'
            }`}>
              {step.title}
            </p>
          </motion.div>
        ))}
      </div>
      
      {/* Детали активного шага */}
      <motion.div
        key={activeStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
      >
        <Card className="p-8 shadow-lg overflow-hidden">
          <div className="mb-6">{steps[activeStep].icon}</div>
          <h3 className="text-2xl font-bold mb-3">{steps[activeStep].title}</h3>
          <p className="text-muted-foreground mb-6">{steps[activeStep].description}</p>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setActiveStep(prev => prev > 0 ? prev - 1 : steps.length - 1)}
              className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
            <button 
              onClick={() => setActiveStep(prev => prev < steps.length - 1 ? prev + 1 : 0)}
              className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </Card>
        
        <div className="rounded-lg overflow-hidden shadow-lg aspect-video relative bg-gray-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground">Изображение шага {activeStep + 1}</p>
          </div>
          {/* Здесь будет изображение, когда оно будет доступно */}
          {/* <img 
            src={steps[activeStep].image} 
            alt={steps[activeStep].title} 
            className="w-full h-full object-cover"
          /> */}
        </div>
      </motion.div>
      
      {/* Индикаторы шагов */}
      <div className="flex justify-center mt-8 space-x-2">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveStep(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              activeStep === index ? 'bg-primary w-6' : 'bg-primary/30'
            }`}
            aria-label={`Перейти к шагу ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default DemoServiceProcess;
