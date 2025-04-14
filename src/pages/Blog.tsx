
import React from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, ChevronRight, Clock, Tag, User } from 'lucide-react';

const Blog: React.FC = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Как улучшить SEO рейтинг вашего сайта за 30 дней',
      excerpt: 'Пошаговое руководство по оптимизации сайта и улучшению позиций в поисковой выдаче.',
      date: '15 марта 2023',
      author: 'Алексей Петров',
      category: 'SEO оптимизация',
      image: '/images/placeholder.jpg',
      tags: ['SEO', 'Оптимизация', 'Google']
    },
    {
      id: 2,
      title: 'Ключевые метрики SEO для электронной коммерции',
      excerpt: 'Анализ наиболее важных показателей для интернет-магазинов и торговых площадок.',
      date: '24 апреля 2023',
      author: 'Мария Иванова',
      category: 'Электронная коммерция',
      image: '/images/placeholder.jpg',
      tags: ['E-commerce', 'Метрики', 'Аналитика']
    },
    {
      id: 3,
      title: 'Мобильная оптимизация: почему это важно для SEO',
      excerpt: 'Влияние мобильной оптимизации на ранжирование сайтов и пользовательский опыт.',
      date: '10 мая 2023',
      author: 'Дмитрий Сидоров',
      category: 'Мобильная оптимизация',
      image: '/images/placeholder.jpg',
      tags: ['Мобильный SEO', 'Адаптивность', 'UX']
    },
    {
      id: 4,
      title: 'Локальный SEO: как привлечь клиентов из вашего региона',
      excerpt: 'Стратегии и тактики для продвижения бизнеса в локальной поисковой выдаче.',
      date: '2 июня 2023',
      author: 'Елена Смирнова',
      category: 'Локальный SEO',
      image: '/images/placeholder.jpg',
      tags: ['Локальный поиск', 'Google Maps', 'Региональное продвижение']
    }
  ];
  
  return (
    <MotionConfig>
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
              Последние новости, советы и руководства по SEO оптимизации и продвижению сайтов
            </p>
            
            <Tabs defaultValue="all" className="mt-10">
              <TabsList className="flex flex-wrap justify-center">
                <TabsTrigger value="all">Все статьи</TabsTrigger>
                <TabsTrigger value="seo">SEO оптимизация</TabsTrigger>
                <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
                <TabsTrigger value="mobile">Мобильный SEO</TabsTrigger>
                <TabsTrigger value="local">Локальный SEO</TabsTrigger>
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
    </MotionConfig>
  );
};

export default Blog;
