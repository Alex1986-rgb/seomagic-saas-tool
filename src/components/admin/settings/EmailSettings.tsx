
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save, RefreshCw } from 'lucide-react';

const EmailSettings: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [auditCompletedNotification, setAuditCompletedNotification] = useState(true);
  const [paymentNotification, setPaymentNotification] = useState(true);
  const [newUserNotification, setNewUserNotification] = useState(true);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Email уведомления</h3>
          <p className="text-sm text-muted-foreground">
            Настройте, какие email-уведомления будут отправляться
          </p>
        </div>
        <Switch 
          checked={emailNotifications} 
          onCheckedChange={setEmailNotifications} 
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between py-2 border-b">
          <div>
            <h4 className="font-medium">Завершение аудита</h4>
            <p className="text-sm text-muted-foreground">
              Уведомление о завершении аудита сайта
            </p>
          </div>
          <Switch 
            checked={auditCompletedNotification} 
            onCheckedChange={setAuditCompletedNotification}
            disabled={!emailNotifications}
          />
        </div>
        
        <div className="flex items-center justify-between py-2 border-b">
          <div>
            <h4 className="font-medium">Новый платеж</h4>
            <p className="text-sm text-muted-foreground">
              Уведомление о новом платеже
            </p>
          </div>
          <Switch 
            checked={paymentNotification} 
            onCheckedChange={setPaymentNotification}
            disabled={!emailNotifications}
          />
        </div>
        
        <div className="flex items-center justify-between py-2 border-b">
          <div>
            <h4 className="font-medium">Новый пользователь</h4>
            <p className="text-sm text-muted-foreground">
              Уведомление о регистрации нового пользователя
            </p>
          </div>
          <Switch 
            checked={newUserNotification} 
            onCheckedChange={setNewUserNotification}
            disabled={!emailNotifications}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="smtp-server">SMTP Сервер</Label>
        <Input id="smtp-server" defaultValue="smtp.example.com" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="smtp-user">SMTP Пользователь</Label>
          <Input id="smtp-user" defaultValue="notifications@seomarket.ru" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="smtp-password">SMTP Пароль</Label>
          <Input id="smtp-password" type="password" defaultValue="password" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="smtp-port">SMTP Порт</Label>
          <Input id="smtp-port" defaultValue="587" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email-from">Email отправителя</Label>
          <Input id="email-from" defaultValue="SeoMarket <noreply@seomarket.ru>" />
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Тестовое письмо</span>
        </Button>
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          <span>Сохранить настройки</span>
        </Button>
      </div>
    </div>
  );
};

export default EmailSettings;
