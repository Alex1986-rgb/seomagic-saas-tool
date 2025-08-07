import React from 'react';
import Navbar from './navbar/Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;