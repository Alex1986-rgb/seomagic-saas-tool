
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Bell, Mail } from 'lucide-react';
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
            <CardDescription>Настройка email шаблонов для различных событий</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Switch 
              id="email-notifications-enabled" 
              checked={notificationSettings.email.enabled}
              onCheckedChange={(checked) => updateEmailSettings('enabled', checked)}
            />
            <Label htmlFor="email-notifications-enabled">Включено</Label>
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
          
          {notificationSettings.email.templates.map((template, index) => (
            <div key={index} className="p-4 border rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{template.name || `Шаблон #${index + 1}`}</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch 
                      id={`template-enabled-${index}`} 
                      checked={template.isEnabled}
                      onCheckedChange={(checked) => updateEmailTemplate(index, 'isEnabled', checked)}
                      disabled={!notificationSettings.email.enabled}
                    />
                    <Label htmlFor={`template-enabled-${index}`}>Активен</Label>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeEmailTemplate(index)}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    disabled={!notificationSettings.email.enabled}
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
                  disabled={!notificationSettings.email.enabled}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`template-subject-${index}`}>Тема письма</Label>
                <Input 
                  id={`template-subject-${index}`} 
                  value={template.subject}
                  onChange={(e) => updateEmailTemplate(index, 'subject', e.target.value)} 
                  disabled={!notificationSettings.email.enabled}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`template-content-${index}`}>Содержание письма</Label>
                <Textarea 
                  id={`template-content-${index}`} 
                  rows={6}
                  value={template.content}
                  onChange={(e) => updateEmailTemplate(index, 'content', e.target.value)}
                  disabled={!notificationSettings.email.enabled}
                  placeholder="Можно использовать переменные {{имя}}, {{email}}, {{ссылка}} и т.д."
                />
              </div>
            </div>
          ))}
          
          {(notificationSettings.email.templates.length === 0 || !notificationSettings.email.enabled) && (
            <div className="text-center py-8 text-muted-foreground">
              {!notificationSettings.email.enabled 
                ? "Email уведомления отключены. Включите их для редактирования шаблонов."
                : "Нет добавленных email шаблонов. Нажмите 'Добавить шаблон', чтобы создать первый шаблон."
              }
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
            <CardDescription>Настройка системных уведомлений на сайте</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Switch 
              id="site-notifications-enabled" 
              checked={notificationSettings.site.enabled}
              onCheckedChange={(checked) => updateSiteSettings('enabled', checked)}
            />
            <Label htmlFor="site-notifications-enabled">Включено</Label>
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
          
          {notificationSettings.site.notifications.map((notification, index) => (
            <div key={index} className="p-4 border rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{notification.title || `Уведомление #${index + 1}`}</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch 
                      id={`notification-enabled-${index}`} 
                      checked={notification.isEnabled}
                      onCheckedChange={(checked) => updateSiteNotification(index, 'isEnabled', checked)}
                      disabled={!notificationSettings.site.enabled}
                    />
                    <Label htmlFor={`notification-enabled-${index}`}>Активно</Label>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeSiteNotification(index)}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    disabled={!notificationSettings.site.enabled}
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
                  disabled={!notificationSettings.site.enabled}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`notification-content-${index}`}>Текст уведомления</Label>
                <Textarea 
                  id={`notification-content-${index}`} 
                  rows={3}
                  value={notification.content}
                  onChange={(e) => updateSiteNotification(index, 'content', e.target.value)}
                  disabled={!notificationSettings.site.enabled}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`notification-type-${index}`}>Тип уведомления</Label>
                <Select 
                  value={notification.type} 
                  onValueChange={(value: 'info' | 'success' | 'warning' | 'error') => 
                    updateSiteNotification(index, 'type', value)
                  }
                  disabled={!notificationSettings.site.enabled}
                >
                  <SelectTrigger id={`notification-type-${index}`}>
                    <SelectValue placeholder="Выберите тип" />
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
          
          {(notificationSettings.site.notifications.length === 0 || !notificationSettings.site.enabled) && (
            <div className="text-center py-8 text-muted-foreground">
              {!notificationSettings.site.enabled 
                ? "Уведомления на сайте отключены. Включите их для редактирования."
                : "Нет добавленных уведомлений. Нажмите 'Добавить уведомление', чтобы создать первое уведомление."
              }
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
