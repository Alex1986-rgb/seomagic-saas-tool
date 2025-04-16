
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkAuthStatus, AuthUser, loginWithEmailPassword, loginWithGoogle, logout, registerUser, toggleAdminStatus } from '@/services/auth/authService';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

// Определяем интерфейс для контекста авторизации
interface AuthContextType {
  user: AuthUser;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
  toggleAdmin: () => void;
  isLoading: boolean;
}

// Создаем контекст с начальными значениями
const AuthContext = createContext<AuthContextType>({
  user: { isLoggedIn: false, isAdmin: false },
  loginWithEmail: async () => {},
  loginWithGoogle: async () => {},
  register: async () => {},
  logoutUser: () => {},
  toggleAdmin: () => {},
  isLoading: true,
});

// Хук для использования контекста в компонентах
export const useAuth = () => useContext(AuthContext);

// Провайдер контекста
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>({ isLoggedIn: false, isAdmin: false });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Проверяем статус авторизации при загрузке и при изменении localStorage
  useEffect(() => {
    const updateAuthStatus = () => {
      const status = checkAuthStatus();
      setUser(status);
      setIsLoading(false);
    };

    updateAuthStatus();
    
    // Слушаем событие изменения localStorage
    window.addEventListener('storage', updateAuthStatus);
    
    return () => {
      window.removeEventListener('storage', updateAuthStatus);
    };
  }, []);

  // Функция для входа с email и паролем
  const loginWithEmail = async (email: string, password: string) => {
    try {
      await loginWithEmailPassword(email, password);
      
      toast({
        title: "Вход выполнен успешно",
        description: "Добро пожаловать в личный кабинет SeoMarket",
      });
      
      navigate('/dashboard');
      
      // Обновляем состояние пользователя
      setUser(checkAuthStatus());
    } catch (error) {
      toast({
        title: "Ошибка входа",
        description: "Неверный email или пароль",
        variant: "destructive",
      });
    }
  };

  // Функция для входа через Google
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
      
      navigate('/dashboard');
      
      // Обновляем состояние пользователя
      setUser(checkAuthStatus());
    } catch (error) {
      toast({
        title: "Ошибка входа через Google",
        description: "Не удалось выполнить вход через Google",
        variant: "destructive",
      });
    }
  };

  // Функция для регистрации
  const register = async (email: string, password: string) => {
    try {
      await registerUser(email, password);
      
      toast({
        title: "Регистрация выполнена успешно",
        description: "Теперь вы можете войти в систему",
      });
      
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Ошибка регистрации",
        description: "Не удалось зарегистрировать пользователя",
        variant: "destructive",
      });
    }
  };

  // Функция для выхода
  const logoutUser = () => {
    logout();
    
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы",
    });
    
    navigate('/');
    
    // Обновляем состояние пользователя
    setUser({ isLoggedIn: false, isAdmin: false });
  };

  // Функция для переключения статуса администратора (только для демо)
  const toggleAdmin = () => {
    toggleAdminStatus();
    // Обновляем состояние пользователя
    setUser(checkAuthStatus());
    
    toast({
      title: "Статус администратора изменен",
      description: user.isAdmin ? "Права администратора отключены" : "Права администратора включены",
    });
  };

  // Предоставляем контекст всем дочерним компонентам
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
