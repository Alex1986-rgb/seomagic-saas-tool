
import React from 'react';
import { motion } from 'framer-motion';
import { BellRing, Bell, Check, XCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Завершен аудит сайта',
    message: 'Аудит для myarredo.ru завершен. SEO оценка составила 78/100.',
    date: '2023-09-15T10:30:00',
    read: false,
    type: 'success'
  },
  {
    id: '2',
    title: 'Новые рекомендации',
    message: 'Доступны новые рекомендации по оптимизации для сайта example.com',
    date: '2023-09-14T14:45:00',
    read: false,
    type: 'info'
  },
  {
    id: '3',
    title: 'Обнаружены проблемы',
    message: 'На сайте mysite.ru обнаружены проблемы с индексацией. Требуется внимание.',
    date: '2023-09-12T09:15:00',
    read: true,
    type: 'warning'
  },
  {
    id: '4',
    title: 'Ошибка сканирования',
    message: 'Не удалось завершить сканирование сайта broken-site.ru из-за технических проблем.',
    date: '2023-09-10T18:20:00',
    read: true,
    type: 'error'
  }
];

const NotificationIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
  switch (type) {
    case 'success':
      return <Check className="h-5 w-5 text-green-500" />;
    case 'warning':
      return <Bell className="h-5 w-5 text-amber-500" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'info':
    default:
      return <BellRing className="h-5 w-5 text-blue-500" />;
  }
};

const ClientNotifications: React.FC = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold">Уведомления</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} новых
            </Badge>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={markAllAsRead}>
          Отметить все как прочитанные
        </Button>
      </div>
      
      {notifications.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          У вас нет уведомлений
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border ${
                notification.read ? 'border-border' : 'border-primary/30 bg-primary/5'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <NotificationIcon type={notification.type} />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium">{notification.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(notification.date)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientNotifications;
