
import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";

interface NavbarDesktopLinksProps {
  navItems: {
    label: string;
    href: string;
  }[];
}

const NavbarDesktopLinks: React.FC<NavbarDesktopLinksProps> = ({ navItems }) => {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {navItems.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${
                  isActive 
                    ? 'text-foreground after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-primary' 
                    : 'text-muted-foreground'
                } relative px-4 py-2`
              }
            >
              <motion.div
                whileHover={{ y: -1 }}
                whileTap={{ y: 1 }}
              >
                {item.label}
              </motion.div>
            </NavLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavbarDesktopLinks;
