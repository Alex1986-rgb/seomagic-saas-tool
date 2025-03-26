
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserCircle, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";

const menuVariants = {
  closed: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05,
    }
  }
};

const itemVariants = {
  closed: { opacity: 0, y: -10 },
  open: { opacity: 1, y: 0 }
};

interface NavbarMobileProps {
  isOpen: boolean;
  navItems: { name: string; path: string }[];
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

  return (
    <motion.div
      initial="closed"
      animate="open"
      exit="closed"
      variants={menuVariants}
      className="md:hidden bg-background/95 backdrop-blur-lg shadow-lg"
    >
      <div className="container px-4 py-4">
        <div className="flex flex-col space-y-3">
          {navItems.map((item) => (
            <motion.div key={item.path} variants={itemVariants}>
              <Link
                to={item.path}
                className={`block py-2 px-4 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-background'
                }`}
              >
                {item.name}
              </Link>
            </motion.div>
          ))}

          <motion.div 
            variants={itemVariants}
            className="pt-4 border-t border-border flex flex-col space-y-3"
          >
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center py-2 px-4 rounded-md hover:bg-background"
                >
                  <UserCircle className="h-5 w-5 mr-2" />
                  <span>Личный кабинет</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center py-2 px-4 rounded-md hover:bg-background"
                >
                  <Search className="h-5 w-5 mr-2" />
                  <span>Мои аудиты</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center py-2 px-4 rounded-md hover:bg-background"
                  >
                    <span>Админ панель</span>
                  </Link>
                )}
                <Button variant="destructive" onClick={toggleAuth}>
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" className="w-full">Войти</Button>
                </Link>
                <Link to="/auth?tab=register">
                  <Button className="w-full">Регистрация</Button>
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default NavbarMobile;
