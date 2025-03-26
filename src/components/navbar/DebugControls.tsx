
import React from 'react';
import { Button } from '@/components/ui/button';

interface DebugControlsProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  toggleAuth: () => void;
  toggleAdmin: () => void;
}

const DebugControls: React.FC<DebugControlsProps> = ({
  isLoggedIn,
  isAdmin,
  toggleAuth,
  toggleAdmin
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 opacity-50">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={toggleAuth}
        className="text-xs"
      >
        {isLoggedIn ? 'Выйти (Debug)' : 'Войти (Debug)'}
      </Button>
      {isLoggedIn && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleAdmin}
          className="text-xs"
        >
          {isAdmin ? 'Убрать админа (Debug)' : 'Сделать админом (Debug)'}
        </Button>
      )}
    </div>
  );
};

export default DebugControls;
