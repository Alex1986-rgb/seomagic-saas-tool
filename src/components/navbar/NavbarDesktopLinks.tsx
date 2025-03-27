
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavbarDesktopLinksProps {
  navItems: Array<{
    name: string;
    href: string;
  }>;
}

const NavbarDesktopLinks: React.FC<NavbarDesktopLinksProps> = ({ navItems }) => {
  return (
    <div className="hidden md:flex items-center space-x-1">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className="px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-accent/50 transition-colors"
        >
          <motion.span
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {item.name}
          </motion.span>
        </Link>
      ))}
    </div>
  );
};

export default NavbarDesktopLinks;
