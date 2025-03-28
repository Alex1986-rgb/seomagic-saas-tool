
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
import { NAV_ITEMS } from './navConstants';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const location = useLocation();
  const navigate = useNavigate();

  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check authentication status when the component loads
  useEffect(() => {
    const checkAuthStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const admin = localStorage.getItem('isAdmin') === 'true';
      
      setIsLoggedIn(loggedIn);
      setIsAdmin(admin);
    };
    
    checkAuthStatus();
    
    // Add a listener to update the state when localStorage changes
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  // Toggle for login/logout
  const toggleAuth = () => {
    if (isLoggedIn) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('isAdmin');
      setIsLoggedIn(false);
      setIsAdmin(false);
      
      // Navigate to home page when logging out
      navigate('/');
    } else {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
    }
    
    // Generate a storage event to update the state in other components
    window.dispatchEvent(new Event('storage'));
  };

  // Toggle for admin rights
  const toggleAdmin = () => {
    const newAdminState = !isAdmin;
    localStorage.setItem('isAdmin', newAdminState.toString());
    setIsAdmin(newAdminState);
    
    // Generate a storage event to update the state in other components
    window.dispatchEvent(new Event('storage'));
  };

  // Close the menu when the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Change navbar style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call immediately to initialize the state
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

      {/* Debug Controls - hide in production */}
      {process.env.NODE_ENV !== 'production' && (
        <DebugControls 
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          toggleAuth={toggleAuth}
          toggleAdmin={toggleAdmin}
        />
      )}
    </motion.nav>
  );
};

export default Navbar;
