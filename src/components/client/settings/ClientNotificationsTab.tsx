
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Save } from 'lucide-react';

const ClientNotificationsTab: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [auditCompletedNotification, setAuditCompletedNotification] = useState(true);
  const [optimizationNotification, setOptimizationNotification] = useState(true);
  const [marketingNotification, setMarketingNotification] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Email уведомления</h3>
          <p className="text-sm text-muted-foreground">
            Управляйте email-уведомлениями, которые вы получаете
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
              Уведомлять о завершении SEO-аудита
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
            <h4 className="font-medium">Оптимизация сайта</h4>
            <p className="text-sm text-muted-foreground">
              Уведомлять о готовности оптимизированной версии сайта
            </p>
          </div>
          <Switch 
            checked={optimizationNotification} 
            onCheckedChange={setOptimizationNotification}
            disabled={!emailNotifications}
          />
        </div>
        
        <div className="flex items-center justify-between py-2 border-b">
          <div>
            <h4 className="font-medium">Маркетинговые рассылки</h4>
            <p className="text-sm text-muted-foreground">
              Получать новости, советы и специальные предложения
            </p>
          </div>
          <Switch 
            checked={marketingNotification} 
            onCheckedChange={setMarketingNotification}
            disabled={!emailNotifications}
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          <span>Сохранить настройки</span>
        </Button>
      </div>
    </div>
  );
};

export default ClientNotificationsTab;
