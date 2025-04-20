
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, Save, MessageSquare } from 'lucide-react';

const NotificationsSettings: React.FC = () => {
  const [isEmailNotifications, setIsEmailNotifications] = useState(true);
  const [isSmsNotifications, setIsSmsNotifications] = useState(false);
  const [isSlackNotifications, setIsSlackNotifications] = useState(false);
  const [emailSettings, setEmailSettings] = useState({
    serverErrors: true,
    lowDiskSpace: true,
    highCpuUsage: true,
    databaseIssues: true,
    newUsers: false
  });
  const [emailRecipients, setEmailRecipients] = useState('admin@example.com');
  const [slackWebhook, setSlackWebhook] = useState('');
  
  const handleSaveSettings = () => {
    console.log('Saving notification settings:', {
      isEmailNotifications, isSmsNotifications, isSlackNotifications,
      emailSettings, emailRecipients, slackWebhook
    });
    // Here would be an API call to save settings
  };
  
  const handleToggleEmailSetting = (key: keyof typeof emailSettings) => {
    setEmailSettings({
      ...emailSettings,
      [key]: !emailSettings[key]
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center mb-6 space-x-2">
            <Bell className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Настройки системных уведомлений</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email уведомления</Label>
                <p className="text-sm text-muted-foreground">Отправлять уведомления на email</p>
              </div>
              <Switch 
                id="email-notifications" 
                checked={isEmailNotifications}
                onCheckedChange={setIsEmailNotifications}
              />
            </div>
            
            {isEmailNotifications && (
              <div className="pl-4 border-l-2 border-primary/20 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-recipients">Получатели email</Label>
                  <Input 
                    id="email-recipients" 
                    value={emailRecipients} 
                    onChange={(e) => setEmailRecipients(e.target.value)} 
                    placeholder="email@example.com, another@example.com"
                  />
                  <p className="text-xs text-muted-foreground">Разделите email-адреса запятыми</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Типы уведомлений по email</Label>
                  
                  <div className="space-y-2 pl-2">
                    {Object.entries(emailSettings).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Switch 
                          id={`email-${key}`} 
                          checked={value}
                          onCheckedChange={() => handleToggleEmailSetting(key as keyof typeof emailSettings)}
                        />
                        <Label htmlFor={`email-${key}`} className="capitalize">
                          {key === 'serverErrors' ? 'Системные ошибки' : 
                           key === 'lowDiskSpace' ? 'Нехватка места на диске' : 
                           key === 'highCpuUsage' ? 'Высокая загрузка CPU' : 
                           key === 'databaseIssues' ? 'Проблемы с базой данных' : 
                           key === 'newUsers' ? 'Новые пользователи' : key}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-notifications">SMS уведомления</Label>
                <p className="text-sm text-muted-foreground">Отправлять уведомления по SMS</p>
              </div>
              <Switch 
                id="sms-notifications" 
                checked={isSmsNotifications}
                onCheckedChange={setIsSmsNotifications}
              />
            </div>
            
            {isSmsNotifications && (
              <div className="pl-4 border-l-2 border-primary/20 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone-numbers">Номера телефонов</Label>
                  <Input 
                    id="phone-numbers"
                    placeholder="+7 999 123 45 67, +7 999 765 43 21"
                  />
                  <p className="text-xs text-muted-foreground">Разделите номера запятыми</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sms-api-key">API ключ SMS-сервиса</Label>
                  <Input 
                    id="sms-api-key"
                    placeholder="Введите API ключ"
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="slack-notifications">Slack уведомления</Label>
                <p className="text-sm text-muted-foreground">Отправлять уведомления в Slack</p>
              </div>
              <Switch 
                id="slack-notifications" 
                checked={isSlackNotifications}
                onCheckedChange={setIsSlackNotifications}
              />
            </div>
            
            {isSlackNotifications && (
              <div className="pl-4 border-l-2 border-primary/20">
                <div className="space-y-2">
                  <Label htmlFor="slack-webhook">Webhook URL</Label>
                  <Input 
                    id="slack-webhook" 
                    value={slackWebhook} 
                    onChange={(e) => setSlackWebhook(e.target.value)} 
                    placeholder="https://hooks.slack.com/services/..."
                  />
                </div>
              </div>
            )}
            
            <div className="pt-2">
              <Button 
                onClick={handleSaveSettings}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Сохранить настройки уведомлений
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsSettings;
