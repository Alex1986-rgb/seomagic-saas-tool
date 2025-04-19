
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
  
  // Только страницы /admin будут иметь встроенную навигацию и подвал
  const pagesWithBuiltInNavbar = ['/admin'];
  const pagesWithBuiltInFooter = ['/admin'];
  
  // Check if current path starts with any of the paths in the arrays
  const isPathIncluded = (path: string, pathArray: string[]) => {
    return pathArray.some(item => 
      path === item || path.startsWith(`${item}/`)
    );
  };
  
  const shouldHideNavbar = hideNavbar || isPathIncluded(location.pathname, pagesWithBuiltInNavbar);
  const shouldHideFooter = hideFooter || isPathIncluded(location.pathname, pagesWithBuiltInFooter);

  // Debug log to track component mounting
  useEffect(() => {
    console.log('Layout mounted, path:', location.pathname);
    return () => {
      console.log('Layout unmounted');
    };
  }, [location.pathname]);

  return (
    <div className={cn("flex flex-col min-h-screen relative", className)}>
      <div className="fixed inset-0 z-[-1]">
        <StarryBackground />
      </div>
      {!shouldHideNavbar && <Navbar />}
      <main className="flex-grow relative z-10">{children}</main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default Layout;
