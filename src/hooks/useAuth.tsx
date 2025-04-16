
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { authService } from '@/services/authService';
import { useToast } from './use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    authService.getCurrentSession()
      .then((session) => {
        setSession(session);
        setUser(session?.user ?? null);
      })
      .finally(() => setLoading(false));

    const { data: { subscription } } = authService.onAuthStateChange((session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { session } = await authService.signIn(email, password);
      setSession(session);
      setUser(session?.user ?? null);
    } catch (error) {
      toast({
        title: "Ошибка входа",
        description: error instanceof Error ? error.message : "Не удалось войти",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { session } = await authService.signUp(email, password);
      setSession(session);
      setUser(session?.user ?? null);
    } catch (error) {
      toast({
        title: "Ошибка регистрации",
        description: error instanceof Error ? error.message : "Не удалось зарегистрироваться",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setSession(null);
      setUser(null);
    } catch (error) {
      toast({
        title: "Ошибка выхода",
        description: error instanceof Error ? error.message : "Не удалось выйти",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
