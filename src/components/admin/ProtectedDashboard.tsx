
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Dashboard from '@/pages/admin/Dashboard';

const ProtectedDashboard: React.FC = () => {
  const { user } = useAuth();
  
  console.log('ProtectedDashboard - user state:', user);
  
  // Если пользователь не залогинен, перенаправляем на страницу авторизации
  if (!user?.isLoggedIn) {
    console.log('User not logged in, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }
  
  console.log('User logged in, showing Dashboard');
  // Если пользователь залогинен, показываем Dashboard
  return <Dashboard />;
};

export default ProtectedDashboard;
