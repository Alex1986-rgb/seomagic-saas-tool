import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

/**
 * Guard for the admin area. Requires an authenticated user with the `admin`
 * role (resolved server-side from the `user_roles` table via authService).
 * Non-admins are redirected to /dashboard, anonymous users to /auth.
 */
const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  return <ProtectedRoute requireAdmin>{children}</ProtectedRoute>;
};

export default AdminRouteGuard;
