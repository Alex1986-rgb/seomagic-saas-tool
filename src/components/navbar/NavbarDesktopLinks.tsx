
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ChevronDown } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";

interface NavbarDesktopLinksProps {
  navItems: Array<{
    label: string;
    href: string;
    isNew?: boolean;
    isDemo?: boolean;
    children?: Array<{
      label: string;
      href: string;
      isNew?: boolean;
      isDemo?: boolean;
    }>;
  }>;
}

const NavbarDesktopLinks: React.FC<NavbarDesktopLinksProps> = ({ navItems }) => {
  return (
    <div className="hidden md:flex items-center gap-1">
      <NavigationMenu>
        <NavigationMenuList className="gap-1">
          {navItems.map((item) => (
            item.children ? (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuTrigger className={cn(
                  "text-sm",
                  "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}>
                  {item.label} <ChevronDown className="h-3 w-3 ml-1" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 p-4 w-[220px]">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <NavigationMenuLink asChild>
                          <NavLink
                            to={child.href}
                            className={({ isActive }) => cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              isActive && "bg-accent text-accent-foreground"
                            )}
                          >
                            <div className="flex items-center">
                              <span className="text-sm font-medium leading-none">{child.label}</span>
                              {child.isNew && (
                                <Badge variant="default" className="ml-1 py-0 px-1 text-[0.6rem]">
                                  NEW
                                </Badge>
                              )}
                              {child.isDemo && (
                                <Badge variant="outline" className="ml-1 py-0 px-1 text-[0.6rem] border-green-400 text-green-500">
                                  DEMO
                                </Badge>
                              )}
                            </div>
                          </NavLink>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      navigationMenuTriggerStyle(),
                      "px-3 py-2 text-sm rounded-md transition-colors relative",
                      isActive
                        ? "text-foreground bg-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )
                  }
                >
                  {item.label}
                  {item.isNew && (
                    <Badge variant="default" className="ml-1 py-0 px-1 text-[0.6rem]">
                      NEW
                    </Badge>
                  )}
                  {item.isDemo && (
                    <Badge variant="outline" className="ml-1 py-0 px-1 text-[0.6rem] border-green-400 text-green-500">
                      DEMO
                    </Badge>
                  )}
                </NavLink>
              </NavigationMenuItem>
            )
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      
      {/* Admin panel button - always visible */}
      <NavLink
        to="/admin"
        className={({ isActive }) =>
          cn(
            "px-3 py-2 text-sm rounded-md transition-colors relative group flex items-center gap-1",
            isActive
              ? "text-foreground bg-accent"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
          )
        }
      >
        <ShieldCheck className="h-4 w-4" />
        <span>Админ-панель</span>
        <Badge variant="default" className="ml-1 py-0 px-1 text-[0.6rem] bg-purple-500">
          ADMIN
        </Badge>
      </NavLink>
    </div>
  );
};

export default NavbarDesktopLinks;
