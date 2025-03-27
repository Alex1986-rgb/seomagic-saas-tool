
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Bell, Globe, BarChart, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ClientNotifications: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [sitePositionAlerts, setSitePositionAlerts] = useState(true);
  const [auditCompletionAlerts, setAuditCompletionAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  const notifications = [
    {
      id: 1,
      title: 'Аудит сайта завершен',
      description: 'Ваш аудит для example.com завершен. Общий рейтинг: 87/100.',
      date: '5 часов назад',
      type: 'success',
      read: false,
    },
    {
      id: 2,
      title: 'Изменение позиций сайта',
      description: 'Ваш сайт поднялся на 5 позиций по ключевому слову "SEO оптимизация".',
      date: '2 дня назад',
      type: 'info',
      read: false,
    },
    {
      id: 3,
      title: 'Предупреждение о критической ошибке',
      description: 'На сайте обнаружены страницы с кодом ответа 5xx.',
      date: '3 дня назад',
      type: 'warning',
      read: true,
    },
    {
      id: 4,
      title: 'Еженедельный отчет доступен',
      description: 'Ваш еженедельный отчет о позициях сайта готов к просмотру.',
      date: '1 неделю назад',
      type: 'info',
      read: true,
    },
  ];

  const getTypeIcon = (type) => {
    switch(type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">Уведомления</h1>
        <p className="text-muted-foreground">
          Управляйте уведомлениями и настройте оповещения о важных событиях
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Последние уведомления</h2>
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`py-4 ${notification.read ? 'opacity-70' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className="mt-1">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">
                          {notification.title}
                          {!notification.read && (
                            <Badge className="ml-2 bg-primary/20 text-primary text-xs">Новое</Badge>
                          )}
                        </h3>
                        <span className="text-xs text-muted-foreground">{notification.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-40" />
              <p className="text-muted-foreground">У вас пока нет уведомлений</p>
            </div>
          )}
          
          {notifications.length > 0 && (
            <div className="mt-4 flex justify-between">
              <Button variant="ghost" size="sm">Отметить все как прочитанные</Button>
              <Button variant="outline" size="sm">Показать все</Button>
            </div>
          )}
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Настройки уведомлений</h2>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <Label htmlFor="email-notifications" className="font-medium">Уведомления по email</Label>
                <p className="text-sm text-muted-foreground">Получать все уведомления на email</p>
              </div>
              <Switch 
                id="email-notifications" 
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            
            <div className="space-y-4 border-t pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <Label htmlFor="position-alerts" className="font-medium">Изменение позиций сайта</Label>
                  <p className="text-sm text-muted-foreground">Уведомления о значительных изменениях в позициях</p>
                </div>
                <Switch 
                  id="position-alerts" 
                  checked={sitePositionAlerts}
                  onCheckedChange={setSitePositionAlerts}
                  disabled={!emailNotifications}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <Label htmlFor="audit-completion" className="font-medium">Завершение аудита</Label>
                  <p className="text-sm text-muted-foreground">Уведомления о завершении аудита сайта</p>
                </div>
                <Switch 
                  id="audit-completion" 
                  checked={auditCompletionAlerts}
                  onCheckedChange={setAuditCompletionAlerts}
                  disabled={!emailNotifications}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <Label htmlFor="weekly-reports" className="font-medium">Еженедельные отчеты</Label>
                  <p className="text-sm text-muted-foreground">Получать еженедельные сводки по сайту</p>
                </div>
                <Switch 
                  id="weekly-reports" 
                  checked={weeklyReports}
                  onCheckedChange={setWeeklyReports}
                  disabled={!emailNotifications}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <Label htmlFor="marketing-emails" className="font-medium">Маркетинговые письма</Label>
                  <p className="text-sm text-muted-foreground">Новости и предложения от SeoMarket</p>
                </div>
                <Switch 
                  id="marketing-emails" 
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                  disabled={!emailNotifications}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-right">
            <Button>Сохранить настройки</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ClientNotifications;
