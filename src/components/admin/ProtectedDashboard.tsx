
import React from 'react';
import Dashboard from '@/pages/admin/Dashboard';

const ProtectedDashboard: React.FC = () => {
  // В будущем здесь будет проверка авторизации
  return <Dashboard />;
};

export default ProtectedDashboard;
