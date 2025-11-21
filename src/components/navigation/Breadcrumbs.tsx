import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}
    >
      <Link 
        to="/" 
        className="flex items-center gap-1 hover:text-foreground transition-colors"
        aria-label="Главная"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <React.Fragment key={item.url}>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            {isLast ? (
              <span 
                className="text-foreground font-medium truncate"
                aria-current="page"
              >
                {item.name}
              </span>
            ) : (
              <Link 
                to={item.url}
                className="hover:text-foreground transition-colors truncate"
              >
                {item.name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
