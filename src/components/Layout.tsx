
import React from 'react';
import Navbar from './navbar';
import Footer from './Footer';
import StarryBackground from './backgrounds/StarryBackground';
import { cn } from '@/lib/utils';

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
  return (
    <div className={cn("flex flex-col min-h-screen relative", className)}>
      <div className="neo-glass fixed inset-0 z-[-1]" />
      <StarryBackground />
      {!hideNavbar && <Navbar />}
      <main className="flex-grow relative z-10">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
