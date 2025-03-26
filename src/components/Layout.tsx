
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
      <StarryBackground groupCount={5} starsPerGroup={50} maxSize={4} />
      <Navbar />
      <main className="flex-grow relative z-10">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
