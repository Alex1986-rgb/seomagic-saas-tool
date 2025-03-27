
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogOut, LogIn, UserPlus } from 'lucide-react';
import ThemeSwitcher from '../ThemeSwitcher';

interface NavbarMobileProps {
  isOpen: boolean;
  navItems: Array<{ label: string; href: string; admin?: boolean }>;
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
  const navigate = useNavigate();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div
      className="w-full border-t"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="grid gap-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Навигация</h3>
            <ThemeSwitcher />
          </div>
          
          {navItems
            .filter(item => !item.admin || (item.admin && isAdmin))
            .map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link 
                  to={item.href}
                  className="flex items-center px-3 py-2 text-base font-medium rounded-md hover:bg-accent"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
            
          <div className="h-px bg-border my-2" />
          
          {isLoggedIn ? (
            <>
              <motion.div variants={itemVariants}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 font-normal"
                  onClick={() => navigate('/profile')}
                >
                  <User size={18} />
                  <span>Мой профиль</span>
                </Button>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 font-normal"
                  onClick={toggleAuth}
                >
                  <LogOut size={18} />
                  <span>Выйти</span>
                </Button>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div variants={itemVariants}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 font-normal"
                  onClick={() => navigate('/auth')}
                >
                  <LogIn size={18} />
                  <span>Войти</span>
                </Button>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Button
                  variant="default"
                  className="w-full justify-start gap-2 font-normal"
                  onClick={() => navigate('/auth?tab=register')}
                >
                  <UserPlus size={18} />
                  <span>Регистрация</span>
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NavbarMobile;
