
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface NavbarDesktopLinksProps {
  navItems: Array<{
    label: string;
    href: string;
    isNew?: boolean;
    isDemo?: boolean;
  }>;
}

const NavbarDesktopLinks: React.FC<NavbarDesktopLinksProps> = ({ navItems }) => {
  return (
    <div className="hidden md:flex items-center gap-1">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              "px-3 py-2 text-sm rounded-md transition-colors relative group",
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
      ))}
    </div>
  );
};

export default NavbarDesktopLinks;
