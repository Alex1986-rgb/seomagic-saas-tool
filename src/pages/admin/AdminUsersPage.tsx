
import React from 'react';
import AdminUsers from '@/components/admin/AdminUsers';
import UserStatsCards from '@/components/admin/UserStatsCards';
import UserCharts from '@/components/admin/UserCharts';
import { Users, Monitor, BarChart2 } from "lucide-react";

const AdminUsersPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl">
      {/* DARK Gradient Header */}
      <div className="mb-8 px-6 py-8 rounded-3xl bg-gradient-to-br from-[#1A1F2C] via-[#28213a]/90 to-[#403E43]/95 flex items-center gap-6 border border-[#483194]/30 shadow-2xl">
        <div className="bg-[#28213a]/80 text-primary rounded-full p-5 shadow-lg border border-[#7E69AB]/30">
          <Users className="h-10 w-10 text-[#8B5CF6]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gradient bg-gradient-to-r from-[#9b87f5] via-[#8B5CF6] to-[#0EA5E9] bg-clip-text text-transparent">
            Пользователи
          </h1>
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
