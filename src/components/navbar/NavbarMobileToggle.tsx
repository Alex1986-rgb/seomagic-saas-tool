
import React, { memo, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface NavbarMobileToggleProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const NavbarMobileToggle: React.FC<NavbarMobileToggleProps> = ({ isOpen, setIsOpen }) => {
  // Используем useCallback для предотвращения ненужных перерисовок
  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  return (
    <div className="flex items-center md:hidden gap-2">
      <Button
        variant="ghost"
        className="px-2"
        onClick={handleToggle}
        aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
    </div>
  );
};

// Мемоизируем компонент для предотвращения ненужных ререндеров
export default memo(NavbarMobileToggle);
