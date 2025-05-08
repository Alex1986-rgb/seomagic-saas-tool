
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm, RegisterForm, SocialAuth } from "@/components/auth";
import AuthContainer from "@/components/auth/AuthContainer";
import { useAuth } from '@/contexts/AuthContext';

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user.isLoggedIn) {
      navigate('/dashboard');
    }
  }, [user.isLoggedIn, navigate]);

  // Set focus on container when component mounts
  useEffect(() => {
    document.getElementById('auth-container')?.focus();
  }, []);

  const handleLoginSuccess = () => {
    // The redirection will be handled inside the AuthContext loginWithEmail function
  };

  const handleRegisterSuccess = () => {
    // Redirection will be handled in the context
  };

  return (
    <AuthContainer
      title="Доступ к SeoMarket"
      description="Войдите или создайте аккаунт для доступа к расширенным возможностям"
    >
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">Вход</TabsTrigger>
          <TabsTrigger value="register">Регистрация</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <LoginForm onSuccess={handleLoginSuccess} />
        </TabsContent>
        
        <TabsContent value="register">
          <RegisterForm onSuccess={handleRegisterSuccess} />
        </TabsContent>
      </Tabs>

      <SocialAuth />
    </AuthContainer>
  );
};

export default Auth;
