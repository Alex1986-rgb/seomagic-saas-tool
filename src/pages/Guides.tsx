import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, ChevronRight, Clock, Filter, FileText, Search } from 'lucide-react';
import { LazyImage } from '@/components/LazyImage';

const guides = [
  {
    id: 1,
    title: 'Полное руководство по аудиту сайта',
    description: 'Узнайте как проводить полный технический аудит вашего сайта от начала до конца.',
    category: 'SEO аудит',
    level: 'Начинающий',
    duration: '30 минут',
    image: '/images/placeholder.jpg',
    content: [
      {
        title: 'Подготовка к аудиту',
        content: 'Перед началом аудита необходимо собрать все необходимые данные о сайте...',
        image: '/images/placeholder.jpg'
      },
      {
        title: 'Технический анализ',
        content: 'Проверка robots.txt, XML sitemap, и структуры URL...',
        image: '/images/placeholder.jpg'
      }
    ]
  },
  {
    id: 2,
    title: 'Как отслеживать позиции сайта в поисковых системах',
    description: 'Пошаговое руководство по настройке и использованию инструментов для мониторинга позиций.',
    category: 'Позиции сайта',
    level: 'Средний',
    duration: '45 минут',
    image: '/images/placeholder.jpg',
    content: [
      {
        title: 'Выбор инструментов',
        content: 'Обзор популярных инструментов для отслеживания позиций...',
        image: '/images/placeholder.jpg'
      },
      {
        title: 'Настройка отслеживания',
        content: 'Пошаговая инструкция по настройке отслеживания ключевых слов...',
        image: '/images/placeholder.jpg'
      }
    ]
  },
  {
    id: 3,
    title: 'Оптимизация мета-тегов для улучшения CTR',
    description: 'Как создать привлекательные и эффективные title и description для ваших страниц.',
    category: 'Оптимизация',
    level: 'Начинающий',
    duration: '20 минут',
    image: '/images/placeholder.jpg'
  },
  {
    id: 4,
    title: 'Углубленный анализ конкурентов',
    description: 'Методики и инструменты для анализа стратегий ваших конкурентов в поисковой выдаче.',
    category: 'Конкуренты',
    level: 'Продвинутый',
    duration: '60 минут',
    image: '/images/placeholder.jpg'
  },
  {
    id: 5,
    title: 'Работа с отчетами и экспорт данных',
    description: 'Как интерпретировать и эффективно использовать отчеты по SEO аудиту и позициям.',
    category: 'Отчеты',
    level: 'Средний',
    duration: '35 минут',
    image: '/images/placeholder.jpg'
  },
  {
    id: 6,
    title: 'Настройка персонализированных уведомлений',
    description: 'Получайте важные уведомления о изменениях позиций и проблемах на сайте.',
    category: 'Уведомления',
    level: 'Начинающий',
    duration: '15 минут',
    image: '/images/placeholder.jpg'
  }
];

const Guides: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-32">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Руководства и инструкции</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Подробные руководства для эффективного использования всех возможностей платформы
          </p>
        </motion.div>
        
        <div className="mb-10 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="w-full md:w-auto order-2 md:order-1">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="flex flex-wrap">
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="beginner">Для начинающих</TabsTrigger>
                <TabsTrigger value="intermediate">Средний уровень</TabsTrigger>
                <TabsTrigger value="advanced">Продвинутый</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="w-full md:w-1/3 order-1 md:order-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Поиск руководств..." className="pl-10" />
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="gap-2 order-3">
            <Filter className="h-4 w-4" />
            <span>Фильтры</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide, index) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <LazyImage 
                    src={guide.image} 
                    alt={guide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <div className="flex items-center text-white text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{guide.duration}</span>
                      <div className="bg-primary/80 ml-3 px-2 py-0.5 rounded text-xs">
                        {guide.level}
                      </div>
                    </div>
                  </div>
                </div>
                
                <CardHeader>
                  <div className="text-sm text-primary mb-2">{guide.category}</div>
                  <CardTitle className="text-xl line-clamp-2">{guide.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3">{guide.description}</p>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                    <Link to={`/guides/${guide.id}`} className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-primary" />
                      <span>Читать руководство</span>
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Button variant="outline" size="lg">
            Загрузить больше руководств
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Guides;
