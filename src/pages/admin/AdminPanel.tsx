
import React from 'react';
import { 
  BarChart3, 
  Users, 
  FileText, 
  CreditCard, 
  Settings, 
  Search,
  Grid3X3,
  Bell,
  Server,
  Home,
  Layers,
  Globe,
  Database,
  ShieldCheck,
  Mail,
  Languages,
  LayoutDashboard,
  LineChart,
  Package,
  Clock,
  BellRing,
  UserCog
} from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { 
  Sidebar, 
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
  SidebarProvider
} from "@/components/ui/sidebar";

const AdminPanel: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Панель администратора | SeoMarket</title>
      </Helmet>
      
      <div className="container-fluid p-0 mx-auto">
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen w-full">
            {/* Боковая панель администратора */}
            <Sidebar>
              <SidebarHeader className="p-4 flex items-center">
                <div className="flex items-center">
                  <div className="bg-primary/10 text-primary rounded-full p-1.5 mr-2">
                    <LayoutDashboard className="h-5 w-5" />
                  </div>
                  <div>
                    <h1 className="text-base font-bold">SeoMarket</h1>
                    <div className="text-xs text-muted-foreground">Админ-панель</div>
                  </div>
                </div>
              </SidebarHeader>
              
              <SidebarContent className="px-2">
                <SidebarGroup>
                  <SidebarGroupLabel>Основное</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive tooltip="Дашборд">
                          <Link to="/admin">
                            <BarChart3 className="h-4 w-4" />
                            <span>Дашборд</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Мониторинг">
                          <Link to="/admin/monitoring">
                            <Grid3X3 className="h-4 w-4" />
                            <span>Мониторинг</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Уведомления">
                          <Link to="/admin/notifications">
                            <Bell className="h-4 w-4" />
                            <span>Уведомления</span>
                            <SidebarMenuBadge className="bg-primary">3</SidebarMenuBadge>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                
                <SidebarSeparator />
                
                <SidebarGroup>
                  <SidebarGroupLabel>Управление</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Аналитика">
                          <Link to="/admin/analytics">
                            <LineChart className="h-4 w-4" />
                            <span>Аналитика</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Пользователи">
                          <Link to="/admin/users">
                            <Users className="h-4 w-4" />
                            <span>Пользователи</span>
                          </Link>
                        </SidebarMenuButton>
                        <SidebarMenuAction asChild showOnHover>
                          <Link to="/admin/users/add">
                            <span className="sr-only">Добавить</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M12 5v14M5 12h14" /></svg>
                          </Link>
                        </SidebarMenuAction>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link to="/admin/users/permissions">Права доступа</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link to="/admin/users/roles">Роли</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Аудиты">
                          <Link to="/admin/audits">
                            <FileText className="h-4 w-4" />
                            <span>Аудиты</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Позиции">
                          <Link to="/admin/positions">
                            <Search className="h-4 w-4" />
                            <span>Позиции</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Платежи">
                          <Link to="/admin/payments">
                            <CreditCard className="h-4 w-4" />
                            <span>Платежи</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                
                <SidebarSeparator />
                
                <SidebarGroup>
                  <SidebarGroupLabel>Система</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Настройки">
                          <Link to="/admin/settings">
                            <Settings className="h-4 w-4" />
                            <span>Настройки</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Хостинг">
                          <Link to="/admin/hosting">
                            <Server className="h-4 w-4" />
                            <span>Хостинг</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Сайты">
                          <Link to="/admin/sites">
                            <Globe className="h-4 w-4" />
                            <span>Сайты</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                
                <SidebarSeparator />
                
                <SidebarGroup>
                  <SidebarGroupLabel>Системные настройки</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="База данных">
                          <Link to="/admin/system/database">
                            <Database className="h-4 w-4" />
                            <span>База данных</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Безопасность">
                          <Link to="/admin/system/security">
                            <ShieldCheck className="h-4 w-4" />
                            <span>Безопасность</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Уведомления">
                          <Link to="/admin/system/notifications">
                            <BellRing className="h-4 w-4" />
                            <span>Уведомления</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Email">
                          <Link to="/admin/system/email">
                            <Mail className="h-4 w-4" />
                            <span>Email</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Локализация">
                          <Link to="/admin/system/localization">
                            <Languages className="h-4 w-4" />
                            <span>Локализация</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Производительность">
                          <Link to="/admin/system/performance">
                            <Clock className="h-4 w-4" />
                            <span>Производительность</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Управление пользователями">
                          <Link to="/admin/system/users">
                            <UserCog className="h-4 w-4" />
                            <span>Управление пользователями</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              
              <SidebarFooter className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Версия</div>
                    <div className="text-sm font-medium">2.8.1</div>
                  </div>
                </div>
              </SidebarFooter>
            </Sidebar>
            
            {/* Основное содержимое */}
            <div className="flex-grow p-6">
              <div className="mb-8">
                <div className="inline-block mb-2 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  Версия 2.8.1
                </div>
                <h1 className="text-3xl font-bold mb-2">Панель администратора</h1>
                <p className="text-muted-foreground">
                  Централизованное управление сервисом SeoMarket
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Аналитика */}
                <Link to="/admin/analytics">
                  <Card className="group h-full backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="h-12 w-12 mb-4 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <BarChart3 className="h-6 w-6" />
                      </div>
                      <h2 className="text-xl font-bold mb-2">Аналитика</h2>
                      <p className="text-muted-foreground text-sm flex-grow">
                        Обзор ключевых метрик, статистика использования и бизнес-показатели платформы.
                      </p>
                      <div className="text-primary font-medium mt-4 flex items-center text-sm">
                        Перейти в раздел
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                
                {/* Пользователи */}
                <Link to="/admin/users">
                  <Card className="group h-full backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="h-12 w-12 mb-4 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Users className="h-6 w-6" />
                      </div>
                      <h2 className="text-xl font-bold mb-2">Пользователи</h2>
                      <p className="text-muted-foreground text-sm flex-grow">
                        Управление аккаунтами, подписками, правами доступа и активностью пользователей.
                      </p>
                      <div className="text-primary font-medium mt-4 flex items-center text-sm">
                        Перейти в раздел
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                
                {/* Аудиты */}
                <Link to="/admin/audits">
                  <Card className="group h-full backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="h-12 w-12 mb-4 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <FileText className="h-6 w-6" />
                      </div>
                      <h2 className="text-xl font-bold mb-2">Аудиты</h2>
                      <p className="text-muted-foreground text-sm flex-grow">
                        История проведенных аудитов, статусы и результаты, экспорт отчетов.
                      </p>
                      <div className="text-primary font-medium mt-4 flex items-center text-sm">
                        Перейти в раздел
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </Layout>
  );
};

export default AdminPanel;
