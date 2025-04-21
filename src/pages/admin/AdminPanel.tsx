
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { layoutDashboard, users, fileText, search, settings, menu } from "lucide-react";
import { Helmet } from 'react-helmet-async';

const ADMIN_LINKS = [
  { icon: layoutDashboard, label: "Дашборд", to: "/admin" },
  { icon: users, label: "Пользователи", to: "/admin/users" },
  { icon: fileText, label: "Аудиты", to: "/admin/audits" },
  { icon: search, label: "Позиции", to: "/admin/positions" },
  { icon: settings, label: "Настройки", to: "/admin/settings" },
];

const AdminPanel: React.FC = () => {
  return (
    <SidebarProvider>
      <Helmet>
        <title>Панель администратора | SeoMarket</title>
      </Helmet>
      <div className="flex min-h-screen w-full bg-muted/40">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Администрирование</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {ADMIN_LINKS.map((item) => (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild>
                        <a href={item.to} className="flex items-center gap-2">
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-8">
          {/* Здесь будет рендериться выбранный раздел админки */}
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminPanel;

