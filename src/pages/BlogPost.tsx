
import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User, Tag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from 'react-router-dom';

const BlogPost: React.FC = () => {
  const { id } = useParams();
  
  const blogPosts = [
    {
      id: 1,
      title: 'Глубокий SEO-аудит: Как провести полный анализ сайта',
      content: `
        <h2>Введение в SEO-аудит</h2>
        <p>SEO-аудит является фундаментальным этапом в оптимизации любого веб-сайта. Это комплексный анализ, который помогает выявить все факторы, влияющие на позиции сайта в поисковых системах.</p>
        
        <h2>Основные этапы SEO-аудита</h2>
        <h3>1. Технический анализ</h3>
        <p>Включает проверку:</p>
        <ul>
          <li>Скорости загрузки страниц</li>
          <li>Структуры URL</li>
          <li>Robots.txt и Sitemap</li>
          <li>Мобильной версии сайта</li>
        </ul>
        
        <h3>2. Анализ контента</h3>
        <p>Оценка качества и релевантности контента включает:</p>
        <ul>
          <li>Проверку уникальности текстов</li>
          <li>Анализ мета-тегов</li>
          <li>Оценку структуры заголовков</li>
        </ul>
        
        <h3>3. Внешние факторы</h3>
        <p>Исследование:</p>
        <ul>
          <li>Внешних ссылок</li>
          <li>Социальных сигналов</li>
          <li>Репутации домена</li>
        </ul>`,
      date: '15 марта 2024',
      author: 'Алексей Петров',
      category: 'SEO аудит',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
      tags: ['SEO аудит', 'Технический анализ', 'Оптимизация']
    },
    {
      id: 2,
      title: 'Мониторинг позиций: Отслеживание эффективности SEO в реальном времени',
      content: `
        <h2>Важность мониторинга позиций</h2>
        <p>Постоянное отслеживание позиций сайта в поисковых системах является ключевым элементом успешной SEO-стратегии. Это позволяет оперативно реагировать на изменения и корректировать стратегию продвижения.</p>
        
        <h2>Ключевые аспекты мониторинга</h2>
        <h3>1. Отслеживание ключевых слов</h3>
        <ul>
          <li>Ежедневный мониторинг позиций</li>
          <li>Анализ динамики изменений</li>
          <li>Выявление трендов</li>
        </ul>
        
        <h3>2. Анализ конкурентов</h3>
        <p>Включает в себя:</p>
        <ul>
          <li>Сравнение позиций</li>
          <li>Анализ стратегий</li>
          <li>Выявление новых возможностей</li>
        </ul>`,
      date: '20 марта 2024',
      author: 'Мария Иванова',
      category: 'Мониторинг',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
      tags: ['Мониторинг позиций', 'SEO метрики', 'Аналитика']
    }
  ];

  const post = blogPosts.find(post => post.id === Number(id));
  
  if (!post) {
    return <div className="container mx-auto px-4 py-32">Статья не найдена</div>;
  }

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к блогу
            </Button>
          </Link>
          
          <Card className="overflow-hidden">
            <div className="relative h-[400px] w-full">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-primary/90 text-white text-sm px-3 py-1 rounded">
                {post.category}
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-x-4 gap-y-2 mb-4">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4" />
                  <span>{post.author}</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
              
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              <div className="flex flex-wrap gap-2 mt-8">
                {post.tags.map((tag, index) => (
                  <div key={index} className="text-sm bg-muted/50 px-3 py-1 rounded-full flex items-center">
                    <Tag className="mr-2 h-4 w-4 text-primary" />
                    <span>{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPost;
