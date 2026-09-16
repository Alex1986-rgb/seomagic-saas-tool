
import React from 'react';
import {
  Shield,
  Database,
  Users,
  Bell,
  BarChart,
  LineChart,
  Info
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';

/**
 * Вкладка «Система» в настройках админки.
 *
 * Здесь висел блок «Текущий статус системы: Стабильный» и «Последнее
 * обновление: 19.04.2025 09:12» — и статус, и дата были вписаны в код и ни с
 * чем не сверялись. Метрик сервера платформа не снимает, поэтому вердикта о
 * состоянии системы тут больше нет: только ссылки на страницы, которые
 * показывают то, что действительно лежит в базе.
 *
 * Описания модулей обещали «настройки подключения и оптимизации БД»,
 * «параметры защиты» и «мониторинг сервера», хотя сами разделы честно
 * говорят, что из админки это не настраивается. Подписи приведены к тому,
 * что в разделах есть на самом деле.
 *
 * Ссылка на мониторинг была обычным <a href="/admin/monitoring">: такой адрес
 * не учитывает подпуть публикации /seomagic-saas-tool/ и на опубликованном
 * сайте вёл на 404. Все переходы — через <Link>, он подставляет basename.
 */
const SystemSettings: React.FC = () => {
  const systemModules = [
    {
      title: "База данных",
      icon: <Database className="h-4 w-4 text-primary" />,
      description: "Где смотреть подключения и нагрузку (из админки не настраивается)",
      path: "/admin/system/database"
    },
    {
      title: "Безопасность",
      icon: <Shield className="h-4 w-4 text-primary" />,
      description: "Где настраивается защита входа (не из админки)",
      path: "/admin/system/security"
    },
    {
      title: "Пользователи",
      icon: <Users className="h-4 w-4 text-primary" />,
      description: "Учётные записи с ролями и статистика регистраций",
      path: "/admin/system/users"
    },
    {
      title: "Уведомления",
      icon: <Bell className="h-4 w-4 text-primary" />,
      description: "Каналы оповещений не подключены: что есть на самом деле",
      path: "/admin/system/notifications"
    },
    {
      title: "Аналитика",
      icon: <LineChart className="h-4 w-4 text-primary" />,
      description: "Счётчики работ платформы по данным базы",
      path: "/admin/system/analytics"
    },
    {
      title: "Производительность",
      icon: <BarChart className="h-4 w-4 text-primary" />,
      description: "Метрики сервера не собираются: что можно посмотреть",
      path: "/admin/system/performance"
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-primary/5 border-primary/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold mb-1">Системный мониторинг</h3>
              <p className="text-muted-foreground text-sm">
                Сводного статуса системы нет: платформа не снимает метрики сервера и не
                выносит вердикт «работает стабильно». То, что есть в базе, — журнал вызовов
                функций за сутки и объём накопленных данных — показано на страницах{' '}
                <Link to="/admin/system-status" className="text-primary hover:underline">
                  «Состояние системы»
                </Link>{' '}
                и{' '}
                <Link to="/admin/monitoring" className="text-primary hover:underline">
                  «Мониторинг платформы»
                </Link>
                .
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <h3 className="text-lg font-medium pl-1">Системные модули</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {systemModules.map((module) => (
          <Link
            key={module.title}
            to={module.path}
            className="block p-4 border rounded-md bg-card hover:bg-accent/5 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              {module.icon}
              <span className="font-medium">{module.title}</span>
            </div>
            <p className="text-sm text-muted-foreground">{module.description}</p>
          </Link>
        ))}
      </div>

      <div className="bg-muted/50 p-4 rounded-md mt-6 text-sm text-muted-foreground">
        <p>
          Журнал вызовов функций за последние сутки и счётчики выполненных работ —{' '}
          <Link to="/admin/monitoring" className="text-primary hover:underline">
            в разделе мониторинга
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default SystemSettings;
