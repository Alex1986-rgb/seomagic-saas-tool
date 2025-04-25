
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  icon: LucideIcon;
  children: React.ReactNode;
  active?: boolean;
  badge?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon: Icon,
  children,
  active,
  badge,
  className,
  onClick,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
          (isActive || active) ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground",
          className
        )
      }
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
      {badge && <span className="ml-auto">{badge}</span>}
    </NavLink>
  );
};

export default SidebarLink;
