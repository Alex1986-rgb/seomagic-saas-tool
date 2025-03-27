
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

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const location = useLocation();

  // Mock data for auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Toggle for mimicking login/logout
  const toggleAuth = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  // Toggle for mimicking admin rights
  const toggleAdmin = () => {
    setIsAdmin(!isAdmin);
  };

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Change navbar style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
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

      {/* Debug Controls */}
      <DebugControls 
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        toggleAuth={toggleAuth}
        toggleAdmin={toggleAdmin}
      />
    </motion.nav>
  );
};

export default Navbar;
