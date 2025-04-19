import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  ChevronRight, 
  Clock, 
  Filter, 
  FileText, 
  Search, 
  ArrowLeft, 
  ArrowRight 
} from 'lucide-react';
import { LazyImage } from '@/components/LazyImage';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import Layout from '@/components/Layout';

export const guides = [
  {
    id: 1,
    title: 'Полное руководство по аудиту сайта',
    description: 'Узнайте как проводить полный технический аудит вашего сайта от начала до конца, используя все доступные инструменты для анализа.',
    category: 'SEO аудит',
    level: 'Начинающий',
    duration: '30 минут',
    image: '/images/audit-guide-cover.jpg',
    videoUrl: '/video/seo-demo.mp4',
    content: [
      {
        title: 'Подготовка к аудиту сайта',
        content: 'Перед началом технического аудита необходимо собрать все важные данные о сайте. Это включает в себя анализ текущей структуры сайта, его производительности и основных метрик. На этом этапе мы подготовим все необходимые инструменты и создадим план работы.',
        image: '/images/audit-preparation.jpg',
        videoUrl: '/video/seo-demo.mp4'
      },
      {
        title: 'Технический анализ структуры',
        content: 'Проведите глубокий технический анализ вашего сайта. Это включает проверку robots.txt, XML sitemap, анализ структуры URL и внутренней перелинковки. Особое внимание уделите скорости загрузки страниц и mobile-friendly оптимизации. В этом разделе мы рассмотрим каждый аспект технического SEO.',
        image: '/images/technical-analysis.jpg',
        videoUrl: '/video/seo-demo.mp4'
      },
      {
        title: 'Оптимизация контента',
        content: 'Проанализируйте качество контента на вашем сайте. Проверьте уникальность текстов, оптимизацию заголовков и мета-тегов. Используйте специальные инструменты для анализа семантического ядра и релевантности контента поисковым запросам. Важно обратить внимание на структуру текстов и их читабельность.',
        image: '/images/content-optimization.jpg',
        videoUrl: '/video/seo-demo.mp4'
      }
    ]
  },
  {
    id: 2,
    title: 'Как отслеживать позиции сайта в поисковых системах',
    description: 'Пошаговое руководство по настройке и использованию инструментов для мониторинга позиций вашего сайта в поисковой выдаче.',
    category: 'Позиции сайта',
    level: 'Средний',
    duration: '45 минут',
    image: '/images/position-tracking-cover.jpg',
    videoUrl: '/video/seo-demo.mp4',
    content: [
      {
        title: 'Настройка инструментов отслеживания',
        content: 'Начните с выбора правильных инструментов для мониторинга позиций. Мы рассмотрим популярные сервисы и их особенности. Научимся настраивать регулярные проверки и автоматические уведомления об изменении позиций. Это поможет вам оперативно реагировать на любые изменения в выдаче.',
        image: '/images/tracking-tools.jpg',
        videoUrl: '/video/seo-demo.mp4'
      },
      {
        title: 'Анализ конкурентов',
        content: 'Изучите, как отслеживать позиции конкурентов и анализировать их стратегии продвижения. Научитесь использовать эти данные для улучшения собственных позиций. Мы покажем, как создавать сравнительные отчеты и выявлять новые возможности для роста.',
        image: '/images/competitor-analysis.jpg',
        videoUrl: '/video/seo-demo.mp4'
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
    image: '/images/placeholder.jpg',
    content: [
      {
        title: 'Основы мета-тегов',
        content: 'Что такое мета-теги и почему они важны...',
        image: '/images/placeholder.jpg'
      },
      {
        title: 'Оптимизация заголовков',
        content: 'Как писать эффективные заголовки...',
        image: '/images/placeholder.jpg'
      }
    ]
  },
  {
    id: 4,
    title: 'Углубленный анализ конкурентов',
    description: 'Методики и инструменты для анализа стратегий ваших конкурентов в поисковой выдаче.',
    category: 'Конку��енты',
    level: 'Продвинутый',
    duration: '60 минут',
    image: '/images/placeholder.jpg',
    content: [
      {
        title: 'Выявление конкурентов',
        content: 'Как определить ваших основных конкурентов в поиске...',
        image: '/images/placeholder.jpg'
      },
      {
        title: 'Анализ стратегий',
        content: 'Подробный разбор стратегий конкурентов...',
        image: '/images/placeholder.jpg'
      }
    ]
  },
  {
    id: 5,
    title: 'Работа с отчетами и экспорт данных',
    description: 'Как интерпретировать и эффективно использовать отчеты по SEO аудиту и позициям.',
    category: 'Отчеты',
    level: 'Средний',
    duration: '35 минут',
    image: '/images/placeholder.jpg',
    content: [
      {
        title: 'Типы отчетов',
        content: 'Обзор различных типов отчетов и их использование...',
        image: '/images/placeholder.jpg'
      },
      {
        title: 'Экспорт и анализ',
        content: 'Как экспортировать и анализировать данные...',
        image: '/images/placeholder.jpg'
      }
    ]
  },
  {
    id: 6,
    title: 'Настройка персонализированных уведомлений',
    description: 'Получайте важные уведомления о изменениях позиций и проблемах на сайте.',
    category: 'Уведомления',
    level: 'Начинающий',
    duration: '15 минут',
    image: '/images/placeholder.jpg',
    content: [
      {
        title: 'Настройка уведомлений',
        content: 'Как настроить персонализированные уведомления...',
        image: '/images/placeholder.jpg'
      },
      {
        title: 'Типы оповещений',
        content: 'Обзор различных типов уведомлений и их важность...',
        image: '/images/placeholder.jpg'
      }
    ]
  }
];

const GuideImageSlider = ({ guide }) => {
  if (!guide.content || guide.content.length === 0) {
    return (
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <LazyImage 
          src={guide.image} 
          alt={guide.title}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        <CarouselItem>
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <LazyImage 
              src={guide.image} 
              alt={guide.title}
              className="w-full h-full object-cover"
            />
          </div>
        </CarouselItem>
        
        {guide.content.map((section, idx) => (
          <CarouselItem key={idx}>
            <div className="relative h-48 overflow-hidden rounded-t-lg">
              <LazyImage 
                src={section.image} 
                alt={section.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <h3 className="text-white font-medium">{section.title}</h3>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 bg-white/80" />
      <CarouselNext className="right-2 bg-white/80" />
    </Carousel>
  );
};

const Guides: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [filteredGuides, setFilteredGuides] = useState(guides);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let result = [...guides];
    
    if (activeTab !== 'all') {
      const levelMap = {
        'beginner': 'Начинающий',
        'intermediate': 'Средний',
        'advanced': 'Продвинутый'
      };
      
      result = result.filter(guide => guide.level === levelMap[activeTab]);
    }
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(guide => 
        guide.title.toLowerCase().includes(query) || 
        guide.description.toLowerCase().includes(query) || 
        guide.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredGuides(result);
  }, [activeTab, searchQuery]);

  return (
    <Layout>
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
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                <Input 
                  placeholder="Поиск руководств..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="gap-2 order-3">
              <Filter className="h-4 w-4" />
              <span>Фильтры</span>
            </Button>
          </div>
          
          {filteredGuides.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground opacity-40 mb-4" />
              <h3 className="text-xl font-medium mb-2">Руководства не найден��</h3>
              <p className="text-muted-foreground">Попробуйте изменить параметры поиска или фильтрации</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setActiveTab('all');
                  setSearchQuery('');
                }}
              >
                Сбросить фильтры
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuides.map((guide, index) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col overflow-hidden">
                    <GuideImageSlider guide={guide} />
                    
                    <div className="absolute top-3 right-3 bg-primary/90 text-white text-xs px-2 py-1 rounded-full z-10">
                      {guide.level}
                    </div>
                    
                    <CardHeader>
                      <div className="text-sm text-primary mb-2 flex items-center">
                        <span>{guide.category}</span>
                        <div className="ml-auto flex items-center text-muted-foreground text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{guide.duration}</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl line-clamp-2">{guide.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground line-clamp-3">{guide.description}</p>
                    </CardContent>
                    
                    <CardFooter className="pt-0">
                      <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                        <Link to={`/guides/${guide.id}`} className="flex items-center">
                          <BookOpen className="mr-2 h-4 w-4 text-primary" />
                          <span>Читать руководство</span>
                          <ChevronRight className="ml-auto h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          
          {filteredGuides.length > 0 && filteredGuides.length < guides.length && (
            <div className="mt-8 text-center">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  setActiveTab('all');
                  setSearchQuery('');
                }}
              >
                Показать все руководства
              </Button>
            </div>
          )}
          
          {activeTab === 'all' && searchQuery === '' && filteredGuides.length === guides.length && (
            <div className="mt-16 text-center">
              <Button variant="outline" size="lg">
                Загрузить больше руководств
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Guides;
