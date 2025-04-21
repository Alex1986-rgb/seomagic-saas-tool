
import React from 'react';
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
  return (
    <div className="w-64 h-full bg-background border-r flex flex-col overflow-auto">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Панель администратора</h2>
        <p className="text-sm text-muted-foreground">Управление SeoMarket</p>
      </div>
      
      <div className="p-4 flex-1 space-y-4">
        <SidebarGroup 
          title="Основные разделы" 
          defaultOpen={true}
          icon={<LayoutDashboard className="h-4 w-4 text-primary/70" />}
        >
          <SidebarLink
            to="/admin"
            icon={<LayoutDashboard className="h-4 w-4" />}
            label="Дашборд"
          />
          <SidebarLink
            to="/admin/monitoring"
            icon={<Monitor className="h-4 w-4" />}
            label="Мониторинг"
          />
          <SidebarLink
            to="/admin/website-analyzer"
            icon={<Search className="h-4 w-4" />}
            label="Анализатор веб-сайтов"
          />
          <SidebarLink
            to="/admin/system-status"
            icon={<ChartBar className="h-4 w-4" />}
            label="Статус системы"
          />
          <SidebarLink
            to="/admin/notifications"
            icon={<Bell className="h-4 w-4" />}
            label="Уведомления"
          />
        </SidebarGroup>

        <SidebarGroup 
          title="Управление"
          icon={<Users className="h-4 w-4 text-primary/70" />}
        >
          <SidebarLink
            to="/admin/users"
            icon={<Users className="h-4 w-4" />}
            label="Пользователи"
          />
          <SidebarLink
            to="/admin/audits"
            icon={<FileText className="h-4 w-4" />}
            label="Аудиты"
          />
          <SidebarLink
            to="/admin/positions"
            icon={<Search className="h-4 w-4" />}
            label="Позиции"
          />
          <SidebarLink
            to="/admin/payments"
            icon={<CreditCard className="h-4 w-4" />}
            label="Платежи"
          />
        </SidebarGroup>

        <SidebarGroup 
          title="Система"
          icon={<Settings className="h-4 w-4 text-primary/70" />}
        >
          <SidebarLink
            to="/admin/settings"
            icon={<Settings className="h-4 w-4" />}
            label="Настройки"
          />
          <SidebarLink
            to="/admin/analytics"
            icon={<BarChart className="h-4 w-4" />}
            label="Аналитика"
          />
          <SidebarLink
            to="/admin/hosting"
            icon={<Server className="h-4 w-4" />}
            label="Хостинг"
          />
          <SidebarLink
            to="/admin/sites"
            icon={<Globe className="h-4 w-4" />}
            label="Сайты"
          />
        </SidebarGroup>

        <SidebarGroup 
          title="Системные настройки"
          icon={<Database className="h-4 w-4 text-primary/70" />}
        >
          <SidebarLink
            to="/admin/system/database"
            icon={<Database className="h-4 w-4" />}
            label="База данных"
          />
          <SidebarLink
            to="/admin/system/security"
            icon={<Shield className="h-4 w-4" />}
            label="Безопасность"
          />
          <SidebarLink
            to="/admin/system/users"
            icon={<Users className="h-4 w-4" />}
            label="Управление пользователями"
          />
          <SidebarLink
            to="/admin/system/notifications"
            icon={<Bell className="h-4 w-4" />}
            label="Настройки уведомлений"
          />
          <SidebarLink
            to="/admin/system/analytics"
            icon={<BarChart className="h-4 w-4" />}
            label="Настройки аналитики"
          />
          <SidebarLink
            to="/admin/system/performance"
            icon={<ChartBar className="h-4 w-4" />}
            label="Настройки производительности"
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
