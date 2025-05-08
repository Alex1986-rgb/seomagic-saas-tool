
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { ChevronRight } from 'lucide-react';

interface MainNavProps {
  className?: string;
}

const MainNav: React.FC<MainNavProps> = ({ className }) => {
  const routes = [
    { href: '/', label: 'Главная' },
    { href: '/audit', label: 'Аудит сайта' },
    { href: '/seo-audit', label: 'SEO аудит' },
    { href: '/dashboard', label: 'Панель управления' },
    { href: '/docs', label: 'Документация' },
  ];

  return (
    <nav className={cn('flex items-center space-x-2 lg:space-x-4', className)}>
      {routes.map((route) => (
        <NavLink 
          key={route.href} 
          to={route.href}
          className={({ isActive }) => 
            cn(
              'transition-colors flex items-center hover:text-foreground text-sm lg:text-base',
              isActive 
                ? 'text-foreground font-medium' 
                : 'text-muted-foreground'
            )
          }
        >
          {route.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default MainNav;
