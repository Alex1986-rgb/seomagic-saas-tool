
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, X, ChevronDown } from 'lucide-react';
import Logo from '../common/Logo';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: 'Аудит', path: '/audit' },
    { name: 'Позиции', path: '/position-tracker' },
    { name: 'Возможности', path: '/features' },
    { name: 'Тарифы', path: '/pricing' },
    { name: 'О нас', path: '/about' },
    { name: 'Блог', path: '/blog' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>
            
            <nav className="hidden ml-10 space-x-8 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-primary'
                      : 'text-foreground/90 hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <Button
                variant="outline"
                className="hidden md:flex"
                onClick={() => navigate('/dashboard')}
              >
                Личный кабинет
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="hidden md:flex"
                  onClick={() => navigate('/auth')}
                >
                  Войти
                </Button>
                <Button
                  className="hidden md:flex"
                  onClick={() => navigate('/auth')}
                >
                  Регистрация
                </Button>
              </>
            )}

            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Открыть меню</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center py-4">
                      <Logo />
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <X className="h-6 w-6" />
                          <span className="sr-only">Закрыть меню</span>
                        </Button>
                      </SheetTrigger>
                    </div>
                    
                    <nav className="flex flex-col space-y-4 mt-8">
                      {navLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          className={`text-lg font-medium transition-colors ${
                            isActive(link.path)
                              ? 'text-primary'
                              : 'text-foreground/90 hover:text-primary'
                          }`}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </nav>
                    
                    <div className="mt-auto pb-8 pt-4 flex flex-col space-y-4">
                      {user ? (
                        <Button
                          onClick={() => navigate('/dashboard')}
                        >
                          Личный кабинет
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => navigate('/auth')}
                          >
                            Войти
                          </Button>
                          <Button
                            onClick={() => navigate('/auth')}
                          >
                            Регистрация
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
