
import React from 'react';
import AdminUsers from '@/components/admin/AdminUsers';
import UserStatsCards from '@/components/admin/UserStatsCards';
import UserCharts from '@/components/admin/UserCharts';

const AdminUsersPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Пользователи</h2>
      <UserStatsCards />
      <UserCharts />
      <div className="mt-8">
        <AdminUsers />
      </div>
    </div>
  );
};

export default AdminUsersPage;
