
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "../ThemeSwitcher";
import { NAV_ITEMS } from './navConstants';

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

  return (
    <div className="md:hidden border-t py-4">
      <div className="container space-y-4">
        <nav className="flex flex-col space-y-2">
          {NAV_ITEMS.map((item) => (
            <Link 
              key={item.href}
              to={item.href} 
              className="px-4 py-2 hover:bg-accent rounded-md transition-colors"
            >
              {item.label}
            </Link>
          ))}
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
            <Button onClick={() => navigate('/auth')} variant="default" className="w-full">
              Войти
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavbarMobileMenu;
