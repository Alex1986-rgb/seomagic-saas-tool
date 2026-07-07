import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FullscreenLoader } from '@/components/ui/loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Require the admin role in addition to being logged in. */
  requireAdmin?: boolean;
}

/**
 * Gate a route behind authentication.
 *
 * While the auth state is resolving we show a loader so we never flash the
 * protected content or bounce a logged-in user to /auth. Unauthenticated users
 * are redirected to /auth with the intended location preserved in state so the
 * login flow can send them back. When `requireAdmin` is set, non-admins are
 * sent to the dashboard.
 *
 * Note: this is defence-in-depth for UX only — the real authorization is
 * enforced by Supabase RLS policies and the edge functions' own auth checks.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <FullscreenLoader text="Проверка доступа..." />;
  }

  if (!user.isLoggedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
