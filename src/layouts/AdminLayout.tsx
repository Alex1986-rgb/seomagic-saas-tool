
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Globe, 
  Users, 
  Settings, 
  BarChart,
  Server,
  Bell,
  Grid3X3
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === '/admin' + path ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted';
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card/50 backdrop-blur-sm">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Админ панель</h1>
          <p className="text-sm text-muted-foreground">Управление системой</p>
        </div>
        
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <Link 
                to="/admin" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive('')}`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Дашборд</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/website-analyzer" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive('/website-analyzer')}`}
              >
                <Globe className="h-4 w-4" />
                <span>Анализатор сайтов</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/system-status" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive('/system-status')}`}
              >
                <Server className="h-4 w-4" />
                <span>Состояние системы</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/notifications" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive('/notifications')}`}
              >
                <Bell className="h-4 w-4" />
                <span>Уведомления</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/monitoring" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive('/monitoring')}`}
              >
                <Grid3X3 className="h-4 w-4" />
                <span>Мониторинг</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/users" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive('/users')}`}
              >
                <Users className="h-4 w-4" />
                <span>Пользователи</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/analytics" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive('/analytics')}`}
              >
                <BarChart className="h-4 w-4" />
                <span>Аналитика</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/settings" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive('/settings')}`}
              >
                <Settings className="h-4 w-4" />
                <span>Настройки</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
