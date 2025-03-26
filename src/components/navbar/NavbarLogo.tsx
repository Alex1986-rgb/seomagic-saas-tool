
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const NavbarLogo: React.FC = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Link to="/" className="flex items-center font-bold text-xl">
        <Activity className="w-5 h-5 text-primary mr-2 animate-pulse-slow" />
        <span className="text-primary">SEO</span>
        <span>Market</span>
      </Link>
    </motion.div>
  );
};

export default NavbarLogo;
