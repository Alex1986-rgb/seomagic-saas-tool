
import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 pt-16 pb-12">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
