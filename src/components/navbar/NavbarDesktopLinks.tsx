
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck } from 'lucide-react';

interface NavbarDesktopLinksProps {
  navItems: Array<{
    label: string;
    href: string;
    isNew?: boolean;
    isDemo?: boolean;
  }>;
}

const NavbarDesktopLinks: React.FC<NavbarDesktopLinksProps> = ({ navItems }) => {
  const { user } = useAuth();

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
      
      {user?.isAdmin && (
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
          <span>Админ</span>
          <Badge variant="default" className="ml-1 py-0 px-1 text-[0.6rem] bg-purple-500">
            ADMIN
          </Badge>
        </NavLink>
      )}
    </div>
  );
};

export default NavbarDesktopLinks;
