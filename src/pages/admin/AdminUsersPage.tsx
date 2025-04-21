
import React from 'react';
import AdminUsers from '@/components/admin/AdminUsers';
import UserStatsCards from '@/components/admin/UserStatsCards';
import UserCharts from '@/components/admin/UserCharts';
import { Users, Monitor, BarChart2 } from "lucide-react";

const AdminUsersPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl">
      <div className="mb-8 px-6 py-8 rounded-3xl bg-gradient-to-br from-blue-50 via-white/60 to-purple-50 flex items-center gap-6 border border-primary/15 shadow-2xl">
        <div className="bg-primary/20 text-primary rounded-full p-5 shadow-lg">
          <Users className="h-10 w-10" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gradient-primary">Пользователи</h1>
          <div className="flex gap-4 text-muted-foreground">
            <BarChart2 className="h-5 w-5" /> Графики активности
            <Monitor className="h-5 w-5" /> Онлайн-сессии
          </div>
        </div>
      </div>
      <UserStatsCards />
      <UserCharts />
      <div className="mt-10">
        <AdminUsers />
      </div>
    </div>
  );
};

export default AdminUsersPage;
