
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminPanel: React.FC = () => {
  // Redirect to the admin dashboard
  return <Navigate to="/admin" replace />;
};

export default AdminPanel;
