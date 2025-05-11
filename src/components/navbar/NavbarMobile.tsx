
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ThemeSwitcher from '../ThemeSwitcher';
import { CLIENT_ITEMS } from './navConstants';

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
  toggleAuth,
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { staggerChildren: 0.05 }
    },
    exit: { 
      opacity: 0,
      y: -5, 
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <motion.div 
      className="bg-background border-b w-full overflow-hidden"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <div className="container p-4">
        <motion.nav className="flex flex-col space-y-1 mb-6" variants={containerVariants}>
          {navItems.map((item) => (
            <motion.div key={item.href} variants={itemVariants}>
              <Link 
                to={item.href}
                className="flex items-center justify-between px-4 py-2 hover:bg-accent rounded-md transition-colors"
              >
                <span>{item.label}</span>
                {item.isNew && (
                  <Badge variant="default" className="ml-1 py-0 px-1 text-[0.6rem]">
                    NEW
                  </Badge>
                )}
                {item.isDemo && (
                  <Badge variant="outline" className="ml-1 py-0 px-1 text-[0.6rem] border-green-400 text-green-500">
                    DEMO
                  </Badge>
                )}
              </Link>
            </motion.div>
          ))}

          {isAdmin && (
            <motion.div variants={itemVariants}>
              <Link 
                to="/admin"
                className="flex items-center justify-between px-4 py-2 hover:bg-accent rounded-md transition-colors"
              >
                <span>Админ-панель</span>
                <Badge variant="default" className="ml-1 py-0 px-1 text-[0.6rem] bg-purple-500">
                  ADMIN
                </Badge>
              </Link>
            </motion.div>
          )}
        </motion.nav>
        
        {isLoggedIn && (
          <motion.div className="border-t pt-3 mb-4" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <div className="px-4 py-2 font-medium">Личный кабинет</div>
            </motion.div>
            
            {CLIENT_ITEMS.map(item => (
              <motion.div key={item.href} variants={itemVariants}>
                <Link 
                  to={item.href}
                  className="flex items-center px-4 py-2 hover:bg-accent rounded-md transition-colors text-muted-foreground"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        <motion.div 
          className="flex items-center gap-2 pt-3 border-t" 
          variants={containerVariants}
        >
          <ThemeSwitcher />
          
          <motion.div className="flex-1" variants={itemVariants}>
            {isLoggedIn ? (
              <Button variant="outline" size="sm" onClick={toggleAuth} className="w-full">
                Выйти
              </Button>
            ) : (
              <div className="flex gap-2">
                <Link to="/auth" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Войти
                  </Button>
                </Link>
                <Link to="/auth?tab=register" className="flex-1">
                  <Button size="sm" className="w-full">
                    Регистрация
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NavbarMobile;
