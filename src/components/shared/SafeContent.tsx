
import React from 'react';
import DOMPurify from 'dompurify';

interface SafeContentProps {
  content: string;
  className?: string;
  allowedTags?: string[];
  allowedAttributes?: string[];
}

const SafeContent: React.FC<SafeContentProps> = ({ 
  content, 
  className = "",
  allowedTags = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'],
  allowedAttributes = ['class', 'id']
}) => {
  // Configure DOMPurify with strict settings
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttributes,
    KEEP_CONTENT: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM_IMPORT: false,
    SANITIZE_DOM: true
  });

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default SafeContent;
