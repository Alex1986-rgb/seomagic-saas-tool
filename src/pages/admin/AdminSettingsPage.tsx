
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminSettings from '@/components/admin/AdminSettings';
import { Card, CardContent } from "@/components/ui/card";
import { Settings, UserCheck, Globe, Shield, BellRing } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Recent settings changes
const recentChanges = [
  { action: "Изменены настройки SMTP", user: "Анна С.", time: "20 мин назад" },
  { action: "Обновлены параметры кеширования", user: "Василий П.", time: "2 ч назад" },
  { action: "Добавлен новый тариф", user: "Максим К.", time: "вчера, 15:42" },
];

const AdminSettingsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Настройки | Админ панель</title>
      </Helmet>
      
      <div className="container mx-auto px-6 py-10 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary/10 text-primary p-1.5 rounded">
                <Settings className="h-5 w-5" />
              </div>
              <h1 className="text-3xl font-bold">Настройки администратора</h1>
            </div>
            <p className="text-muted-foreground">
              Управление системными настройками и конфигурацией платформы
            </p>
          </div>
          
          <div className="flex gap-2">
            <Link to="/admin/system-status">
              <Button variant="outline" className="flex items-center gap-2" size="sm">
                <Shield className="h-4 w-4" />
                Безопасность
              </Button>
            </Link>
            <Link to="/admin/system/users">
              <Button variant="outline" className="flex items-center gap-2" size="sm">
                <UserCheck className="h-4 w-4" />
                Пользователи
              </Button>
            </Link>
            <Link to="/admin/system/database">
              <Button className="flex items-center gap-2" size="sm">
                <Globe className="h-4 w-4" />
                Интеграции
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <Card className="backdrop-blur-sm bg-card/80 border shadow-sm">
              <CardContent className="p-0">
                <AdminSettings />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="backdrop-blur-sm bg-card/80 border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BellRing className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Недавние изменения</h3>
                </div>
                
                <div className="space-y-4">
                  {recentChanges.map((change, index) => (
                    <div key={index} className="flex items-start gap-3 py-2 border-b last:border-0">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{change.action}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                          <span>{change.user}</span>
                          <span>•</span>
                          <span>{change.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4" size="sm">
                  Просмотреть историю изменений
                </Button>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm bg-card/80 border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Важные настройки</h3>
                </div>
                
                <div className="space-y-3 text-sm">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    Параметры безопасности
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    Резервное копирование
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    API ключи и доступ
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    Настройки почты
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    Логирование событий
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-10 text-sm text-muted-foreground space-y-3 max-w-3xl">
          <p className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            <b>Возможности:</b> управление всеми настройками платформы, пользователи, интеграции, безопасность, уведомления.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Все изменения настроек автоматически логируются</li>
            <li>Для критических изменений требуется дополнительное подтверждение</li>
            <li>Резервное копирование выполняется раз в сутки</li>
            <li>Восстановление настроек из резервной копии доступно администраторам</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AdminSettingsPage;
