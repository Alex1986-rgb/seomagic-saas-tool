
import React, { memo } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface NavbarMobileToggleProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const NavbarMobileToggle: React.FC<NavbarMobileToggleProps> = ({ isOpen, setIsOpen }) => {
  return (
    <div className="flex items-center md:hidden gap-2">
      <Button
        variant="ghost"
        className="px-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
    </div>
  );
};

// Memoize component to prevent unnecessary rerenders
export default memo(NavbarMobileToggle);
