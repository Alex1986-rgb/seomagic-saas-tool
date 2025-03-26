
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarDesktopLinksProps {
  navItems: { name: string; path: string }[];
}

const NavbarDesktopLinks: React.FC<NavbarDesktopLinksProps> = ({ navItems }) => {
  const location = useLocation();

  return (
    <div className="hidden md:flex items-center space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`hover:text-primary transition-colors ${
            location.pathname === item.path
              ? 'text-primary font-medium'
              : 'text-foreground'
          }`}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default NavbarDesktopLinks;
