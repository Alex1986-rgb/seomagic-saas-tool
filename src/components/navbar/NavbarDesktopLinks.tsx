
import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import { useAuth } from '@/contexts/AuthContext';
import { ADMIN_ITEMS, ADMIN_ICON } from './navConstants';

interface NavbarDesktopLinksProps {
  navItems: {
    label: string;
    href: string;
    admin?: boolean;
  }[];
}

const NavbarDesktopLinks: React.FC<NavbarDesktopLinksProps> = ({ navItems }) => {
  const { user } = useAuth();

  // Ссылки для администратора могут дублироваться, если показывать отдельно — выведем только NAV_ITEMS
  const displayItems = navItems;

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
                className="inline-block flex gap-1 items-center justify-center"
              >
                {/* Если это ссылка на админку, добавим иконку */}
                {item.admin && (
                  <ADMIN_ICON className="inline-block h-4 w-4 text-primary/80 mb-0.5" />
                )}
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
