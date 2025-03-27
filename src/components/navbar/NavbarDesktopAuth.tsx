
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import ThemeSwitcher from '@/components/ThemeSwitcher';

interface NavbarDesktopAuthProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  toggleAuth: () => void;
}

const NavbarDesktopAuth: React.FC<NavbarDesktopAuthProps> = ({ isLoggedIn, isAdmin, toggleAuth }) => {
  const navigate = useNavigate();
  
  return (
    <div className="hidden md:flex items-center gap-4">
      {isLoggedIn ? (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
          >
            <User className="h-5 w-5 mr-2" />
            Профиль
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAuth}
          >
            Выйти
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/auth')}
          >
            Войти
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('/auth?tab=register')}
          >
            Регистрация
          </Button>
        </>
      )}
      <ThemeSwitcher />
    </div>
  );
};

export default NavbarDesktopAuth;
