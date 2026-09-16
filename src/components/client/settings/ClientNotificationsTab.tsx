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
  // Если настройки не прочитались, переключатели показывают значения по
  // умолчанию, а не сохранённые. Сохранять их в таком виде нельзя — затрём
  // настоящие настройки, поэтому говорим об ошибке и блокируем кнопку.
  const [loadError, setLoadError] = useState<string | null>(null);

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
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setEmailNotifications(data.email_notifications ?? true);
          setAuditCompletedNotification(data.notify_audit_completed ?? true);
          setOptimizationNotification(data.notify_optimization ?? true);
          setMarketingNotification(data.notify_marketing ?? false);
        }
      } catch (error) {
        console.error('Error loading notification settings:', error);
        setLoadError(error instanceof Error ? error.message : 'неизвестная ошибка');
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

      const { data, error } = await supabase
        .from('profiles')
        .update({
          email_notifications: emailNotifications,
          notify_audit_completed: auditCompletedNotification,
          notify_optimization: optimizationNotification,
          notify_marketing: marketingNotification,
        })
        .eq('id', user.id)
        .select('id');

      if (error) throw error;
      // Без строки профиля update ничего не меняет и ошибки не возвращает.
      if (!data || data.length === 0) throw new Error('Профиль не найден');

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
      {loadError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
          Не удалось загрузить настройки уведомлений: {loadError}
        </div>
      )}

      {/*
        Раньше здесь были «Email уведомления», «уведомлять о готовности
        оптимизированной версии сайта» и «маркетинговые рассылки». На деле писем
        по уведомлениям сервис не отправляет, уведомлений об оптимизации никто не
        создаёт, рассылок нет. Работает одно: запись о завершении аудита в разделе
        «Уведомления» кабинета. Остальные переключатели недоступны для изменения —
        их сохранённые значения при сохранении записываются обратно как были.
      */}
      <div>
        <h3 className="text-lg font-medium">Уведомления в личном кабинете</h3>
        <p className="text-sm text-muted-foreground">
          Уведомления появляются во вкладке «Уведомления» личного кабинета. Писем на почту
          по ним сервис пока не отправляет.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-2 border-b">
          <div>
            <h4 className="font-medium">Завершение аудита</h4>
            <p className="text-sm text-muted-foreground">
              Создавать уведомление в кабинете, когда SEO-аудит закончится
            </p>
          </div>
          <Switch 
            checked={auditCompletedNotification} 
            onCheckedChange={setAuditCompletedNotification}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium">Пока недоступно</h4>
          <p className="text-sm text-muted-foreground">
            Этого сервис сейчас не делает, поэтому переключатели ниже ни на что не влияют.
          </p>
        </div>

        <div className="flex items-center justify-between py-2 border-b">
          <div>
            <h4 className="font-medium">Письма на почту</h4>
            <p className="text-sm text-muted-foreground">
              Письма по уведомлениям пока не отправляются
            </p>
          </div>
          <Switch checked={emailNotifications} disabled />
        </div>
        
        <div className="flex items-center justify-between py-2 border-b">
          <div>
            <h4 className="font-medium">Оптимизация сайта</h4>
            <p className="text-sm text-muted-foreground">
              Уведомления об окончании оптимизации пока не создаются
            </p>
          </div>
          <Switch checked={optimizationNotification} disabled />
        </div>
        
        <div className="flex items-center justify-between py-2 border-b">
          <div>
            <h4 className="font-medium">Маркетинговые рассылки</h4>
            <p className="text-sm text-muted-foreground">
              Рассылок с новостями и предложениями сейчас нет
            </p>
          </div>
          <Switch checked={marketingNotification} disabled />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving || !!loadError} className="gap-2">
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
