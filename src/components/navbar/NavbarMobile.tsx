
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NAV_ITEMS, CLIENT_ITEMS, RESOURCE_ITEMS, COMPANY_ITEMS } from './navConstants';
import { Badge } from '@/components/ui/badge';

interface NavbarMobileProps {
  isOpen: boolean;
  navItems: Array<{
    label: string;
    href: string;
    isNew?: boolean;
    isDemo?: boolean;
  }>;
  isLoggedIn: boolean;
  isAdmin: boolean;
  toggleAuth: () => void;
}

const NavbarMobile: React.FC<NavbarMobileProps> = ({
  isOpen,
  navItems,
  isLoggedIn,
  isAdmin,
  toggleAuth
}) => {
  console.log("NavbarMobile rendering with isOpen:", isOpen);
  
  return (
    <motion.div
      className="md:hidden absolute top-16 left-0 w-full bg-background/95 backdrop-blur-lg shadow-lg border-t border-border z-40"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="px-4 py-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="space-y-1 pb-4 border-b border-border">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center px-3 py-2 text-base rounded-md hover:bg-accent"
            >
              {item.label}
              {item.isNew && (
                <Badge variant="default" className="ml-2 py-0 px-1 text-[0.6rem]">
                  NEW
                </Badge>
              )}
              {item.isDemo && (
                <Badge variant="outline" className="ml-2 py-0 px-1 text-[0.6rem] border-green-400 text-green-500">
                  DEMO
                </Badge>
              )}
            </Link>
          ))}
        </div>
        
        <div className="pt-4 pb-2">
          <h3 className="text-muted-foreground text-xs font-medium px-3 mb-2">Ресурсы</h3>
          <div className="space-y-1">
            {RESOURCE_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent text-muted-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="pt-2 pb-4 border-b border-border">
          <h3 className="text-muted-foreground text-xs font-medium px-3 mb-2">Компания</h3>
          <div className="space-y-1">
            {COMPANY_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent text-muted-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="pt-4 flex flex-col">
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="px-3 py-2 text-sm font-medium text-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 mb-2"
              >
                Личный кабинет
              </Link>
              <button
                onClick={toggleAuth}
                className="px-3 py-2 text-sm font-medium text-center rounded-md border border-input bg-background hover:bg-accent"
              >
                Выйти
              </button>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="mt-2 px-3 py-2 text-sm font-medium text-center rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Админ панель
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="px-3 py-2 text-sm font-medium text-center rounded-md border border-input bg-background hover:bg-accent mb-2"
              >
                Войти
              </Link>
              <Link
                to="/auth?tab=register"
                className="px-3 py-2 text-sm font-medium text-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NavbarMobile;
