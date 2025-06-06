
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';

const AdminLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[#1A1F2C] via-[#191B22] to-[#403E43]">
        <AdminSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-4 p-4 border-b border-border/40">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold text-foreground">Админ-панель</h1>
          </div>
          <div className="flex-1 overflow-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
