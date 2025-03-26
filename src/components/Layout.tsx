
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import StarryBackground from './backgrounds/StarryBackground';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="bg-gradient-to-b from-background/60 to-background/30 backdrop-blur-sm fixed inset-0 z-[-1]" />
      <StarryBackground />
      <Navbar />
      <main className="flex-grow relative z-10">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
