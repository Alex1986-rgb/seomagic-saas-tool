
import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import { useAuth } from '@/contexts/AuthContext';
import { ADMIN_ITEMS } from './navConstants';

interface NavbarDesktopLinksProps {
  navItems: {
    label: string;
    href: string;
  }[];
}

const NavbarDesktopLinks: React.FC<NavbarDesktopLinksProps> = ({ navItems }) => {
  const { user } = useAuth();
  
  // Дополнительные пункты для администраторов
  const displayItems = user?.isAdmin 
    ? [...navItems, ...ADMIN_ITEMS] 
    : navItems;
  
  return (
    <NavigationMenu className="hidden md:flex w-full justify-center">
      <NavigationMenuList className="flex space-x-4 lg:space-x-6 xl:space-x-8">
        {displayItems.map((item) => (
          <NavigationMenuItem key={item.href} className="flex-grow text-center">
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${
                  isActive 
                    ? 'text-foreground after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-primary' 
                    : 'text-muted-foreground'
                } relative px-4 py-2 w-full block text-center`
              }
            >
              <motion.div
                whileHover={{ y: -1 }}
                whileTap={{ y: 1 }}
                className="inline-block"
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
