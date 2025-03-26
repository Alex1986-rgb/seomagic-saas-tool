
import React from 'react';
import { motion } from 'framer-motion';
import { Search, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';

const QuickActions: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="flex justify-center gap-4 mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          className="text-xs flex items-center gap-1"
          onClick={() => alert("Быстрое сканирование проверит только главную страницу и основные SEO-факторы")}
        >
          <Search className="h-3 w-3" />
          Быстрое сканирование
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          className="text-xs flex items-center gap-1"
          onClick={() => alert("Полное сканирование проанализирует все страницы сайта и даст подробный отчет")}
        >
          <FileSearch className="h-3 w-3" />
          Полное сканирование
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default QuickActions;
