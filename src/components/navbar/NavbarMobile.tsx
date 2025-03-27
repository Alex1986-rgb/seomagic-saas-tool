
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle, Home, LogOut } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface NavbarMobileProps {
  isOpen: boolean;
  navItems: Array<{
    name: string;
    href: string;
  }>;
  isLoggedIn: boolean;
  isAdmin: boolean;
  toggleAuth: () => void;
}

const NavbarMobile: React.FC<NavbarMobileProps> = ({
  isOpen,
  navItems,
  isLoggedIn,
  isAdmin,
  toggleAuth
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    toggleAuth();
    navigate('/');
    toast({
      title: "Выход выполнен успешно",
      description: "Вы вышли из своего аккаунта",
    });
  };

  // If menu is not open, don't render anything at all
  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="md:hidden fixed top-16 inset-x-0 bg-background/90 backdrop-blur-md shadow-lg z-40 border-t border-border"
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="pt-3 pb-5 px-4 flex flex-col gap-3">
            <nav className="grid gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center px-3 py-2 text-base transition-colors rounded-md hover:bg-accent"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="h-px w-full bg-border my-2" />

            <div className="flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 transition-colors rounded-md hover:bg-accent"
                  >
                    <UserCircle className="h-5 w-5" />
                    <span>Личный кабинет</span>
                  </Link>

                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-3 py-2 transition-colors rounded-md hover:bg-accent"
                  >
                    <Home className="h-5 w-5" />
                    <span>Панель управления</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-3 py-2 transition-colors rounded-md hover:bg-accent"
                    >
                      <span className="h-5 w-5">👑</span>
                      <span>Админ панель</span>
                    </Link>
                  )}

                  <Button
                    variant="destructive"
                    className="mt-2 w-full justify-start gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Выйти</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full justify-center">
                    <Link to="/auth">Войти</Link>
                  </Button>
                  <Button asChild className="w-full justify-center">
                    <Link to="/auth?tab=register">Регистрация</Link>
                  </Button>
                </>
              )}
            </div>

            <div className="h-px w-full bg-border my-2" />

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Тема:</span>
              <ThemeSwitcher />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NavbarMobile;
