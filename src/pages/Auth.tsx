
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm, RegisterForm, SocialAuth } from "@/components/auth";

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const navigate = useNavigate();

  // Set focus on container when component mounts
  useEffect(() => {
    document.getElementById('auth-container')?.focus();
  }, []);

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  const handleRegisterSuccess = () => {
    // Just switch to login tab
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div 
        id="auth-container"
        className="max-w-md w-full space-y-8 bg-card p-8 rounded-xl shadow-lg"
        tabIndex={-1}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold">Доступ к SeoMarket</h1>
          <p className="text-muted-foreground mt-2">
            Войдите или создайте аккаунт для доступа к расширенным возможностям
          </p>
        </div>

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
      </div>
    </div>
  );
};

export default Auth;
