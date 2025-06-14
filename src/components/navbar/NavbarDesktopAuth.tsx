import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogIn, ShieldCheck } from 'lucide-react';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

const NavbarDesktopAuth: React.FC = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="hidden md:flex items-center gap-4">
      {/* Admin Button - Always Visible */}
      <Link to="/admin">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30"
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Админ</span>
          <Badge variant="default" className="ml-1 bg-purple-500 text-[0.6rem] py-0 px-1.5">
            ADMIN
          </Badge>
        </Button>
      </Link>
      
      {user?.isLoggedIn ? (
        <>
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
            onClick={logout}
          >
            Выйти
          </Button>
        </>
      ) : (
        <>
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
