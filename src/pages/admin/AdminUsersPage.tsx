
import React from 'react';
import AdminUsers from '@/components/admin/AdminUsers';
import UserStatsCards from '@/components/admin/UserStatsCards';
import UserCharts from '@/components/admin/UserCharts';

const AdminUsersPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Пользователи</h1>
      <UserStatsCards />
      <UserCharts />
      <div className="mt-10">
        <AdminUsers />
      </div>
    </div>
  );
};

export default AdminUsersPage;
