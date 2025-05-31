
import React from 'react';
import { useLocation } from 'react-router-dom';
import Dashboard from '@/pages/admin/Dashboard';

const ProtectedDashboard: React.FC = () => {
  const location = useLocation();
  console.log('ProtectedDashboard rendering at path:', location.pathname);
  console.log('ProtectedDashboard - показываем Dashboard');
  
  return <Dashboard />;
};

export default ProtectedDashboard;
