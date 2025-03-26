
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const NavbarLogo: React.FC = () => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        rotateX: 10,
        rotateY: 10,
        z: 50
      }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="icon-3d"
      style={{ perspective: 1000 }}
    >
      <Link to="/" className="flex items-center font-bold text-xl">
        <Activity className="w-5 h-5 text-primary mr-2 float-3d glow-effect" />
        <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">SEO</span>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Market</span>
      </Link>
    </motion.div>
  );
};

export default NavbarLogo;

