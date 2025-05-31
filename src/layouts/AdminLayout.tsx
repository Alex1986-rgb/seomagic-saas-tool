
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMobile();
  const location = useLocation();
  
  console.log('AdminLayout rendering at path:', location.pathname);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  return (
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
          "fixed md:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out bg-card border-r",
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
          <Helmet>
            <title>Панель администратора | SeoMarket</title>
          </Helmet>
          <div>
            <p className="text-sm text-muted-foreground mb-4">Debug: Rendering Outlet for path: {location.pathname}</p>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
