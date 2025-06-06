
import React, { useEffect } from 'react';
import Navbar from './navbar';
import Footer from './Footer';
import StarryBackground from './backgrounds/StarryBackground';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  hideNavbar?: boolean;
  hideFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className,
  hideNavbar = false,
  hideFooter = false
}) => {
  const location = useLocation();
  
  useEffect(() => {
    console.log("Layout mounted with path:", location.pathname);
    return () => {
      console.log("Layout unmounted");
    };
  }, [location.pathname]);
  
  // Check if the current path starts with /admin
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // On administrative pages we hide the standard navigation and footer
  // since they have their own built-in navigation
  const shouldHideNavbar = hideNavbar || isAdminRoute;
  const shouldHideFooter = hideFooter || isAdminRoute;

  console.log("Layout rendering with navbar:", !shouldHideNavbar, "footer:", !shouldHideFooter, "path:", location.pathname);

  return (
    <div className={cn("flex flex-col min-h-screen relative", className)}>
      {/* Background */}
      {!isAdminRoute && (
        <div className="fixed inset-0 z-[-1]">
          <StarryBackground />
        </div>
      )}
      
      {/* Navbar */}
      {!shouldHideNavbar && <Navbar />}
      
      {/* Main content */}
      <main className="flex-grow relative z-10 w-full">
        {children}
      </main>
      
      {/* Footer */}
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default Layout;
