
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm, RegisterForm, SocialAuth } from "@/components/auth";
import AuthContainer from "@/components/auth/AuthContainer";
import { useAuth } from '@/contexts/AuthContext';

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (!isLoading && user.isLoggedIn) {
      navigate(redirectUrl);
    }
  }, [user.isLoggedIn, isLoading, navigate, redirectUrl]);

  // Set focus on container when component mounts
  useEffect(() => {
    document.getElementById('auth-container')?.focus();
  }, []);

  const handleSuccess = () => {
    // Redirection will be handled by the auth state change
    navigate(redirectUrl);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
          <LoginForm onSuccess={handleSuccess} />
        </TabsContent>
        
        <TabsContent value="register">
          <RegisterForm onSuccess={handleSuccess} />
        </TabsContent>
      </Tabs>

      <SocialAuth />
    </AuthContainer>
  );
};

export default Auth;
