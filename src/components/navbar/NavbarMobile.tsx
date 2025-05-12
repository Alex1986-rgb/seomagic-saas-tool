
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeSwitcher from '../ThemeSwitcher';
import { ShieldCheck } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface NavbarMobileProps {
  isOpen: boolean;
  navItems: Array<{
    label: string;
    href: string;
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
  const navigate = useNavigate();

  if (!isOpen) return null;

  const menuAnimation = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: {
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: {
        duration: 0.3
      } 
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={menuAnimation}
      className="md:hidden border-t py-4 bg-background"
    >
      <div className="container space-y-4">
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              to={item.href} 
              className="px-4 py-2 hover:bg-accent rounded-md transition-colors"
            >
              {item.label}
            </Link>
          ))}
          
          {/* Админ-панель всегда видима */}
          <Link 
            to="/admin"
            className="px-4 py-2 hover:bg-accent rounded-md transition-colors flex items-center gap-2"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Админ-панель</span>
            <Badge variant="default" className="ml-1 py-0 px-1 text-[0.6rem] bg-purple-500">
              ADMIN
            </Badge>
          </Link>
        </nav>
        
        <div className="flex items-center gap-2 pt-4 border-t">
          <ThemeSwitcher />
          
          {isLoggedIn ? (
            <div className="flex items-center justify-between w-full">
              <Button variant="outline" size="sm" onClick={toggleAuth}>
                Выйти
              </Button>
            </div>
          ) : (
            <Button onClick={() => navigate('/auth')} variant="default" className="w-full">
              Войти
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NavbarMobile;
