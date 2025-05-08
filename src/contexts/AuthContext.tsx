
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkAuthStatus, AuthUser, loginWithEmailPassword, loginWithGoogle, logout, registerUser, toggleAdminStatus } from '@/services/auth/authService';
import { useToast } from "@/hooks/use-toast";

// Defining interface for auth context
interface AuthContextType {
  user: AuthUser;
  loginWithEmail: (email: string, password: string, redirectUrl?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
  toggleAdmin: () => void;
  isLoading: boolean;
}

// Creating context with initial values
const AuthContext = createContext<AuthContextType>({
  user: { isLoggedIn: false, isAdmin: false },
  loginWithEmail: async () => {},
  loginWithGoogle: async () => {},
  register: async () => {},
  logoutUser: () => {},
  toggleAdmin: () => {},
  isLoading: true,
});

// Hook for using the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>({ isLoggedIn: false, isAdmin: false });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check auth status on mount and when localStorage changes
  useEffect(() => {
    const updateAuthStatus = () => {
      const status = checkAuthStatus();
      setUser(status);
      setIsLoading(false);
    };

    updateAuthStatus();
    
    // Listen for localStorage changes
    window.addEventListener('storage', updateAuthStatus);
    
    return () => {
      window.removeEventListener('storage', updateAuthStatus);
    };
  }, []);

  // Email login function
  const loginWithEmail = async (email: string, password: string, redirectUrl?: string) => {
    try {
      await loginWithEmailPassword(email, password);
      
      toast({
        title: "Вход выполнен успешно",
        description: "Добро пожаловать в личный кабинет SeoMarket",
      });
      
      // Use window.location for navigation instead of useNavigate
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        window.location.href = '/dashboard';
      }
      
      // Update user state
      setUser(checkAuthStatus());
    } catch (error) {
      toast({
        title: "Ошибка входа",
        description: "Неверный email или пароль",
        variant: "destructive",
      });
    }
  };

  // Google login function
  const handleGoogleLogin = async () => {
    try {
      toast({
        title: "Выполняется вход через Google",
        description: "Пожалуйста, подождите...",
      });
      
      await loginWithGoogle();
      
      toast({
        title: "Вход через Google выполнен успешно",
        description: "Добро пожаловать в личный кабинет SeoMarket",
      });
      
      // Use window.location for navigation
      window.location.href = '/dashboard';
      
      // Update user state
      setUser(checkAuthStatus());
    } catch (error) {
      toast({
        title: "Ошибка входа через Google",
        description: "Не удалось выполнить вход через Google",
        variant: "destructive",
      });
    }
  };

  // Registration function
  const register = async (email: string, password: string) => {
    try {
      await registerUser(email, password);
      
      toast({
        title: "Регистрация выполнена успешно",
        description: "Теперь вы можете войти в систему",
      });
      
      // Use window.location for navigation
      window.location.href = '/auth';
    } catch (error) {
      toast({
        title: "Ошибка регистрации",
        description: "Не удалось зарегистрировать пользователя",
        variant: "destructive",
      });
    }
  };

  // Logout function
  const logoutUser = () => {
    logout();
    
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы",
    });
    
    // Use window.location for navigation
    window.location.href = '/';
    
    // Update user state
    setUser({ isLoggedIn: false, isAdmin: false });
  };

  // Toggle admin status function (for demo only)
  const toggleAdmin = () => {
    toggleAdminStatus();
    // Update user state
    setUser(checkAuthStatus());
    
    toast({
      title: "Статус администратора изменен",
      description: user.isAdmin ? "Права администратора отключены" : "Права администратора включены",
    });
  };

  // Provide context to children
  return (
    <AuthContext.Provider
      value={{
        user,
        loginWithEmail,
        loginWithGoogle: handleGoogleLogin,
        register,
        logoutUser,
        toggleAdmin,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
