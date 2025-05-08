
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './navbar';
import Footer from './Footer';
import StarryBackground from './backgrounds/StarryBackground';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import PerformanceMonitor from './shared/performance/PerformanceMonitor';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  hideNavbar?: boolean;
  hideFooter?: boolean;
  animateTransitions?: boolean;
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: 'easeInOut' }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3, ease: 'easeInOut' }
  }
};

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className,
  hideNavbar = false,
  hideFooter = false,
  animateTransitions = true
}) => {
  const location = useLocation();
  const [isFirstRender, setIsFirstRender] = useState(true);
  
  // Check if the current path starts with /admin
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // On administrative pages we hide the standard navigation and footer
  // since they have their own built-in navigation
  const shouldHideNavbar = hideNavbar || isAdminRoute;
  const shouldHideFooter = hideFooter || isAdminRoute;

  // After first render allow animation
  useEffect(() => {
    // Small delay to not block first render
    const timeout = setTimeout(() => {
      setIsFirstRender(false);
    }, 10);
    return () => clearTimeout(timeout);
  }, []);

  // Add console logs for debugging
  console.log("Layout rendering with children:", children ? "Children exists" : "No children");
  console.log("Current route:", location.pathname);

  return (
    <div className={cn("flex flex-col min-h-screen relative", className)}>
      <div className="fixed inset-0 z-[-1]">
        <StarryBackground />
      </div>
      
      {!shouldHideNavbar && <Navbar />}
      
      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname}
          className="flex-grow relative z-10 w-full"
          initial={animateTransitions && !isFirstRender ? 'initial' : false}
          animate={animateTransitions ? 'animate' : undefined}
          exit={animateTransitions ? 'exit' : undefined}
          variants={pageVariants}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      
      {!shouldHideFooter && <Footer />}
      
      {/* Performance monitoring in development mode */}
      {process.env.NODE_ENV === 'development' && (
        <PerformanceMonitor showDebugInfo />
      )}
    </div>
  );
};

export default Layout;
