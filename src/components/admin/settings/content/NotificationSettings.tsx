
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Mail, Bell } from 'lucide-react';
import { NotificationSettings as NotificationSettingsType } from './types';

interface NotificationSettingsProps {
  notificationSettings: NotificationSettingsType;
  updateEmailSettings: (field: string, value: boolean) => void;
  updateEmailTemplate: (index: number, field: string, value: string | boolean) => void;
  addEmailTemplate: () => void;
  removeEmailTemplate: (index: number) => void;
  updateSiteSettings: (field: string, value: boolean) => void;
  updateSiteNotification: (index: number, field: string, value: string | boolean) => void;
  addSiteNotification: () => void;
  removeSiteNotification: (index: number) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  notificationSettings,
  updateEmailSettings,
  updateEmailTemplate,
  addEmailTemplate,
  removeEmailTemplate,
  updateSiteSettings,
  updateSiteNotification,
  addSiteNotification,
  removeSiteNotification
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <span>Email уведомления</span>
            </CardTitle>
            <CardDescription>Настройка уведомлений, отправляемых по email</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="email-enabled">Включить Email уведомления</Label>
            <Switch 
              id="email-enabled" 
              checked={notificationSettings.email.enabled}
              onCheckedChange={(checked) => updateEmailSettings('enabled', checked)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addEmailTemplate}
              className="flex items-center gap-1"
              disabled={!notificationSettings.email.enabled}
            >
              <Plus className="h-4 w-4" />
              <span>Добавить шаблон</span>
            </Button>
          </div>
          
          {notificationSettings.email.enabled && notificationSettings.email.templates.map((template, index) => (
            <div key={index} className="p-4 border rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{template.name}</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch 
                      id={`template-enabled-${index}`} 
                      checked={template.isEnabled}
                      onCheckedChange={(checked) => updateEmailTemplate(index, 'isEnabled', checked)}
                    />
                    <Label htmlFor={`template-enabled-${index}`}>Активен</Label>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeEmailTemplate(index)}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`template-name-${index}`}>Название шаблона</Label>
                <Input 
                  id={`template-name-${index}`} 
                  value={template.name}
                  onChange={(e) => updateEmailTemplate(index, 'name', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`template-subject-${index}`}>Тема письма</Label>
                <Input 
                  id={`template-subject-${index}`} 
                  value={template.subject}
                  onChange={(e) => updateEmailTemplate(index, 'subject', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`template-content-${index}`}>Содержание письма</Label>
                <Textarea 
                  id={`template-content-${index}`} 
                  rows={4}
                  value={template.content}
                  onChange={(e) => updateEmailTemplate(index, 'content', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Используйте переменные в формате {"{{"}{"{имя_переменной}"}{"}"} для подстановки данных.
                </p>
              </div>
            </div>
          ))}
          
          {notificationSettings.email.enabled && notificationSettings.email.templates.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Нет добавленных шаблонов. Нажмите "Добавить шаблон", чтобы создать первый шаблон.
            </div>
          )}
          
          {!notificationSettings.email.enabled && (
            <div className="text-center py-8 text-muted-foreground">
              Email уведомления отключены. Включите их для настройки шаблонов.
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <span>Уведомления на сайте</span>
            </CardTitle>
            <CardDescription>Настройка уведомлений, отображаемых пользователям на сайте</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="site-enabled">Включить уведомления на сайте</Label>
            <Switch 
              id="site-enabled" 
              checked={notificationSettings.site.enabled}
              onCheckedChange={(checked) => updateSiteSettings('enabled', checked)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addSiteNotification}
              className="flex items-center gap-1"
              disabled={!notificationSettings.site.enabled}
            >
              <Plus className="h-4 w-4" />
              <span>Добавить уведомление</span>
            </Button>
          </div>
          
          {notificationSettings.site.enabled && notificationSettings.site.notifications.map((notification, index) => (
            <div key={index} className="p-4 border rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{notification.title}</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch 
                      id={`notification-enabled-${index}`} 
                      checked={notification.isEnabled}
                      onCheckedChange={(checked) => updateSiteNotification(index, 'isEnabled', checked)}
                    />
                    <Label htmlFor={`notification-enabled-${index}`}>Активно</Label>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeSiteNotification(index)}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`notification-title-${index}`}>Заголовок</Label>
                <Input 
                  id={`notification-title-${index}`} 
                  value={notification.title}
                  onChange={(e) => updateSiteNotification(index, 'title', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`notification-content-${index}`}>Содержание</Label>
                <Textarea 
                  id={`notification-content-${index}`} 
                  rows={3}
                  value={notification.content}
                  onChange={(e) => updateSiteNotification(index, 'content', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`notification-type-${index}`}>Тип уведомления</Label>
                <Select 
                  value={notification.type} 
                  onValueChange={(value: 'info' | 'success' | 'warning' | 'error') => 
                    updateSiteNotification(index, 'type', value)
                  }
                >
                  <SelectTrigger id={`notification-type-${index}`}>
                    <SelectValue placeholder="Выберите тип уведомления" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Информация</SelectItem>
                    <SelectItem value="success">Успех</SelectItem>
                    <SelectItem value="warning">Предупреждение</SelectItem>
                    <SelectItem value="error">Ошибка</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
          
          {notificationSettings.site.enabled && notificationSettings.site.notifications.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Нет добавленных уведомлений. Нажмите "Добавить уведомление", чтобы создать первое уведомление.
            </div>
          )}
          
          {!notificationSettings.site.enabled && (
            <div className="text-center py-8 text-muted-foreground">
              Уведомления на сайте отключены. Включите их для настройки.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
