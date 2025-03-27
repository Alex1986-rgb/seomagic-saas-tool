
import React from 'react';
import { motion } from 'framer-motion';

interface NavButtonProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

export const NavButton: React.FC<NavButtonProps> = ({ children, icon, active, onClick }) => (
  <motion.button
    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-primary text-white' 
        : 'text-foreground hover:bg-secondary'
    }`}
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    aria-pressed={active}
  >
    <span className="mr-3" aria-hidden="true">{icon}</span>
    <span className="font-medium">{children}</span>
  </motion.button>
);

export default NavButton;
