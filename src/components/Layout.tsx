
import React, { useEffect, useState, useCallback } from 'react';
import Navbar from './navbar';
import Footer from './Footer';
import StarryBackground from './backgrounds/StarryBackground';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import { withMemo } from '@/components/shared/performance';

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
  const [mounted, setMounted] = useState(false);
  
  // Проверяем, начинается ли текущий путь с /admin
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // На административных страницах мы скрываем стандартную навигацию и подвал,
  // так как у них есть своя встроенная навигация
  const shouldHideNavbar = hideNavbar || isAdminRoute;
  const shouldHideFooter = hideFooter || isAdminRoute;
  
  // Mark component as mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Performance optimization: only render what's needed
  const renderNavbar = useCallback(() => {
    if (shouldHideNavbar) return null;
    return <Navbar />;
  }, [shouldHideNavbar]);
  
  const renderFooter = useCallback(() => {
    if (shouldHideFooter) return null;
    return <Footer />;
  }, [shouldHideFooter]);

  return (
    <div className={cn("flex flex-col min-h-screen relative", className)}>
      <div className="fixed inset-0 z-[-1]">
        <StarryBackground />
      </div>
      {mounted && renderNavbar()}
      <main className="flex-grow relative z-10 w-full">{children}</main>
      {mounted && renderFooter()}
    </div>
  );
};

// Apply memoization with props comparison to prevent unnecessary re-renders
export default withMemo(Layout, (prevProps, nextProps) => {
  return prevProps.hideNavbar === nextProps.hideNavbar &&
         prevProps.hideFooter === nextProps.hideFooter &&
         prevProps.className === nextProps.className;
  // Note: We don't compare children as they're likely to change between renders
});
