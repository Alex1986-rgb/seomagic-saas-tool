
import React from 'react';
import Navbar from './navigation/Navbar';
import Footer from './navigation/Footer';
import GradientBackground from './backgrounds/GradientBackground';

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideFooter = false }) => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <GradientBackground />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
