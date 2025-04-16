
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, ChevronRight, Clock, Tag, User } from 'lucide-react';

const Blog: React.FC = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Глубокий SEO-аудит: Как провести полный анализ сайта',
      excerpt: 'Подробное руководство по проведению комплексного SEO-аудита с использованием автоматического анализа более 100 факторов ранжирования.',
      date: '15 марта 2024',
      author: 'Алексей Петров',
      category: 'SEO аудит',
      image: '/images/placeholder.jpg',
      tags: ['SEO аудит', 'Технический анализ', 'Оптимизация']
    },
    {
      id: 2,
      title: 'Мониторинг позиций: Отслеживание эффективности SEO в реальном времени',
      excerpt: 'Как использовать систему мониторинга позиций для отслеживания ключевых запросов и улучшения видимости сайта в поисковых системах.',
      date: '20 марта 2024',
      author: 'Мария Иванова',
      category: 'Мониторинг',
      image: '/images/placeholder.jpg',
      tags: ['Мониторинг позиций', 'SEO метрики', 'Аналитика']
    },
    {
      id: 3,
      title: 'Автоматическая оптимизация сайта: Инновационные алгоритмы',
      excerpt: 'Как работают интеллектуальные алгоритмы автоматической оптимизации и почему они необходимы для современного SEO.',
      date: '25 марта 2024',
      author: 'Дмитрий Сидоров',
      category: 'Автоматизация',
      image: '/images/placeholder.jpg',
      tags: ['Автоматизация', 'Оптимизация', 'AI в SEO']
    },
    {
      id: 4,
      title: 'Ускорение загрузки сайта: Ключ к высоким позициям',
      excerpt: 'Практическое руководство по оптимизации скорости загрузки страниц и её влияние на поисковое ранжирование.',
      date: '30 марта 2024',
      author: 'Елена Смирнова',
      category: 'Оптимизация скорости',
      image: '/images/placeholder.jpg',
      tags: ['Скорость загрузки', 'Оптимизация', 'UX']
    },
    {
      id: 5,
      title: 'Технический SEO: Фундамент успешного продвижения',
      excerpt: 'Глубокое погружение в технические аспекты SEO: настройка robots.txt, создание карты сайта и семантическая разметка.',
      date: '2 апреля 2024',
      author: 'Игорь Васильев',
      category: 'Технический SEO',
      image: '/images/placeholder.jpg',
      tags: ['Технический SEO', 'Robots.txt', 'Sitemap']
    },
    {
      id: 6,
      title: 'Прогнозирование роста трафика: Аналитика и стратегии',
      excerpt: 'Как использовать инструменты аналитики для прогнозирования роста органического трафика и планирования SEO стратегии.',
      date: '5 апреля 2024',
      author: 'Анна Козлова',
      category: 'Аналитика',
      image: '/images/placeholder.jpg',
      tags: ['Прогнозирование', 'Аналитика', 'Стратегия']
    },
    {
      id: 7,
      title: 'Контент-анализ: Оценка качества и релевантности',
      excerpt: 'Методология оценки качества контента и его оптимизации для улучшения позиций в поисковой выдаче.',
      date: '8 апреля 2024',
      author: 'Наталья Морозова',
      category: 'Контент',
      image: '/images/placeholder.jpg',
      tags: ['Контент', 'SEO копирайтинг', 'Анализ']
    },
    {
      id: 8,
      title: 'Генерация отчетов: Визуализация SEO данных',
      excerpt: 'Как использовать автоматическую генерацию отчетов для эффективного анализа и презентации результатов SEO оптимизации.',
      date: '12 апреля 2024',
      author: 'Павел Соколов',
      category: 'Отчетность',
      image: '/images/placeholder.jpg',
      tags: ['Отчеты', 'Аналитика', 'PDF']
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-32">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Блог SeoMarket</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Полное руководство по SEO оптимизации: от технического аудита до автоматизации процессов
          </p>
          
          <Tabs defaultValue="all" className="mt-10">
            <TabsList className="flex flex-wrap justify-center">
              <TabsTrigger value="all">Все статьи</TabsTrigger>
              <TabsTrigger value="audit">SEO аудит</TabsTrigger>
              <TabsTrigger value="monitoring">Мониторинг</TabsTrigger>
              <TabsTrigger value="optimization">Оптимизация</TabsTrigger>
              <TabsTrigger value="technical">Технический SEO</TabsTrigger>
              <TabsTrigger value="analytics">Аналитика</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: post.id * 0.1 }}
            >
              <Card className="h-full flex flex-col neo-card">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-48 object-cover transform transition-transform hover:scale-105 duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-primary/90 text-white text-xs px-2 py-1 rounded">
                    {post.category}
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl line-clamp-2 mb-2 hover:text-primary transition-colors">
                    <a href={`/blog/${post.id}`}>{post.title}</a>
                  </CardTitle>
                  <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-x-4 gap-y-1">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="mr-1 h-3 w-3" />
                      <span>{post.author}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag, index) => (
                      <div key={index} className="text-xs bg-muted/50 px-2 py-1 rounded-full flex items-center">
                        <Tag className="mr-1 h-3 w-3 text-primary" />
                        <span>{tag}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                    <a href={`/blog/${post.id}`} className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4 text-primary" />
                      <span>Читать статью</span>
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Button variant="outline" size="lg">
            Загрузить больше статей
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
