
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  
  const handleToggleAuth = () => {
    toggleAuth();
    
    toast({
      title: isLoggedIn ? "Выход выполнен (Debug)" : "Вход выполнен (Debug)",
      description: isLoggedIn ? "Вы вышли из системы" : "Вы вошли в систему",
    });
  };
  
  const handleToggleAdmin = () => {
    toggleAdmin();
    
    toast({
      title: isAdmin ? "Роль администратора отключена (Debug)" : "Роль администратора включена (Debug)",
      description: isAdmin ? "Вы больше не администратор" : "Вы теперь администратор",
    });
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 bg-card p-3 rounded-lg shadow-lg border border-border">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleToggleAuth}
        className="text-xs"
      >
        {isLoggedIn ? 'Выйти (Debug)' : 'Войти (Debug)'}
      </Button>
      {isLoggedIn && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleToggleAdmin}
          className="text-xs"
        >
          {isAdmin ? 'Убрать админа (Debug)' : 'Сделать админом (Debug)'}
        </Button>
      )}
    </div>
  );
};

export default DebugControls;
