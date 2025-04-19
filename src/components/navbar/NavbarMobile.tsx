
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { RESOURCE_ITEMS, COMPANY_ITEMS } from './navConstants';

interface NavbarMobileProps {
  isOpen: boolean;
  navItems: { label: string; href: string; admin?: boolean }[];
  isLoggedIn: boolean;
  isAdmin: boolean;
  toggleAuth: () => void;
}

const NavbarMobile: React.FC<NavbarMobileProps> = ({
  isOpen,
  navItems,
  isLoggedIn,
  isAdmin,
  toggleAuth,
}) => {
  const location = useLocation();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="backdrop-blur-lg bg-background/90 shadow-md overflow-hidden"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col space-y-3">
          {navItems.map((item) => {
            // Skip admin-only items for non-admin users
            if (item.admin && !isAdmin) return null;
            
            return (
              <motion.div key={item.href} variants={itemVariants}>
                <Link
                  to={item.href}
                  className={`block py-2 text-base font-medium ${
                    location.pathname === item.href
                      ? 'text-primary'
                      : 'text-foreground hover:text-primary/80 transition-colors'
                  }`}
                >
                  {item.label}
                </Link>
              </motion.div>
            );
          })}

          <motion.hr variants={itemVariants} className="border-t border-border" />

          <motion.div variants={itemVariants} className="flex justify-between items-center">
            <div className="space-y-2">
              {isLoggedIn ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start hover:bg-primary/10 transition-colors"
                    onClick={() => window.location.href = '/profile'}
                  >
                    Профиль
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full justify-start hover:bg-primary/10 transition-colors"
                    onClick={toggleAuth}
                  >
                    Выйти
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start hover:bg-primary/10 transition-colors"
                    >
                      Войти
                    </Button>
                  </Link>
                  <Link to="/auth?tab=register">
                    <Button
                      size="sm"
                      className="w-full justify-start"
                    >
                      Регистрация
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <ThemeSwitcher />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default NavbarMobile;
