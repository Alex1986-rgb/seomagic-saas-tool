
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import StarryBackground from './backgrounds/StarryBackground';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col min-h-screen relative", className)}>
      <div className="neo-glass fixed inset-0 z-[-1]" />
      <StarryBackground />
      <Navbar />
      <main className="flex-grow relative z-10">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
