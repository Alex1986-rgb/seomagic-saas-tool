import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { mockBlogPosts } from '@/data/mockData';
import Layout from '@/components/Layout';
import { BlogPostHeader } from '@/components/blog/BlogPostHeader';
import BlogPostContent from '@/components/blog/BlogPostContent';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { BlogPost as BlogPostType } from '@/types/blog';
import PageSeo from '@/components/seo/PageSeo';
import { ArticleSEO } from '@/components/seo/ArticleSEO';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  /*
   * Статьи лежат в коде и находятся сразу, без обращения к серверу. Раньше
   * страница всё равно держала состояние «загрузка» и копировала статью в
   * useState из эффекта: первый кадр был заглушкой без заголовка и canonical
   * (их подставлял общий DefaultSEO), а при переходе со статьи на
   * несуществующий адрес оставалась показанной прежняя статья — эффект не
   * сбрасывал её. Теперь статья вычисляется прямо из адреса.
   */
  const { post, relatedPosts } = useMemo((): { post: BlogPostType | null; relatedPosts: BlogPostType[] } => {
    const foundPost = id ? mockBlogPosts.find(p => p.id.toString() === id) : undefined;
    if (!foundPost) return { post: null, relatedPosts: [] };

    const related = mockBlogPosts
      .filter(p =>
        p.id !== foundPost.id &&
        p.tags.some(tag => foundPost.tags.includes(tag))
      )
      .slice(0, 3);

    return { post: foundPost, relatedPosts: related };
  }, [id]);

  if (!post) {
    return (
      <Layout>
        {/* Адрес без статьи в поиск попадать не должен. */}
        <PageSeo
          title="Статья не найдена"
          description="Запрашиваемая статья не существует или была удалена."
          noindex
        />
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
      <PageSeo
        title={post.title}
        description={post.excerpt}
        image={post.image}
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
