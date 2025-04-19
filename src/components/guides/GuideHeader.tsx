
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, BookOpen, Clock } from 'lucide-react';

interface GuideHeaderProps {
  category: string;
  level: string;
  duration: string;
  title: string;
  description: string;
}

const GuideHeader: React.FC<GuideHeaderProps> = ({
  category,
  level,
  duration,
  title,
  description
}) => {
  return (
    <div className="mb-8">
      <Link to="/guides" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Назад к руководствам
      </Link>
      
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">{category}</span>
        <span className="flex items-center">
          <BookOpen className="h-4 w-4 mr-1" />
          {level}
        </span>
        <span className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {duration}
        </span>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-6">{title}</h1>
      <p className="text-lg text-muted-foreground mb-8">{description}</p>
    </div>
  );
};

export default GuideHeader;
