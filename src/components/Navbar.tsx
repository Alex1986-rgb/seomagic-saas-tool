
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@/hooks/use-mobile';
import { AlignJustify, X, UserCircle, Search, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const location = useLocation();

  // Мок-данные для проверки авторизации
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Toggle для имитации входа/выхода
  const toggleAuth = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  // Toggle для имитации админских прав
  const toggleAdmin = () => {
    setIsAdmin(!isAdmin);
  };

  // Закрыть меню при изменении маршрута
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Изменение стиля навбара при скролле
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navbarClass = `fixed top-0 w-full z-50 transition-all duration-300 ${
    isScrolled || isOpen
      ? 'backdrop-blur-lg bg-background/80 shadow-md'
      : 'bg-transparent'
  }`;

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

  const navItems = [
    { name: 'Главная', path: '/' },
    { name: 'Аудит', path: '/audit' },
    { name: 'Тарифы', path: '/pricing' },
    { name: 'О сервисе', path: '/about' },
  ];

  return (
    <nav className={navbarClass}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center font-bold text-xl">
            <span className="text-primary">SEO</span>
            <span>Market</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`hover:text-primary transition-colors ${
                  location.pathname === item.path
                    ? 'text-primary font-medium'
                    : 'text-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <UserCircle className="h-5 w-5" />
                    <span>Мой аккаунт</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">Личный кабинет</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">Панель управления</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">Админ панель</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={toggleAuth}
                    className="cursor-pointer text-red-500"
                  >
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/auth">Войти</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth?tab=register">Регистрация</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-md p-2 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <AlignJustify size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && isMobile && (
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
        )}
      </AnimatePresence>

      {/* Debug buttons (only visible in dev mode) */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 opacity-50">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleAuth}
          className="text-xs"
        >
          {isLoggedIn ? 'Выйти (Debug)' : 'Войти (Debug)'}
        </Button>
        {isLoggedIn && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleAdmin}
            className="text-xs"
          >
            {isAdmin ? 'Убрать админа (Debug)' : 'Сделать админом (Debug)'}
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
