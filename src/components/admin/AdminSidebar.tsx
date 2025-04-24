
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
            icon={LayoutDashboard}
          >
            Дашборд
          </SidebarLink>
          <SidebarLink
            to="/admin/monitoring"
            icon={Monitor}
          >
            Мониторинг
          </SidebarLink>
          <SidebarLink
            to="/admin/website-analyzer"
            icon={Search}
          >
            Анализатор веб-сайтов
          </SidebarLink>
          <SidebarLink
            to="/admin/system-status"
            icon={ChartBar}
          >
            Статус системы
          </SidebarLink>
          <SidebarLink
            to="/admin/notifications"
            icon={Bell}
          >
            Уведомления
          </SidebarLink>
        </SidebarGroup>

        <SidebarGroup 
          title="Управление"
          icon={<Users className="h-4 w-4 text-primary/70" />}
        >
          <SidebarLink
            to="/admin/users"
            icon={Users}
          >
            Пользователи
          </SidebarLink>
          <SidebarLink
            to="/admin/audits"
            icon={FileText}
          >
            Аудиты
          </SidebarLink>
          <SidebarLink
            to="/admin/positions"
            icon={Search}
          >
            Позиции
          </SidebarLink>
          <SidebarLink
            to="/admin/payments"
            icon={CreditCard}
          >
            Платежи
          </SidebarLink>
        </SidebarGroup>

        <SidebarGroup 
          title="Система"
          icon={<Settings className="h-4 w-4 text-primary/70" />}
        >
          <SidebarLink
            to="/admin/settings"
            icon={Settings}
          >
            Настройки
          </SidebarLink>
          <SidebarLink
            to="/admin/analytics"
            icon={BarChart}
          >
            Аналитика
          </SidebarLink>
          <SidebarLink
            to="/admin/hosting"
            icon={Server}
          >
            Хостинг
          </SidebarLink>
          <SidebarLink
            to="/admin/sites"
            icon={Globe}
          >
            Сайты
          </SidebarLink>
        </SidebarGroup>

        <SidebarGroup 
          title="Системные настройки"
          icon={<Database className="h-4 w-4 text-primary/70" />}
        >
          <SidebarLink
            to="/admin/system/database"
            icon={Database}
          >
            База данных
          </SidebarLink>
          <SidebarLink
            to="/admin/system/security"
            icon={Shield}
          >
            Безопасность
          </SidebarLink>
          <SidebarLink
            to="/admin/system/users"
            icon={Users}
          >
            Управление пользователями
          </SidebarLink>
          <SidebarLink
            to="/admin/system/notifications"
            icon={Bell}
          >
            Настройки уведомлений
          </SidebarLink>
          <SidebarLink
            to="/admin/system/analytics"
            icon={BarChart}
          >
            Настройки аналитики
          </SidebarLink>
          <SidebarLink
            to="/admin/system/performance"
            icon={ChartBar}
          >
            Настройки производительности
          </SidebarLink>
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
