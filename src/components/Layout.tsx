
import React from 'react';
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
  
  // Pages with built-in navigation and footer
  const pagesWithBuiltInNavbar = ['/audit', '/admin'];
  const pagesWithBuiltInFooter = ['/audit', '/admin'];
  
  // Check if current path starts with any of the paths in the arrays
  const isPathIncluded = (path: string, pathArray: string[]) => {
    return pathArray.some(item => 
      path === item || path.startsWith(`${item}/`)
    );
  };
  
  const shouldHideNavbar = hideNavbar || isPathIncluded(location.pathname, pagesWithBuiltInNavbar);
  const shouldHideFooter = hideFooter || isPathIncluded(location.pathname, pagesWithBuiltInFooter);

  return (
    <div className={cn("flex flex-col min-h-screen relative", className)}>
      <div className="neo-glass fixed inset-0 z-[-1]" />
      <StarryBackground />
      {!shouldHideNavbar && <Navbar />}
      <main className="flex-grow relative z-10">{children}</main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default Layout;
