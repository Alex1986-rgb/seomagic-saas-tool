
import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

interface NavbarDesktopLinksProps {
  navItems: {
    label: string;
    href: string;
  }[];
}

const NavbarDesktopLinks: React.FC<NavbarDesktopLinksProps> = ({ navItems }) => {
  return (
    <div className="hidden md:flex items-center space-x-6">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            `text-sm font-medium transition-colors hover:text-primary ${
              isActive 
                ? 'text-foreground after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-primary' 
                : 'text-muted-foreground'
            } relative`
          }
        >
          <motion.div
            whileHover={{ y: -1 }}
            whileTap={{ y: 1 }}
          >
            {item.label}
          </motion.div>
        </NavLink>
      ))}
    </div>
  );
};

export default NavbarDesktopLinks;
