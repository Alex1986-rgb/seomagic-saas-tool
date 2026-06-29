import React from 'react';
import Dashboard from '@/pages/Dashboard';

// Кабинет клиента использует ту же панель с вкладками, что и /dashboard.
const ClientDashboard: React.FC = () => {
  return <Dashboard />;
};

export default ClientDashboard;
