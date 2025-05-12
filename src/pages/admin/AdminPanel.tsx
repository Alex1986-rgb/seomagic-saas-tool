
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

const AdminPanel: React.FC = () => {
  // Simply redirect to the admin dashboard
  return (
    <HelmetProvider>
      <Navigate to="/admin/" replace />
    </HelmetProvider>
  );
};

export default AdminPanel;
