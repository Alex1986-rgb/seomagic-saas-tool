import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BarChart, LayoutDashboard, LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

/**
 * Меню вошедшего пользователя.
 *
 * Компонент был выключен целиком (`return null`) пометкой «тестовый режим» —
 * вместе с ним пропала и кнопка выхода: выйти из аккаунта через интерфейс было
 * нельзя.
 */
interface NavbarUserActionsProps {
  isLoggedIn: boolean;
}

const NavbarUserActions: React.FC<NavbarUserActionsProps> = ({ isLoggedIn }) => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!isLoggedIn) return null;

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: 'Вы вышли из аккаунта' });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Не удалось выйти',
        description: error instanceof Error ? error.message : 'Попробуйте ещё раз',
        variant: 'destructive',
      });
    }
  };

  const email = user.user?.email ?? user.profile?.email ?? '';
  const initial = (email || '?').slice(0, 1).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">{email || 'Мой аккаунт'}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Кабинет
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Профиль
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/audit-history" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            История аудитов
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive">
          <LogOut className="h-4 w-4" />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarUserActions;
