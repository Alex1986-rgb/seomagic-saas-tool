
import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { RESOURCE_ITEMS, COMPANY_ITEMS } from './navConstants';

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
        
        {/* Resources Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-primary">
            Ресурсы
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-2 p-4">
              {RESOURCE_ITEMS.map((item) => (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `block select-none space-y-1 rounded-md p-3 hover:bg-accent hover:text-accent-foreground ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`
                    }
                  >
                    <div className="text-sm font-medium">{item.label}</div>
                  </NavLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        {/* Company Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-primary">
            Компания
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-2 p-4">
              {COMPANY_ITEMS.map((item) => (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `block select-none space-y-1 rounded-md p-3 hover:bg-accent hover:text-accent-foreground ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`
                    }
                  >
                    <div className="text-sm font-medium">{item.label}</div>
                  </NavLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavbarDesktopLinks;
