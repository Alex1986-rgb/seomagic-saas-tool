
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  label: string;
  href: string;
  children?: NavSubItem[];
}

interface NavSubItem {
  label: string;
  href: string;
  isNew?: boolean;
  isDemo?: boolean;
}

interface NavbarDesktopLinksProps {
  navItems: NavItem[];
}

const NavbarDesktopLinks: React.FC<NavbarDesktopLinksProps> = ({ navItems }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isActiveLink = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="hidden md:flex items-center space-x-1">
      {navItems.map((item) => (
        <div 
          key={item.href}
          className="relative"
          onMouseEnter={() => setHoveredItem(item.href)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {item.children ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative group ${
                    isActiveLink(item.href) 
                      ? 'text-primary' 
                      : 'text-foreground/80 hover:text-foreground hover:bg-accent/20'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {item.label} 
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </span>
                  {isActiveLink(item.href) && (
                    <motion.div 
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-3 right-3 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="center" 
                className="w-48 p-1 bg-card/95 backdrop-blur-sm border-primary/20"
              >
                {item.children.map((subItem) => (
                  <DropdownMenuItem key={subItem.href} asChild>
                    <Link 
                      to={subItem.href}
                      className="flex items-center justify-between px-3 py-2 text-sm rounded-md"
                    >
                      <span>{subItem.label}</span>
                      <div className="flex gap-1">
                        {subItem.isNew && (
                          <Badge variant="default" className="py-0 px-1.5 text-[0.6rem] h-4">
                            New
                          </Badge>
                        )}
                        {subItem.isDemo && (
                          <Badge variant="outline" className="py-0 px-1.5 text-[0.6rem] h-4 border-green-400 text-green-500">
                            Demo
                          </Badge>
                        )}
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link 
              to={item.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                isActiveLink(item.href) 
                  ? 'text-primary' 
                  : 'text-foreground/80 hover:text-foreground hover:bg-accent/20'
              }`}
            >
              {item.label}
              {isActiveLink(item.href) && (
                <motion.div 
                  layoutId="navbar-indicator" 
                  className="absolute -bottom-1 left-3 right-3 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default NavbarDesktopLinks;
