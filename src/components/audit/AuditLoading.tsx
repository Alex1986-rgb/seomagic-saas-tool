
import React from 'react';
import { Loader2, Search, FileSearch, BarChart4 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from "@/components/ui/progress";

interface AuditLoadingProps {
  progress?: number;
}

const AuditLoading: React.FC<AuditLoadingProps> = ({ progress = 0 }) => {
  const stages = [
    { icon: Search, text: "Сканирование страницы", active: progress > 0 },
    { icon: FileSearch, text: "Анализ метаданных", active: progress > 30 },
    { icon: BarChart4, text: "Создание отчета", active: progress > 70 }
  ];

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <h3 className="text-xl font-medium mb-4">Анализируем сайт</h3>
      
      <div className="w-full max-w-md mb-8">
        <Progress value={progress} className="h-2" />
        <p className="text-right text-sm text-muted-foreground mt-1">{Math.round(progress)}%</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
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
