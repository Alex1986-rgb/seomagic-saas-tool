import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogIn, ShieldCheck } from 'lucide-react';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import NavbarUserActions from './NavbarUserActions';

/**
 * Правая часть шапки.
 *
 * Здесь был оставлен «тестовый режим»: кнопки входа и выхода скрыли совсем, а
 * вместо них всем посетителям показывали кнопку «Админ» со значком ADMIN.
 * Войти через интерфейс было нельзя, зато кнопка в закрытый раздел была у
 * каждого. Теперь вход виден тем, кто не вошёл, а кнопка админки — только
 * администратору.
 */
const NavbarDesktopAuth: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="hidden md:flex items-center gap-3">
      {user.isAdmin && (
        <Link to="/admin">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Админ</span>
          </Button>
        </Link>
      )}

      {user.isLoggedIn ? (
        <>
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span>Кабинет</span>
            </Button>
          </Link>
          <NavbarUserActions isLoggedIn />
        </>
      ) : (
        <Link to="/auth">
          <Button size="sm" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            <span>Войти</span>
          </Button>
        </Link>
      )}

      <ThemeSwitcher />
    </div>
  );
};

export default NavbarDesktopAuth;
