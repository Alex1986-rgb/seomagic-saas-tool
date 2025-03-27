
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeSwitcher from "../ThemeSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  BarChart, 
  Search, 
  Settings, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is logged in (simplified for demo)
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    
    toast({
      title: "Выход из системы",
      description: "Вы успешно вышли из системы",
    });
    
    navigate('/');
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">SeoMarket</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm ml-6">
            <Link to="/" className="transition-colors hover:text-foreground/80 text-foreground/60">Главная</Link>
            <Link to="/audit" className="transition-colors hover:text-foreground/80 text-foreground/60">SEO Аудит</Link>
            <Link to="/positions" className="transition-colors hover:text-foreground/80 text-foreground/60">Позиции</Link>
            <Link to="/pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">Цены</Link>
            <Link to="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">О нас</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            
            <ThemeSwitcher />
            
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatar.jpg" alt="@user" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Пользователь</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        user@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Панель управления</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Профиль</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Настройки</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/reports')}>
                    <BarChart className="mr-2 h-4 w-4" />
                    <span>Отчеты</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Выйти</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate('/auth')} variant="default" size="sm">
                Войти
              </Button>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            className="md:hidden" 
            size="icon" 
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t py-4">
          <div className="container space-y-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="px-2 py-1 hover:bg-accent rounded-md" onClick={toggleMenu}>
                Главная
              </Link>
              <Link to="/audit" className="px-2 py-1 hover:bg-accent rounded-md" onClick={toggleMenu}>
                SEO Аудит
              </Link>
              <Link to="/positions" className="px-2 py-1 hover:bg-accent rounded-md" onClick={toggleMenu}>
                Позиции
              </Link>
              <Link to="/pricing" className="px-2 py-1 hover:bg-accent rounded-md" onClick={toggleMenu}>
                Цены
              </Link>
              <Link to="/about" className="px-2 py-1 hover:bg-accent rounded-md" onClick={toggleMenu}>
                О нас
              </Link>
            </nav>
            
            <div className="flex items-center gap-2 pt-2 border-t">
              <ThemeSwitcher />
              
              {isLoggedIn ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatar.jpg" alt="@user" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Пользователь</p>
                      <p className="text-xs text-muted-foreground">user@example.com</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Выйти
                  </Button>
                </div>
              ) : (
                <Button onClick={() => navigate('/auth')} variant="default" className="w-full">
                  Войти
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
