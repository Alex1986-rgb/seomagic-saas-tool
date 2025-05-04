
import React, { ReactNode } from 'react';
import Navbar from '../navbar';
import Footer from '../Footer';
import { cn } from '@/lib/utils';
import StarryBackground from '../backgrounds/StarryBackground';

interface LayoutProps {
  children: ReactNode;
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
      <div className="fixed inset-0 z-[-1]">
        <StarryBackground />
      </div>
      {!hideNavbar && <Navbar />}
      <main className="flex-grow relative z-10 w-full">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
