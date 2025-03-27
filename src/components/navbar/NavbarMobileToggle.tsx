
import React from 'react';
import { AlignJustify, X } from 'lucide-react';

interface NavbarMobileToggleProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavbarMobileToggle: React.FC<NavbarMobileToggleProps> = ({ isOpen, setIsOpen }) => {
  return (
    <div className="flex md:hidden items-center">
      <button
        className="rounded-md p-2 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <AlignJustify size={24} />}
      </button>
    </div>
  );
};

export default NavbarMobileToggle;
