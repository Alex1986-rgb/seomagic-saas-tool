
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Book } from 'lucide-react';
import { mockBlogPosts } from '@/data/mockData';
import { LazyImage } from '@/components/LazyImage';
import { SEO } from '@/components/SEO';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const Blog: React.FC = () => {
  return (
    <Layout>
      <SEO
        title="Блог о SEO оптимизации | SeoMarket"
        description="Экспертные статьи о SEO, продвижении сайтов, аналитике и оптимизации. Актуальные новости и практические советы по SEO."
        canonicalUrl="/blog"
        keywords="SEO блог, статьи про SEO, продвижение сайтов, SEO оптимизация, SEO гайды"
      />
      <BreadcrumbSchema items={[
        { name: 'Главная', url: '/' },
        { name: 'Блог', url: '/blog' }
      ]} />
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Блог</h1>
              <p className="text-lg text-muted-foreground">
                Последние новости, руководства и советы по SEO оптимизации
              </p>
            </div>
            
            <div className="w-full md:w-auto flex gap-2">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск статей..."
                  className="pl-8"
                />
              </div>
              <Button variant="outline">
                Категории
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockBlogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <LazyImage 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transform transition-transform hover:scale-105 duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-primary/90 text-white text-xs px-2 py-1 rounded">
                    {post.category}
                  </div>
                </div>
                
                <CardContent className="flex-grow flex flex-col p-5">
                  <h3 className="text-lg font-medium mb-2 line-clamp-2 hover:text-primary transition-colors">
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <Link to={`/blog/${post.id}`} className="text-primary hover:underline text-sm font-medium flex items-center">
                      <Book className="mr-2 h-4 w-4" />
                      Читать статью
                    </Link>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
