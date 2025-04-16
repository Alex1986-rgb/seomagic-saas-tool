
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';

export const Routes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <RouterRoutes>
      <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" replace />} />
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/auth"} replace />} />
    </RouterRoutes>
  );
};
