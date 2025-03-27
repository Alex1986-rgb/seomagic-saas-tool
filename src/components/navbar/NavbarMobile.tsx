
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, FileText, Info, Mail, HelpCircle, Settings, LogOut, Shield, User, LayoutDashboard } from 'lucide-react';
import { NavItem } from './navConstants';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

interface NavbarMobileProps {
  isOpen: boolean;
  navItems: NavItem[];
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
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      className="md:hidden overflow-hidden bg-background/95 backdrop-blur-lg shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="px-4 py-5">
        <nav className="flex flex-col space-y-4">
          {navItems.map((item) => (
            <motion.div key={item.href} variants={itemVariants}>
              <Link 
                to={item.href} 
                className="flex items-center py-2 text-foreground/80 hover:text-foreground transition-colors"
              >
                {item.icon && <item.icon className="h-5 w-5 mr-2" />}
                {item.label}
              </Link>
            </motion.div>
          ))}

          <Separator className="my-2" />
          
          <div className="pt-2 pb-4">
            <ThemeSwitcher />
          </div>

          {isLoggedIn ? (
            <div className="space-y-3">
              <motion.div variants={itemVariants}>
                <Link 
                  to="/profile" 
                  className="flex items-center py-2 text-foreground/80 hover:text-foreground transition-colors"
                >
                  <User className="h-5 w-5 mr-2" />
                  Личный кабинет
                </Link>
              </motion.div>
              
              {!isHomePage && (
                <motion.div variants={itemVariants}>
                  <Link 
                    to="/dashboard" 
                    className="flex items-center py-2 text-foreground/80 hover:text-foreground transition-colors"
                  >
                    <LayoutDashboard className="h-5 w-5 mr-2" />
                    Панель управления
                  </Link>
                </motion.div>
              )}
              
              {isAdmin && !isHomePage && (
                <motion.div variants={itemVariants}>
                  <Link 
                    to="/admin" 
                    className="flex items-center py-2 text-foreground/80 hover:text-foreground transition-colors"
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    Админ панель
                  </Link>
                </motion.div>
              )}
              
              <motion.div variants={itemVariants}>
                <Button 
                  variant="destructive"
                  className="w-full"
                  onClick={toggleAuth}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Выйти
                </Button>
              </motion.div>
            </div>
          ) : (
            <div className="space-y-3 pt-3">
              <motion.div variants={itemVariants}>
                <Link to="/auth">
                  <Button variant="outline" className="w-full">Войти</Button>
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link to="/auth?tab=register">
                  <Button className="w-full">Регистрация</Button>
                </Link>
              </motion.div>
            </div>
          )}
        </nav>
      </div>
    </motion.div>
  );
};

export default NavbarMobile;
