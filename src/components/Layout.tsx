
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className,
  hideNavbar = false,
  hideFooter = false,
  animateTransitions = true
}) => {
  const location = useLocation();
  
  // Check if the current path starts with /admin
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // On administrative pages we hide the standard navigation and footer
  // since they have their own built-in navigation
  const shouldHideNavbar = hideNavbar || isAdminRoute;
  const shouldHideFooter = hideFooter || isAdminRoute;

  return (
    <div className={cn("flex flex-col min-h-screen relative", className)}>
      {/* Background */}
      <div className="fixed inset-0 z-[-1]">
        <StarryBackground />
      </div>
      
      {/* Navbar */}
      {!shouldHideNavbar && <Navbar />}
      
      {/* Main content */}
      <main className="flex-grow relative z-10 w-full">
        {children}
      </main>
      
      {/* Footer */}
      {!shouldHideFooter && <Footer />}
      
      {/* Performance monitoring in development mode */}
      {process.env.NODE_ENV === 'development' && (
        <PerformanceMonitor showDebugInfo />
      )}
    </div>
  );
};

export default Layout;
