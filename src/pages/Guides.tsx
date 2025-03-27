
import React from 'react';
import { motion } from 'framer-motion';
import { Book, FileText, Video, Download } from 'lucide-react';
import Layout from '@/components/Layout';

const guides = [
  {
    title: 'Руководство по основам SEO',
    description: 'Базовое руководство для начинающих о принципах SEO оптимизации',
    icon: Book,
    type: 'Документ',
    length: '25 минут чтения'
  },
  {
    title: 'Как анализировать позиции сайта',
    description: 'Подробная инструкция по отслеживанию и анализу позиций в поисковиках',
    icon: FileText,
    type: 'Статья',
    length: '15 минут чтения'
  },
  {
    title: 'Видеоурок: Аудит вашего сайта',
    description: 'Пошаговое видео с демонстрацией процесса аудита сайта',
    icon: Video,
    type: 'Видео',
    length: '35 минут просмотра'
  },
  {
    title: 'Чек-лист технической оптимизации',
    description: 'Полный список проверок для технической оптимизации вашего сайта',
    icon: Download,
    type: 'Чек-лист',
    length: 'PDF, 8 страниц'
  },
  {
    title: 'Оптимизация контента для SEO',
    description: 'Руководство по созданию оптимизированного контента для вашего сайта',
    icon: Book,
    type: 'Документ',
    length: '30 минут чтения'
  },
  {
    title: 'Как работать с инструментами аналитики',
    description: 'Обзор инструментов аналитики и их использования для улучшения SEO',
    icon: FileText,
    type: 'Статья',
    length: '20 минут чтения'
  }
];

const Guides = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Руководства по SEO
        </motion.h1>
        <p className="text-lg text-muted-foreground mb-12">
          Полезные материалы и инструкции для эффективной оптимизации вашего сайта
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="neo-card p-6 flex flex-col h-full"
            >
              <div className="mb-4 text-primary">
                <guide.icon size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{guide.title}</h3>
              <p className="text-muted-foreground mb-4 flex-grow">
                {guide.description}
              </p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{guide.type}</span>
                  <span>•</span>
                  <span>{guide.length}</span>
                </div>
                <a href="#" className="text-primary hover:underline">Открыть</a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Guides;
