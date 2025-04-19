
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NAV_ITEMS } from './navConstants';
import NavbarActions from './NavbarActions';
import NavbarMobileMenu from './NavbarMobileMenu';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    
    toast({
      title: "Выход из системы",
      description: "Вы успешно вышли из системы",
    });
    
    navigate('/');
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">SeoMarket</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm ml-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`transition-colors hover:text-foreground/80 ${
                  location.pathname === item.href 
                    ? 'text-foreground font-medium' 
                    : 'text-foreground/60'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <NavbarActions isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        
        <Button 
          variant="ghost" 
          className="md:hidden" 
          size="icon" 
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      <NavbarMobileMenu
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        navigate={navigate}
      />
    </header>
  );
};

export default Navbar;
