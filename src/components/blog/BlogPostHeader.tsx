
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Clock, User } from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface BlogPostHeaderProps {
  post: BlogPost;
}

export const BlogPostHeader: React.FC<BlogPostHeaderProps> = ({ post }) => {
  return (
    <>
      <Link to="/blog" className="inline-flex items-center text-primary hover:underline mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Вернуться к списку статей
      </Link>
      
      <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
        <OptimizedImage 
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
          priority={true}
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
    </>
  );
};
