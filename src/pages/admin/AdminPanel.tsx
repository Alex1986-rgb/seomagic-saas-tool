
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AdminPanel: React.FC = () => {
  // Страница-переадресация: сам раздел закрыт AdminRouteGuard в App.tsx.
  return <Navigate to="/admin/" replace />;
};

export default AdminPanel;
