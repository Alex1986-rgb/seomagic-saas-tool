
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useMobile } from '@/hooks/use-mobile';
import NavbarLogo from './NavbarLogo';
import NavbarDesktopLinks from './NavbarDesktopLinks';
import NavbarDesktopAuth from './NavbarDesktopAuth';
import NavbarMobileToggle from './NavbarMobileToggle';
import NavbarMobile from './NavbarMobile';
import DebugControls from './DebugControls';
import { NAV_ITEMS, CLIENT_ITEMS } from './navConstants';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useMobile();
  const location = useLocation();
  const { user, logoutUser, toggleAdmin } = useAuth();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const safeUser = user || { isLoggedIn: false, isAdmin: false };

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
          <NavbarLogo />

          <NavbarDesktopLinks navItems={NAV_ITEMS} />

          <NavbarDesktopAuth />

          <NavbarMobileToggle isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && isMobile && (
          <NavbarMobile 
            isOpen={isOpen}
            navItems={NAV_ITEMS}
            isLoggedIn={safeUser.isLoggedIn}
            isAdmin={safeUser.isAdmin}
            toggleAuth={logoutUser}
          />
        )}
      </AnimatePresence>

      {process.env.NODE_ENV !== 'production' && (
        <DebugControls 
          isLoggedIn={safeUser.isLoggedIn}
          isAdmin={safeUser.isAdmin}
          toggleAuth={logoutUser}
          toggleAdmin={toggleAdmin}
        />
      )}
    </motion.nav>
  );
};

export default Navbar;
