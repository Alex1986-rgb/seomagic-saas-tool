
import React from 'react';
import Dashboard from '@/pages/admin/Dashboard';

const ProtectedDashboard: React.FC = () => {
  console.log('ProtectedDashboard rendering - showing Dashboard');
  
  return <Dashboard />;
};

export default ProtectedDashboard;
