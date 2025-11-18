
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AdminPanel: React.FC = () => {
  // ⚠️ TESTING MODE - Allow access without authentication
  return <Navigate to="/admin/" replace />;
};

export default AdminPanel;
