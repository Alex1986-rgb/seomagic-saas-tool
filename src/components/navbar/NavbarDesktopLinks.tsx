
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RESOURCE_ITEMS, COMPANY_ITEMS } from './navConstants';

interface NavbarDesktopLinksProps {
  navItems: { name: string; path: string }[];
}

const NavbarDesktopLinks: React.FC<NavbarDesktopLinksProps> = ({ navItems }) => {
  const location = useLocation();
  const [resourceOpen, setResourceOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

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
      
      {/* Ресурсы выпадающее меню */}
      <DropdownMenu open={resourceOpen} onOpenChange={setResourceOpen}>
        <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary transition-colors">
          Ресурсы
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {RESOURCE_ITEMS.map((item) => (
            <DropdownMenuItem key={item.path} asChild>
              <Link 
                to={item.path}
                className={`w-full px-4 py-2 ${
                  location.pathname === item.path
                    ? 'text-primary font-medium'
                    : 'text-foreground'
                }`}
              >
                {item.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Компания выпадающее меню */}
      <DropdownMenu open={companyOpen} onOpenChange={setCompanyOpen}>
        <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary transition-colors">
          Компания
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {COMPANY_ITEMS.map((item) => (
            <DropdownMenuItem key={item.path} asChild>
              <Link 
                to={item.path}
                className={`w-full px-4 py-2 ${
                  location.pathname === item.path
                    ? 'text-primary font-medium'
                    : 'text-foreground'
                }`}
              >
                {item.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NavbarDesktopLinks;
