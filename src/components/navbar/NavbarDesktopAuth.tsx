
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useAuth } from '@/contexts/AuthContext';

const NavbarDesktopAuth: React.FC = () => {
  const { user, logoutUser } = useAuth();
  
  return (
    <div className="hidden md:flex items-center gap-4">
      {user?.isLoggedIn ? (
        <>
          <Link to="/profile">
            <Button
              variant="ghost"
              size="sm"
            >
              <User className="h-5 w-5 mr-2" />
              Профиль
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={logoutUser}
          >
            Выйти
          </Button>
        </>
      ) : (
        <>
          <Link to="/auth">
            <Button
              variant="ghost"
              size="sm"
            >
              Войти
            </Button>
          </Link>
          <Link to="/auth?tab=register">
            <Button size="sm">
              Регистрация
            </Button>
          </Link>
        </>
      )}
      <ThemeSwitcher />
    </div>
  );
};

export default NavbarDesktopAuth;
