
import React, { useEffect } from 'react';
import Navbar from './navbar';
import Footer from './Footer';
import StarryBackground from './backgrounds/StarryBackground';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import SeoTextBlock from './seo-text/SeoTextBlock';
import { getSeoText } from './seo-text/getSeoText';

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
  // SEO-текст показываем на публичных контентных страницах (не в админке, не на транзакционных)
  const noSeoText = isAdminRoute || ['/auth', '/checkout', '/dashboard', '/profile', '/settings'].some((p) => location.pathname.startsWith(p));

  return (
    <div className={cn("flex flex-col min-h-screen relative", className)}>
      {/* Background */}
      <div className="fixed inset-0 z-[-1]" style={{ zIndex: -1 }}>
        <StarryBackground />
      </div>
      
      {!shouldHideNavbar && <Navbar />}
      
      <main className="flex-grow relative z-10 w-full">
        {children}
      </main>

      {!noSeoText && (
        <div className="relative z-10 w-full border-t border-border bg-background/60">
          <div className="container mx-auto px-4">
            <SeoTextBlock data={getSeoText(location.pathname)} />
          </div>
        </div>
      )}

      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default Layout;
