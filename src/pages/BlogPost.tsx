import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { mockBlogPosts } from '@/data/mockData';
import Layout from '@/components/Layout';
import { BlogPostHeader } from '@/components/blog/BlogPostHeader';
import BlogPostContent from '@/components/blog/BlogPostContent';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { BlogPost as BlogPostType } from '@/types/blog';
import { SEO } from '@/components/SEO';
import { ArticleSEO } from '@/components/seo/ArticleSEO';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);

  const postData = useMemo(() => {
    if (!id) return { post: null, related: [] };

    const foundPost = mockBlogPosts.find(p => p.id.toString() === id) as any;
    
    if (!foundPost) return { post: null, related: [] };

    if (!('date' in foundPost && 
        'author' in foundPost && 
        'category' in foundPost && 
        'image' in foundPost && 
        'tags' in foundPost)) {
      return { post: null, related: [] };
    }

    const validPost = foundPost as BlogPostType;
    
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
      .slice(0, 3) as BlogPostType[];
    
    return { post: validPost, related };
  }, [id]);

  useEffect(() => {
    if (postData.post) {
      setPost(postData.post);
      setRelatedPosts(postData.related);
    }
    setLoading(false);
  }, [postData]);

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
      <SEO
        title={`${post.title} | Блог SeoMarket`}
        description={post.excerpt}
        canonicalUrl={`/blog/${post.id}`}
        ogImage={post.image}
        keywords={post.tags.join(', ')}
      />
      <ArticleSEO post={post} />
      <BreadcrumbSchema items={[
        { name: 'Главная', url: '/' },
        { name: 'Блог', url: '/blog' },
        { name: post.title, url: `/blog/${post.id}` }
      ]} />
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BlogPostHeader post={post} />
            <BlogPostContent content={post.content} />
            <RelatedPosts posts={relatedPosts} />
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost;
