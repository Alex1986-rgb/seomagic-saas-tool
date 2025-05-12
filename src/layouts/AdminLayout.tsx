
import React, { useState } from 'react';
import { Outlet, useNavigate, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from '@/components/Layout';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Menu, X, LogIn } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMobile();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Redirect to auth if not logged in
  if (!user?.isLoggedIn) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
          <h1 className="text-2xl font-semibold mb-4">Необходим вход в систему</h1>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            Для доступа к панели администратора необходимо войти в систему.
          </p>
          <Button 
            onClick={() => navigate('/auth')} 
            className="flex items-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            Войти
          </Button>
        </div>
      </Layout>
    );
  }
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  return (
    <Layout>
      <HelmetProvider>
        <title>Панель администратора | SeoMarket</title>
      </HelmetProvider>
      
      <div className="flex min-h-screen bg-background">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 z-30 md:hidden">
          <div className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={toggleSidebar}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <h1 className="text-lg font-semibold">Админ-панель</h1>
            <div className="w-8" /> {/* Spacer for alignment */}
          </div>
        </div>

        {/* Sidebar Overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={cn(
            "fixed md:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out bg-sidebar border-r",
            {
              "translate-x-0": sidebarOpen || !isMobile,
              "-translate-x-full": !sidebarOpen && isMobile,
            }
          )}
        >
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-200 ease-in-out",
          "md:pl-0 min-h-screen w-full",
          "pt-16 md:pt-0" // Add top padding for mobile header
        )}>
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default AdminLayout;
