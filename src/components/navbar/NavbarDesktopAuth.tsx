import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogIn, ShieldCheck } from 'lucide-react';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

const NavbarDesktopAuth: React.FC = () => {
  const { user, logout } = useAuth();
  
  // ⚠️ TESTING MODE - Hide auth UI, show only admin and theme switcher
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
      
      <ThemeSwitcher />
    </div>
  );
};

export default NavbarDesktopAuth;
