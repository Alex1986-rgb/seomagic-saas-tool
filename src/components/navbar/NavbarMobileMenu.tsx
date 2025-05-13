
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "../ThemeSwitcher";
import { NAV_ITEMS } from './navConstants';
import { ShieldCheck, LogIn } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface NavbarMobileMenuProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  isLoggedIn: boolean;
  handleLogout: () => void;
  navigate: (path: string) => void;
}

const NavbarMobileMenu: React.FC<NavbarMobileMenuProps> = ({
  isMenuOpen,
  isLoggedIn,
  handleLogout,
  navigate
}) => {
  if (!isMenuOpen) return null;

  // Helper function to handle nested navigation items
  const renderNavItems = (items) => {
    return items.map((item) => (
      <div key={item.href} className="py-1">
        {item.children ? (
          <div className="mb-1">
            <div className="px-4 py-1 text-sm font-semibold text-muted-foreground">
              {item.label}
            </div>
            <div className="pl-4 border-l border-border ml-4 space-y-1">
              {item.children.map(child => (
                <Link
                  key={child.href}
                  to={child.href}
                  className="px-4 py-2 hover:bg-accent text-sm rounded-md transition-colors flex items-center gap-1"
                >
                  <span>{child.label}</span>
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
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <Link
            to={item.href}
            className="px-4 py-2 hover:bg-accent rounded-md transition-colors block"
          >
            {item.label}
          </Link>
        )}
      </div>
    ));
  };

  return (
    <div className="md:hidden border-t py-4">
      <div className="container space-y-4">
        <nav className="flex flex-col space-y-1">
          {renderNavItems(NAV_ITEMS)}
          
          {/* Админ-панель с проверкой авторизации */}
          <Link 
            to="/admin"
            className="px-4 py-2 hover:bg-accent rounded-md transition-colors flex items-center gap-2"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Админ-панель</span>
            <Badge variant="default" className="ml-1 py-0 px-1 text-[0.6rem] bg-purple-500">
              ADMIN
            </Badge>
          </Link>
        </nav>
        
        <div className="flex items-center gap-2 pt-4 border-t">
          <ThemeSwitcher />
          
          {isLoggedIn ? (
            <div className="flex items-center justify-between w-full">
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Выйти
              </Button>
            </div>
          ) : (
            <Button onClick={() => navigate('/auth')} variant="default" className="w-full flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Войти
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavbarMobileMenu;
