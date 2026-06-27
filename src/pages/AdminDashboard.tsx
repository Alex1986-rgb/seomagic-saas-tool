import React from 'react';
import { Navigate } from 'react-router-dom';

// Полноценная админ-панель реализована в маршрутах /admin/* (routes/AdminRoutes.tsx).
// Этот маршрут оставлен для обратной совместимости и перенаправляет на неё.
const AdminDashboard: React.FC = () => {
  return <Navigate to="/admin" replace />;
};

export default AdminDashboard;
