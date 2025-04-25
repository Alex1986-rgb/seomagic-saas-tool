
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Globe, Bell, MonitorCheck, Settings, Users, BarChart, 
  Server, Database, File, Search, Activity, CreditCard, Shield, Webhook
} from 'lucide-react';
import SidebarGroup from './SidebarGroup';
import SidebarLink from './SidebarLink';
import { ScrollArea } from "../ui/scroll-area";

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <div className="h-full bg-card border-r flex flex-col">
      <div className="p-4 border-b">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary text-white p-1 rounded-sm">
            <LayoutDashboard size={18} />
          </div>
          <span className="font-medium text-lg">SeoMarket</span>
        </Link>
      </div>
      
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-2 px-2">
          <SidebarLink 
            to="/admin" 
            icon={<LayoutDashboard size={18} />} 
            active={currentPath === '/admin'}
          >
            Дашборд
          </SidebarLink>
          
          <SidebarGroup title="Анализ">
            <SidebarLink 
              to="/admin/website-analyzer" 
              icon={<Globe size={18} />} 
              active={currentPath.includes('/admin/website-analyzer')}
            >
              Анализатор сайтов
            </SidebarLink>
            <SidebarLink 
              to="/admin/positions" 
              icon={<Search size={18} />} 
              active={currentPath.includes('/admin/positions')}
            >
              Позиции
            </SidebarLink>
            <SidebarLink 
              to="/admin/audits" 
              icon={<File size={18} />} 
              active={currentPath.includes('/admin/audits')}
            >
              Аудиты
            </SidebarLink>
            <SidebarLink 
              to="/admin/proxies" 
              icon={<Webhook size={18} />} 
              active={currentPath.includes('/admin/proxies')}
            >
              Управление прокси
            </SidebarLink>
          </SidebarGroup>
          
          <SidebarGroup title="Управление">
            <SidebarLink 
              to="/admin/sites" 
              icon={<Globe size={18} />} 
              active={currentPath.includes('/admin/sites')}
            >
              Сайты
            </SidebarLink>
            <SidebarLink 
              to="/admin/hosting" 
              icon={<Server size={18} />} 
              active={currentPath.includes('/admin/hosting')}
            >
              Хостинг
            </SidebarLink>
            <SidebarLink 
              to="/admin/users" 
              icon={<Users size={18} />} 
              active={currentPath.includes('/admin/users')}
            >
              Пользователи
            </SidebarLink>
            <SidebarLink 
              to="/admin/payments" 
              icon={<CreditCard size={18} />} 
              active={currentPath.includes('/admin/payments')}
            >
              Платежи
            </SidebarLink>
          </SidebarGroup>
          
          <SidebarGroup title="Мониторинг">
            <SidebarLink 
              to="/admin/analytics" 
              icon={<BarChart size={18} />} 
              active={currentPath.includes('/admin/analytics')}
            >
              Аналитика
            </SidebarLink>
            <SidebarLink 
              to="/admin/monitoring" 
              icon={<Activity size={18} />} 
              active={currentPath.includes('/admin/monitoring')}
            >
              Мониторинг
            </SidebarLink>
            <SidebarLink 
              to="/admin/system-status" 
              icon={<MonitorCheck size={18} />} 
              active={currentPath.includes('/admin/system-status')}
            >
              Статус системы
            </SidebarLink>
            <SidebarLink 
              to="/admin/notifications" 
              icon={<Bell size={18} />} 
              active={currentPath.includes('/admin/notifications')}
            >
              Уведомления
            </SidebarLink>
          </SidebarGroup>
          
          <SidebarGroup title="Настройки">
            <SidebarLink 
              to="/admin/settings" 
              icon={<Settings size={18} />} 
              active={currentPath === '/admin/settings'}
            >
              Настройки
            </SidebarLink>
            <SidebarLink 
              to="/admin/system" 
              icon={<Database size={18} />} 
              active={currentPath.includes('/admin/system')}
            >
              Система
            </SidebarLink>
            <SidebarLink 
              to="/admin/system/security" 
              icon={<Shield size={18} />} 
              active={currentPath.includes('/admin/system/security')}
            >
              Безопасность
            </SidebarLink>
          </SidebarGroup>
        </nav>
      </ScrollArea>
    </div>
  );
};

export default AdminSidebar;
