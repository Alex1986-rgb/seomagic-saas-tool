
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/use-mobile';
import NavbarLogo from './NavbarLogo';
import NavbarDesktopLinks from './NavbarDesktopLinks';
import NavbarDesktopAuth from './NavbarDesktopAuth';
import NavbarMobileToggle from './NavbarMobileToggle';
import NavbarMobile from './NavbarMobile';
import DebugControls from './DebugControls';
import { NAV_ITEMS, CLIENT_ITEMS, RESOURCE_ITEMS, COMPANY_ITEMS } from './navConstants';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser, toggleAdmin } = useAuth();

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
    <motion.nav 
      className={navbarClass}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Логотип */}
          <NavbarLogo />

          {/* Десктопная навигация */}
          <NavbarDesktopLinks navItems={NAV_ITEMS} />

          {/* Десктопные кнопки авторизации и переключатель темы */}
          <NavbarDesktopAuth />

          {/* Мобильный переключатель */}
          <NavbarMobileToggle isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>

      {/* Мобильное меню */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <NavbarMobile 
            isOpen={isOpen}
            navItems={NAV_ITEMS}
            isLoggedIn={user.isLoggedIn}
            isAdmin={user.isAdmin}
            toggleAuth={logoutUser}
          />
        )}
      </AnimatePresence>

      {/* Отладочные элементы управления - скрываем в продакшене */}
      {process.env.NODE_ENV !== 'production' && (
        <DebugControls 
          isLoggedIn={user.isLoggedIn}
          isAdmin={user.isAdmin}
          toggleAuth={logoutUser}
          toggleAdmin={toggleAdmin}
        />
      )}
    </motion.nav>
  );
};

export default Navbar;
