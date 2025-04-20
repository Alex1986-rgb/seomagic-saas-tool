
import React from 'react';
import { 
  Server, 
  Shield, 
  Database, 
  Users, 
  Bell, 
  BarChart, 
  LineChart,
  FileText,
  Info
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const SystemSettings: React.FC = () => {
  const navigate = useNavigate();

  const systemModules = [
    {
      title: "База данных",
      icon: <Database className="h-4 w-4 text-primary" />,
      description: "Настройки подключения и оптимизации БД",
      path: "/admin/system/database"
    },
    {
      title: "Безопасность",
      icon: <Shield className="h-4 w-4 text-primary" />,
      description: "Параметры защиты и правила доступа",
      path: "/admin/system/security"
    },
    {
      title: "Пользователи",
      icon: <Users className="h-4 w-4 text-primary" />,
      description: "Администраторы и права доступа",
      path: "/admin/system/users"
    },
    {
      title: "Уведомления",
      icon: <Bell className="h-4 w-4 text-primary" />,
      description: "Настройка оповещений и мониторинга",
      path: "/admin/system/notifications"
    },
    {
      title: "Аналитика",
      icon: <LineChart className="h-4 w-4 text-primary" />,
      description: "Сбор и анализ данных о работе системы",
      path: "/admin/system/analytics"
    },
    {
      title: "Производительность",
      icon: <BarChart className="h-4 w-4 text-primary" />,
      description: "Мониторинг и оптимизация сервера",
      path: "/admin/system/performance"
    }
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/5 border-primary/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold mb-1">Системный мониторинг</h3>
              <p className="text-muted-foreground text-sm">
                Текущий статус системы: <span className="text-green-600 font-medium">Стабильный</span>
              </p>
              <div className="text-sm mt-2">
                <span className="font-medium">Последнее обновление:</span> 19.04.2025 09:12
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <h3 className="text-lg font-medium pl-1">Системные модули</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {systemModules.map((module) => (
          <div 
            key={module.title}
            className="p-4 border rounded-md bg-card hover:bg-accent/5 transition-colors cursor-pointer"
            onClick={() => handleNavigate(module.path)}
          >
            <div className="flex items-center gap-2 mb-2">
              {module.icon}
              <span className="font-medium">{module.title}</span>
            </div>
            <p className="text-sm text-muted-foreground">{module.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-muted/50 p-4 rounded-md mt-6 text-sm text-muted-foreground">
        <p>Для просмотра полной панели мониторинга системы <a href="/admin/monitoring" className="text-primary hover:underline">перейдите в раздел мониторинга</a>.</p>
      </div>
    </div>
  );
};

export default SystemSettings;
