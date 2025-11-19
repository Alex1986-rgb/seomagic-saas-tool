import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Save, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ClientNotificationsTab: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [auditCompletedNotification, setAuditCompletedNotification] = useState(true);
  const [optimizationNotification, setOptimizationNotification] = useState(true);
  const [marketingNotification, setMarketingNotification] = useState(false);

  // Load settings from database
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('email_notifications, notify_audit_completed, notify_optimization, notify_marketing')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setEmailNotifications(data.email_notifications ?? true);
          setAuditCompletedNotification(data.notify_audit_completed ?? true);
          setOptimizationNotification(data.notify_optimization ?? true);
          setMarketingNotification(data.notify_marketing ?? false);
        }
      } catch (error) {
        console.error('Error loading notification settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          email_notifications: emailNotifications,
          notify_audit_completed: auditCompletedNotification,
          notify_optimization: optimizationNotification,
          notify_marketing: marketingNotification,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Настройки сохранены",
        description: "Ваши предпочтения уведомлений обновлены",
      });
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
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
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Сохранение...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Сохранить настройки</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ClientNotificationsTab;
