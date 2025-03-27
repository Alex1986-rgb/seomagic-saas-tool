
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartPulse } from 'lucide-react';

const NavbarLogo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center">
      <motion.div 
        className="flex items-center gap-2"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center shadow-md">
          <HeartPulse className="w-5 h-5 text-primary-foreground animate-pulse-slow" />
          <div className="absolute -right-1 -top-1 w-3 h-3 bg-background border-2 border-primary rounded-full" />
        </div>
        <span className="font-bold text-xl hidden sm:block">SeoMarket</span>
      </motion.div>
    </Link>
  );
};

export default NavbarLogo;
