
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserCircle, ChevronDown } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface NavbarDesktopAuthProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  toggleAuth: () => void;
}

const NavbarDesktopAuth: React.FC<NavbarDesktopAuthProps> = ({ 
  isLoggedIn, 
  isAdmin, 
  toggleAuth 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Проверяем, находимся ли мы на главной странице
  const isHomePage = location.pathname === '/';
  
  const handleLogout = () => {
    toggleAuth();
    navigate('/');
    toast({
      title: "Выход выполнен успешно",
      description: "Вы вышли из своего аккаунта",
    });
  };
  
  return (
    <div className="hidden md:flex items-center space-x-4">
      <ThemeSwitcher />
      
      {isLoggedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <UserCircle className="h-5 w-5" />
              <span>Мой аккаунт</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer">Личный кабинет</Link>
            </DropdownMenuItem>
            {!isHomePage && (
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="cursor-pointer">Панель управления</Link>
              </DropdownMenuItem>
            )}
            {isAdmin && !isHomePage && (
              <DropdownMenuItem asChild>
                <Link to="/admin" className="cursor-pointer">Админ панель</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={handleLogout}
              className="cursor-pointer text-red-500"
            >
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Button variant="ghost" asChild>
            <Link to="/auth">Войти</Link>
          </Button>
          <Button asChild>
            <Link to="/auth?tab=register">Регистрация</Link>
          </Button>
        </>
      )}
    </div>
  );
};

export default NavbarDesktopAuth;
