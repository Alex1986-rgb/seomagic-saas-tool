
import React from 'react';
import { Navigate } from 'react-router-dom';
import Dashboard from '@/pages/admin/Dashboard';

const ProtectedDashboard: React.FC = () => {
  // В реальном приложении здесь будет проверка аутентификации
  const isAuthenticated = true; // Временная заглушка
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <Dashboard />;
};

export default ProtectedDashboard;
