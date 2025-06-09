
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
    console.log("Layout mounted with path:", location.pathname, "- DEBUGGING");
    return () => {
      console.log("Layout unmounted - DEBUGGING");
    };
  }, [location.pathname]);
  
  // Check if the current path starts with /admin
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // On administrative pages we hide the standard navigation and footer
  // since they have their own built-in navigation
  const shouldHideNavbar = hideNavbar || isAdminRoute;
  const shouldHideFooter = hideFooter || isAdminRoute;

  console.log("Layout rendering with navbar:", !shouldHideNavbar, "footer:", !shouldHideFooter, "- DEBUGGING");

  return (
    <div className={cn("flex flex-col min-h-screen relative", className)} style={{ backgroundColor: 'green' }}>
      <div style={{ backgroundColor: 'yellow', color: 'black', padding: '10px' }}>
        DEBUG Layout: Path = {location.pathname}
      </div>
      
      {/* Background */}
      <div className="fixed inset-0 z-[-1]">
        <StarryBackground />
      </div>
      
      {/* Navbar */}
      {!shouldHideNavbar && <Navbar />}
      
      {/* Main content */}
      <main className="flex-grow relative z-10 w-full" style={{ backgroundColor: 'orange' }}>
        <div style={{ backgroundColor: 'purple', color: 'white', padding: '10px' }}>
          DEBUG Main: Content should appear below
        </div>
        {children}
      </main>
      
      {/* Footer */}
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default Layout;
