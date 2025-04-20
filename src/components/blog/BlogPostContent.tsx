
import React from 'react';
import { Tag } from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface BlogPostContentProps {
  post: BlogPost;
}

export const BlogPostContent: React.FC<BlogPostContentProps> = ({ post }) => {
  return (
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
  );
};
