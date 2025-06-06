
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  BarChart2,
  FileText,
  Globe,
  Server,
  Settings,
  Monitor,
  CreditCard,
  MapPin,
  Shield,
  Bell,
} from 'lucide-react';

const menuItems = [
  {
    title: "Дашборд",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Пользователи",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Аналитика",
    url: "/admin/analytics",
    icon: BarChart2,
  },
  {
    title: "Аудиты",
    url: "/admin/audits",
    icon: FileText,
  },
  {
    title: "Сайты",
    url: "/admin/sites",
    icon: Globe,
  },
  {
    title: "Хостинг",
    url: "/admin/hosting",
    icon: Server,
  },
  {
    title: "Мониторинг",
    url: "/admin/monitoring",
    icon: Monitor,
  },
  {
    title: "Анализатор сайтов",
    url: "/admin/website-analyzer",
    icon: Globe,
  },
  {
    title: "Позиции",
    url: "/admin/positions",
    icon: MapPin,
  },
  {
    title: "Платежи",
    url: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Прокси",
    url: "/admin/proxies",
    icon: Shield,
  },
  {
    title: "Уведомления",
    url: "/admin/notifications",
    icon: Bell,
  },
  {
    title: "Настройки",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold text-primary">SEO Platform</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Управление</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
