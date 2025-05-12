
import React from 'react';
import { Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  
  // Redirect to auth page if not logged in
  if (!user?.isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }
  
  // Redirect to the admin dashboard
  return (
    <HelmetProvider>
      <Navigate to="/admin/" replace />
    </HelmetProvider>
  );
};

export default AdminPanel;
