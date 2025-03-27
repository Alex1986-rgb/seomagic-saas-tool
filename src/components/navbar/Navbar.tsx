
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/use-mobile';
import NavbarLogo from './NavbarLogo';
import NavbarDesktopLinks from './NavbarDesktopLinks';
import NavbarDesktopAuth from './NavbarDesktopAuth';
import NavbarMobileToggle from './NavbarMobileToggle';
import NavbarMobile from './NavbarMobile';
import DebugControls from './DebugControls';
import { NAV_ITEMS } from './navConstants';
import { ThemeProvider } from '@/contexts/ThemeContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const location = useLocation();

  // Состояние авторизации
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Проверяем состояние авторизации при загрузке компонента
  useEffect(() => {
    const checkAuthStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const admin = localStorage.getItem('isAdmin') === 'true';
      
      setIsLoggedIn(loggedIn);
      setIsAdmin(admin);
    };
    
    checkAuthStatus();
    
    // Добавляем слушатель для обновления состояния при изменении localStorage
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  // Toggle для входа/выхода из системы
  const toggleAuth = () => {
    if (isLoggedIn) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('isAdmin');
      setIsLoggedIn(false);
      setIsAdmin(false);
    } else {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
    }
    
    // Генерируем событие storage для обновления состояния в других компонентах
    window.dispatchEvent(new Event('storage'));
  };

  // Toggle для прав администратора
  const toggleAdmin = () => {
    const newAdminState = !isAdmin;
    localStorage.setItem('isAdmin', newAdminState.toString());
    setIsAdmin(newAdminState);
    
    // Генерируем событие storage для обновления состояния в других компонентах
    window.dispatchEvent(new Event('storage'));
  };

  // Закрываем меню при изменении маршрута
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Изменяем стиль навбара при прокрутке
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Вызываем сразу для инициализации состояния
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navbarClass = `fixed top-0 w-full z-50 transition-all duration-500 ${
    isScrolled || isOpen
      ? 'backdrop-blur-lg bg-background/90 shadow-md'
      : 'bg-transparent'
  }`;

  return (
    <ThemeProvider>
      <motion.nav 
        className={navbarClass}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <NavbarLogo />

            {/* Desktop Navigation */}
            <NavbarDesktopLinks navItems={NAV_ITEMS} />

            {/* Desktop Auth Buttons and Theme Switcher */}
            <NavbarDesktopAuth 
              isLoggedIn={isLoggedIn}
              isAdmin={isAdmin}
              toggleAuth={toggleAuth}
            />

            {/* Mobile Toggle */}
            <NavbarMobileToggle isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && isMobile && (
            <NavbarMobile 
              isOpen={isOpen}
              navItems={NAV_ITEMS}
              isLoggedIn={isLoggedIn}
              isAdmin={isAdmin}
              toggleAuth={toggleAuth}
            />
          )}
        </AnimatePresence>

        {/* Debug Controls - скрыть на продакшене */}
        {process.env.NODE_ENV !== 'production' && (
          <DebugControls 
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
            toggleAuth={toggleAuth}
            toggleAdmin={toggleAdmin}
          />
        )}
      </motion.nav>
    </ThemeProvider>
  );
};

export default Navbar;
