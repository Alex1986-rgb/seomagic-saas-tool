
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from "@/components/ui/card";
import SystemSettingsPage from '@/components/admin/system/SystemSettingsPage';
import { Server, Shield, Database } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

// Server status data
const serverStatus = {
  status: 'Стабильно',
  uptime: '23 дня, 14 часов',
  load: '23%',
  memory: '36%',
  diskUsage: '42%'
};

const SystemStatusPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Состояние системы | Админ панель</title>
      </Helmet>
      
      <div className="container mx-auto px-6 py-10 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary/10 text-primary p-1.5 rounded">
                <Server className="h-5 w-5" />
              </div>
              <h1 className="text-3xl font-bold">Состояние системы</h1>
            </div>
            <p className="text-muted-foreground">
              Мониторинг и настройка основных компонентов платформы
            </p>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2.5 bg-green-500/10 text-green-500 rounded-lg border border-green-500/20">
            <Shield className="h-5 w-5" />
            <div className="text-sm">
              <div className="font-medium">Система работает стабильно</div>
              <div className="text-xs text-green-400">Последнее обновление: 21.04.2025</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="backdrop-blur-sm bg-card/80 border shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Статус сервера</h3>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  {serverStatus.status}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Время работы:</span>
                  <span className="font-medium">{serverStatus.uptime}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Нагрузка CPU:</span>
                    <span className="font-medium">{serverStatus.load}</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: serverStatus.load }}></div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Использование памяти:</span>
                    <span className="font-medium">{serverStatus.memory}</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: serverStatus.memory }}></div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Использование диска:</span>
                    <span className="font-medium">{serverStatus.diskUsage}</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: serverStatus.diskUsage }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-card/80 border shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">База данных</h3>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  Активно
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Тип БД:</span>
                  <span className="font-medium">PostgreSQL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Активных подключений:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Время отклика:</span>
                  <span className="font-medium">58 мс</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Размер БД:</span>
                  <span className="font-medium">2.34 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Последний бэкап:</span>
                  <span className="font-medium">19.04.2025 01:14</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-card/80 border shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Безопасность</h3>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  Защищено
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Последний аудит:</span>
                  <span className="font-medium">19.04.2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SSL сертификат:</span>
                  <span className="font-medium">Действителен</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">2FA для админов:</span>
                  <span className="font-medium">Включено</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Брандмауэр:</span>
                  <span className="font-medium">Активен</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Попытки входа:</span>
                  <span className="font-medium">0 неудачных</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="backdrop-blur-sm bg-card/80 border shadow-sm">
          <CardContent className="p-0">
            <SystemSettingsPage />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SystemStatusPage;
