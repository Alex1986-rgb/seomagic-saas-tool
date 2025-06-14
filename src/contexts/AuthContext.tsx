
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { 
  getCurrentUser, 
  signUpUser, 
  signInWithEmail, 
  signInWithGoogle, 
  signOut,
  AuthUser,
  UserProfile
} from '@/services/auth/authService';
import { useToast } from "@/hooks/use-toast";

// Defining interface for auth context
interface AuthContextType {
  user: AuthUser;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

// Creating context with initial values
const AuthContext = createContext<AuthContextType>({
  user: { isLoggedIn: false, isAdmin: false },
  login: async () => {},
  loginWithGoogle: async () => {},
  register: async () => {},
  logout: async () => {},
  isLoading: true,
  refreshUser: async () => {},
});

// Hook for using the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>({ isLoggedIn: false, isAdmin: false });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Function to refresh user data
  const refreshUser = async () => {
    const userData = await getCurrentUser();
    setUser(userData);
  };

  // Check auth status on mount and listen for changes
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        // Defer the user data refresh to avoid callback conflicts
        setTimeout(async () => {
          const userData = await getCurrentUser();
          setUser(userData);
          setIsLoading(false);
        }, 0);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Email login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await signInWithEmail(email, password);
      
      if (error) {
        toast({
          title: "Ошибка входа",
          description: error.message || "Неверный email или пароль",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Вход выполнен успешно",
        description: "Добро пожаловать в личный кабинет SeoMarket",
      });

      // User state will be updated by the auth state change listener
    } catch (error: any) {
      toast({
        title: "Ошибка входа",
        description: error?.message || "Произошла ошибка при входе",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Google login function
  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await signInWithGoogle();
      
      if (error) {
        toast({
          title: "Ошибка входа через Google",
          description: error.message || "Не удалось выполнить вход через Google",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Выполняется вход через Google",
        description: "Пожалуйста, подождите...",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка входа через Google",
        description: error?.message || "Произошла ошибка при входе через Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Registration function
  const register = async (email: string, password: string, fullName?: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await signUpUser(email, password, fullName);
      
      if (error) {
        toast({
          title: "Ошибка регистрации",
          description: error.message || "Не удалось зарегистрировать пользователя",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Регистрация выполнена успешно",
        description: "Проверьте вашу почту для подтверждения аккаунта",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка регистрации",
        description: error?.message || "Произошла ошибка при регистрации",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await signOut();
      
      if (error) {
        toast({
          title: "Ошибка выхода",
          description: error.message || "Не удалось выйти из системы",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Выход выполнен",
        description: "Вы успешно вышли из системы",
      });

      // User state will be updated by the auth state change listener
    } catch (error: any) {
      toast({
        title: "Ошибка выхода",
        description: error?.message || "Произошла ошибка при выходе",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Provide context to children
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        register,
        logout,
        isLoading,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
