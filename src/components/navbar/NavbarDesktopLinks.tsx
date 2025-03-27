
import React, { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavbarDesktopLinksProps {
  navItems: Array<{
    name: string;
    href: string;
  }>;
}

const NavbarDesktopLinks: React.FC<NavbarDesktopLinksProps> = ({ navItems }) => {
  const location = useLocation();

  return (
    <div className="hidden md:flex items-center space-x-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive 
                ? 'bg-accent/80 text-accent-foreground' 
                : 'text-foreground hover:bg-accent/50'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <motion.span
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {item.name}
            </motion.span>
          </Link>
        );
      })}
    </div>
  );
};

// Мемоизируем компонент для предотвращения ненужных ререндеров
export default memo(NavbarDesktopLinks);
