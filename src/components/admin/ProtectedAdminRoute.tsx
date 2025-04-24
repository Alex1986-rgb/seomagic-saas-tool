
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const ProtectedAdminRoute: React.FC = () => {
  const { isAdmin, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return isAdmin ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedAdminRoute;
