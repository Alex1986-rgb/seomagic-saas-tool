
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { LazyImage } from '@/components/LazyImage';
import { Book } from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface RelatedPostsProps {
  posts: BlogPost[];
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts }) => {
  if (posts.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8">Похожие статьи</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
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
              <div className="mt-auto">
                <Link to={`/blog/${post.id}`} className="text-primary hover:underline text-sm font-medium flex items-center">
                  <Book className="mr-2 h-4 w-4" />
                  Читать статью
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
