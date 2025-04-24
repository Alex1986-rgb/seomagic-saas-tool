
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuthStatus, AuthUser } from '@/services/auth/authService';

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = () => {
      const { isLoggedIn, isAdmin } = checkAuthStatus();
      
      setIsAdmin(isAdmin);
      setIsLoading(false);
      
      if (!isLoggedIn || !isAdmin) {
        navigate('/auth', { replace: true });
      }
    };

    checkAdminStatus();
    
    // Слушаем изменения статуса аутентификации
    const handleStorageChange = () => {
      checkAdminStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  return { isAdmin, isLoading };
}
