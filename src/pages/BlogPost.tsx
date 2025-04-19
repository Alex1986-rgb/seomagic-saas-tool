
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, Tag, User } from 'lucide-react';
import { LazyImage } from '@/components/LazyImage';
import { mockBlogPosts } from '@/data/mockData';
import Layout from '@/components/Layout';

// Data type for our blog posts
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
  tags: string[];
}

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  // Используем useMemo для кэширования фильтрации постов
  const postData = useMemo(() => {
    if (!id) return { post: null, related: [] };

    // Находим текущий пост
    const foundPost = mockBlogPosts.find(p => p.id.toString() === id) as any;
    
    if (!foundPost) return { post: null, related: [] };

    // Проверяем, что у поста есть все необходимые поля
    if (!('date' in foundPost && 
        'author' in foundPost && 
        'category' in foundPost && 
        'image' in foundPost && 
        'tags' in foundPost)) {
      return { post: null, related: [] };
    }

    const validPost = foundPost as BlogPost;
    
    // Находим похожие посты (с общими тегами)
    const related = mockBlogPosts
      .filter(p => 
        p.id.toString() !== id && 
        'tags' in p && 
        p.tags && 
        p.tags.some(tag => validPost.tags.includes(tag))
      )
      .filter(p => 
        'date' in p && 
        'author' in p && 
        'category' in p && 
        'image' in p && 
        'tags' in p
      )
      .slice(0, 3) as BlogPost[];
    
    return { post: validPost, related };
  }, [id]);

  useEffect(() => {
    if (postData.post) {
      setPost(postData.post);
      setRelatedPosts(postData.related);
    }
    setLoading(false);
  }, [postData]);

  // Ускоряем загрузку, добавляя transition состояние
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="h-[400px] bg-gray-200 animate-pulse rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6">Статья не найдена</h1>
            <p className="mb-8">Запрашиваемая статья не существует или была удалена.</p>
            <Button asChild>
              <Link to="/blog">Вернуться к блогу</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center text-primary hover:underline mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Вернуться к списку статей
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
              <LazyImage 
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <div className="inline-block bg-primary text-white text-sm px-3 py-1 rounded mb-4">
                  {post.category}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
                <div className="flex flex-wrap items-center text-sm gap-x-4 gap-y-2">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="mr-1 h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-xl text-muted-foreground mb-8">{post.excerpt}</p>
              
              <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
              
              <div className="flex flex-wrap gap-2 mt-8 mb-4">
                <h3 className="text-lg font-medium mr-2">Теги:</h3>
                {post.tags.map((tag, index) => (
                  <div key={index} className="bg-muted/50 px-3 py-1 rounded-full flex items-center">
                    <Tag className="mr-1 h-4 w-4 text-primary" />
                    <span>{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">Похожие статьи</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <LazyImage 
                        src={relatedPost.image} 
                        alt={relatedPost.title} 
                        className="w-full h-full object-cover transform transition-transform hover:scale-105 duration-300"
                      />
                      <div className="absolute top-3 left-3 bg-primary/90 text-white text-xs px-2 py-1 rounded">
                        {relatedPost.category}
                      </div>
                    </div>
                    
                    <CardContent className="flex-grow flex flex-col p-5">
                      <h3 className="text-lg font-medium mb-2 line-clamp-2 hover:text-primary transition-colors">
                        <Link to={`/blog/${relatedPost.id}`}>{relatedPost.title}</Link>
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                      <div className="mt-auto">
                        <Link to={`/blog/${relatedPost.id}`} className="text-primary hover:underline text-sm font-medium">
                          Читать статью
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost;
