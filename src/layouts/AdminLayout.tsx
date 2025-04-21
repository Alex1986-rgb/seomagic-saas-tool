
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <Layout>
      <Helmet>
        <title>Панель администратора | SeoMarket</title>
      </Helmet>
      
      <div className="flex min-h-screen">
        {/* Мобильная кнопка переключения бокового меню */}
        <div className="md:hidden fixed top-20 left-4 z-50">
          <Button 
            size="sm" 
            variant="outline" 
            className="rounded-full p-2" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Боковое меню для мобильных (перекрывает экран) */}
        <div className={`md:hidden fixed inset-0 z-40 ${sidebarOpen ? 'block' : 'hidden'}`}>
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="relative w-64 h-full">
            <AdminSidebar />
          </div>
        </div>
        
        {/* Боковое меню для десктопа */}
        <div className={`hidden md:block ${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300`}>
          <AdminSidebar />
        </div>
        
        {/* Основной контент */}
        <div className="flex-1 pt-20">
          <Outlet />
        </div>
      </div>
    </Layout>
  );
};

export default AdminLayout;
