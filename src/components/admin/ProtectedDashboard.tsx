
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Dashboard from '@/pages/admin/Dashboard';

const ProtectedDashboard: React.FC = () => {
  const { user } = useAuth();
  
  console.log('ProtectedDashboard - user state:', user);
  
  // Если пользователь не залогинен, перенаправляем на страницу авторизации
  if (!user?.isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <h1 className="text-2xl font-semibold mb-4">Необходим вход в систему</h1>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          Для доступа к панели администратора необходимо войти в систему.
        </p>
        <Navigate to="/auth" replace />
      </div>
    );
  }
  
  // Если пользователь залогинен, показываем Dashboard
  return <Dashboard />;
};

export default ProtectedDashboard;
