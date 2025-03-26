
import React, { useState, useEffect } from 'react';
import { Loader2, Search, FileSearch, BarChart4, Files } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from "@/components/ui/progress";

interface AuditLoadingProps {
  progress?: number;
}

const AuditLoading: React.FC<AuditLoadingProps> = ({ progress = 0 }) => {
  const [pageCount, setPageCount] = useState(0);
  const stages = [
    { icon: Search, text: "Сканирование сайта", active: progress > 0 },
    { icon: Files, text: "Анализ страниц", active: progress > 25 },
    { icon: FileSearch, text: "Анализ метаданных", active: progress > 50 },
    { icon: BarChart4, text: "Создание отчета", active: progress > 75 }
  ];

  useEffect(() => {
    if (progress > 20 && progress < 80) {
      const interval = setInterval(() => {
        setPageCount(prev => {
          const increase = Math.floor(Math.random() * 3) + 1;
          return prev + increase;
        });
      }, 1500);
      
      return () => clearInterval(interval);
    }
  }, [progress]);

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <h3 className="text-xl font-medium mb-4">Анализируем сайт</h3>
      
      <div className="w-full max-w-md mb-8">
        <Progress value={progress} className="h-2" />
        <p className="text-right text-sm text-muted-foreground mt-1">{Math.round(progress)}%</p>
      </div>
      
      {pageCount > 0 && (
        <motion.div 
          className="w-full max-w-md mb-6 p-4 border border-primary/20 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center">
            <Files className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm">
              Обнаружено страниц: <span className="font-medium">{pageCount}</span>
              <motion.span 
                className="inline-block ml-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >...</motion.span>
            </span>
          </div>
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          return (
            <motion.div 
              key={index}
              className={`flex flex-col items-center p-4 rounded-lg ${stage.active ? 'neo-card' : 'opacity-50'}`}
              animate={stage.active ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <Icon className={`h-8 w-8 mb-2 ${stage.active ? 'text-primary' : 'text-muted-foreground'} ${stage.active ? 'animate-pulse' : ''}`} />
              <p className="text-center text-sm">{stage.text}</p>
            </motion.div>
          );
        })}
      </div>
      
      <motion.p 
        className="text-muted-foreground mt-8 text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Пожалуйста, подождите. Мы проводим детальный анализ вашего сайта для предоставления точных рекомендаций.
      </motion.p>
    </div>
  );
};

export default AuditLoading;
