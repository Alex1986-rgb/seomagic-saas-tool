
import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Monitor,
  Users,
  FileText,
  Search,
  CreditCard,
  Settings,
  Database,
  Shield,
  Bell,
  BarChart,
  Server,
  Globe,
  ChartBar
} from 'lucide-react';
import SidebarLink from './SidebarLink';
import SidebarGroup from './SidebarGroup';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="w-64 h-full bg-background border-r flex flex-col overflow-auto">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Панель администратора</h2>
        <p className="text-sm text-muted-foreground">Управление SeoMarket</p>
      </div>
      <div className="p-4 flex-1 space-y-4">
        <SidebarGroup title="Основные разделы" defaultOpen={true}>
          <SidebarLink
            to="/admin"
            icon={<LayoutDashboard className="h-4 w-4" />}
            label="Дашборд"
            active={currentPath === "/admin"}
          />
          <SidebarLink
            to="/admin/monitoring"
            icon={<Monitor className="h-4 w-4" />}
            label="Мониторинг"
            active={currentPath === "/admin/monitoring"}
          />
          <SidebarLink
            to="/admin/website-analyzer"
            icon={<Search className="h-4 w-4" />}
            label="Анализатор веб-сайтов"
            active={currentPath === "/admin/website-analyzer"}
          />
          <SidebarLink
            to="/admin/system-status"
            icon={<ChartBar className="h-4 w-4" />}
            label="Статус системы"
            active={currentPath === "/admin/system-status"}
          />
          <SidebarLink
            to="/admin/notifications"
            icon={<Bell className="h-4 w-4" />}
            label="Уведомления"
            active={currentPath === "/admin/notifications"}
          />
        </SidebarGroup>

        <SidebarGroup title="Управление">
          <SidebarLink
            to="/admin/users"
            icon={<Users className="h-4 w-4" />}
            label="Пользователи"
            active={currentPath === "/admin/users"}
          />
          <SidebarLink
            to="/admin/audits"
            icon={<FileText className="h-4 w-4" />}
            label="Аудиты"
            active={currentPath.includes("/admin/audits")}
          />
          <SidebarLink
            to="/admin/positions"
            icon={<Search className="h-4 w-4" />}
            label="Позиции"
            active={currentPath.includes("/admin/positions")}
          />
          <SidebarLink
            to="/admin/payments"
            icon={<CreditCard className="h-4 w-4" />}
            label="Платежи"
            active={currentPath.includes("/admin/payments")}
          />
        </SidebarGroup>

        <SidebarGroup title="Система">
          <SidebarLink
            to="/admin/settings"
            icon={<Settings className="h-4 w-4" />}
            label="Настройки"
            active={currentPath === "/admin/settings"}
          />
          <SidebarLink
            to="/admin/analytics"
            icon={<BarChart className="h-4 w-4" />}
            label="Аналитика"
            active={currentPath === "/admin/analytics"}
          />
          <SidebarLink
            to="/admin/hosting"
            icon={<Server className="h-4 w-4" />}
            label="Хостинг"
            active={currentPath === "/admin/hosting"}
          />
          <SidebarLink
            to="/admin/sites"
            icon={<Globe className="h-4 w-4" />}
            label="Сайты"
            active={currentPath === "/admin/sites"}
          />
        </SidebarGroup>

        <SidebarGroup title="Системные настройки">
          <SidebarLink
            to="/admin/system/database"
            icon={<Database className="h-4 w-4" />}
            label="База данных"
            active={currentPath === "/admin/system/database"}
          />
          <SidebarLink
            to="/admin/system/security"
            icon={<Shield className="h-4 w-4" />}
            label="Безопасность"
            active={currentPath === "/admin/system/security"}
          />
          <SidebarLink
            to="/admin/system/users"
            icon={<Users className="h-4 w-4" />}
            label="Управление пользователями"
            active={currentPath === "/admin/system/users"}
          />
          <SidebarLink
            to="/admin/system/notifications"
            icon={<Bell className="h-4 w-4" />}
            label="Настройки уведомлений"
            active={currentPath === "/admin/system/notifications"}
          />
          <SidebarLink
            to="/admin/system/analytics"
            icon={<BarChart className="h-4 w-4" />}
            label="Настройки аналитики"
            active={currentPath === "/admin/system/analytics"}
          />
          <SidebarLink
            to="/admin/system/performance"
            icon={<ChartBar className="h-4 w-4" />}
            label="Настройки производительности"
            active={currentPath === "/admin/system/performance"}
          />
        </SidebarGroup>
      </div>
      <div className="p-4 border-t bg-primary/5 mt-auto">
        <div className="text-xs text-muted-foreground">
          <p>Версия: 2.8.1</p>
          <p>SeoMarket © 2025</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
