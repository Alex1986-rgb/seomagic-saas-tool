
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
    console.log("Layout mounted - working properly!", location.pathname);
    
    return () => {
      console.log("Layout unmounted");
    };
  }, [location.pathname]);
  
  const isAdminRoute = location.pathname.startsWith('/admin');
  const shouldHideNavbar = hideNavbar || isAdminRoute;
  const shouldHideFooter = hideFooter || isAdminRoute;

  return (
    <div className={cn("flex flex-col min-h-screen relative", className)}>
      {/* Background */}
      <div className="fixed inset-0 z-[-1]">
        <StarryBackground />
      </div>
      
      {!shouldHideNavbar && <Navbar />}
      
      <main className="flex-grow relative z-10 w-full">
        {children}
      </main>
      
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default Layout;
