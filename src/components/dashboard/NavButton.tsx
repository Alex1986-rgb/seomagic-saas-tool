
import React from 'react';

interface NavButtonProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

export const NavButton: React.FC<NavButtonProps> = ({ children, icon, active, onClick }) => (
  <button
    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-primary text-white' 
        : 'text-foreground hover:bg-secondary'
    }`}
    onClick={onClick}
  >
    <span className="mr-3">{icon}</span>
    <span className="font-medium">{children}</span>
  </button>
);
