
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
  
  // Проверяем, начинается ли текущий путь с /admin
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // На административных страницах мы скрываем стандартную навигацию и подвал,
  // так как у них есть своя встроенная навигация
  const shouldHideNavbar = hideNavbar || isAdminRoute;
  const shouldHideFooter = hideFooter || isAdminRoute;

  return (
    <div className={cn("flex flex-col min-h-screen relative", className)}>
      <div className="fixed inset-0 z-[-1]">
        <StarryBackground />
      </div>
      {!shouldHideNavbar && <Navbar />}
      <main className="flex-grow relative z-10 w-full">{children}</main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default Layout;
