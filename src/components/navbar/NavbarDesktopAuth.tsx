
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogIn, ShieldCheck } from 'lucide-react';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useAuth } from '@/contexts/AuthContext';

const NavbarDesktopAuth: React.FC = () => {
  const { user, logoutUser } = useAuth();
  
  return (
    <div className="hidden md:flex items-center gap-4">
      {user?.isLoggedIn ? (
        <>
          {user?.isAdmin && (
            <Link to="/admin">
              <Button
                variant="glassmorphic"
                size="sm"
                className="flex items-center gap-2 bg-purple-500/80 hover:bg-purple-500"
              >
                <ShieldCheck className="h-4 w-4" />
                Админ
              </Button>
            </Link>
          )}
          <Link to="/profile">
            <Button
              variant="glassmorphic"
              size="sm"
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Профиль
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
            onClick={logoutUser}
          >
            Выйти
          </Button>
        </>
      ) : (
        <>
          <Link to="/admin">
            <Button
              variant="glassmorphic"
              size="sm"
              className="flex items-center gap-2 bg-purple-500/80 hover:bg-purple-500"
            >
              <ShieldCheck className="h-4 w-4" />
              Админ
            </Button>
          </Link>
          <Link to="/auth">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Войти
            </Button>
          </Link>
          <Link to="/auth?tab=register">
            <Button 
              variant="glassmorphic" 
              size="sm"
              className="shadow-primary/20"
            >
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
