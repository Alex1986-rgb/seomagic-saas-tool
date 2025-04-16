
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
  
  // Проверяем, содержится ли шапка или подвал в дочерних компонентах
  // Для этого проверяем путь страницы, на которых шапка и подвал встроены
  const pagesWithBuiltInNavbar = ['/audit'];
  const pagesWithBuiltInFooter = ['/audit'];
  
  const shouldHideNavbar = hideNavbar || pagesWithBuiltInNavbar.includes(location.pathname);
  const shouldHideFooter = hideFooter || pagesWithBuiltInFooter.includes(location.pathname);

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
