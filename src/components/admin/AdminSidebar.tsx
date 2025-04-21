
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Analytics,
  Hosting,
  Globe,
  ChartBar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, active }) => {
  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 mb-1 font-normal",
          active && "bg-primary/10 text-primary font-medium"
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
};

interface SidebarGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const SidebarGroup: React.FC<SidebarGroupProps> = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  
  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="w-full mb-3"
    >
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between px-4 py-2 font-medium text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground">
          {title}
          <span className="text-xs">{open ? '▲' : '▼'}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

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
            icon={<Analytics className="h-4 w-4" />} 
            label="Аналитика" 
            active={currentPath === "/admin/analytics"}
          />
          <SidebarLink 
            to="/admin/hosting" 
            icon={<Hosting className="h-4 w-4" />} 
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
            icon={<Analytics className="h-4 w-4" />} 
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
