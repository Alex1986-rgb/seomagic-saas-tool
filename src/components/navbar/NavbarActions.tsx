
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import ThemeSwitcher from "../ThemeSwitcher";
import NavbarUserActions from './NavbarUserActions';

interface NavbarActionsProps {
  isLoggedIn: boolean;
  handleLogout: () => void;
}

const NavbarActions: React.FC<NavbarActionsProps> = ({ isLoggedIn, handleLogout }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="hidden md:flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
        <ThemeSwitcher />
        <NavbarUserActions 
          isLoggedIn={isLoggedIn} 
          handleLogout={handleLogout}
        />
      </div>
    </div>
  );
};

export default NavbarActions;
