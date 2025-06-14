
import React from 'react';
import SafeContent from '@/components/shared/SafeContent';

interface BlogPostContentProps {
  content: string;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ content }) => {
  return (
    <div className="prose prose-lg max-w-none">
      <SafeContent 
        content={content}
        className="blog-content"
        allowedTags={[
          'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
          'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'img'
        ]}
        allowedAttributes={['class', 'id', 'href', 'src', 'alt', 'title']}
      />
    </div>
  );
};

export default BlogPostContent;
