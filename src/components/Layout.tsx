
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
    
    // Ensure consistent styling
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    return () => {
      console.log("Layout unmounted");
    };
  }, [location.pathname]);
  
  const isAdminRoute = location.pathname.startsWith('/admin');
  const shouldHideNavbar = hideNavbar || isAdminRoute;
  const shouldHideFooter = hideFooter || isAdminRoute;

  return (
    <div 
      className={cn("flex flex-col min-h-screen relative", className)}
      style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}
    >
      {/* Background */}
      <div className="fixed inset-0 z-[-1]" style={{ backgroundColor: '#ffffff' }}>
        <StarryBackground />
      </div>
      
      {!shouldHideNavbar && <Navbar />}
      
      <main 
        className="flex-grow relative z-10 w-full" 
        style={{ backgroundColor: 'transparent', minHeight: '50vh' }}
      >
        {children}
      </main>
      
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default Layout;
