
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  
  // Redirect to auth page if not logged in
  if (!user?.isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }
  
  // Redirect directly to the admin dashboard
  return <Navigate to="/admin/" replace />;
};

export default AdminPanel;
