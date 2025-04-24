
import React from 'react';
import { Helmet } from 'react-helmet-async';
import BaseContentEditor from '@/components/admin/content/BaseContentEditor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const ClientCabinetEditor: React.FC = () => {
  const { toast } = useToast();
  
  const handleSave = (data: any) => {
    console.log('Saving client cabinet data:', data);
    toast({
      title: "Изменения сохранены",
      description: "Настройки кабинета клиента успешно обновлены"
    });
  };

  return (
    <>
      <Helmet>
        <title>Редактирование кабинета клиента | Админ панель</title>
      </Helmet>
      
      <BaseContentEditor
        title="Редактирование кабинета клиента"
        description="Настройка интерфейса и функций личного кабинета пользователя"
        onSave={handleSave}
      >
        <div className="space-y-6">
          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Основные настройки</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Заголовок панели</label>
                  <Input 
                    defaultValue="Личный кабинет" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Приветственное сообщение</label>
                  <Textarea 
                    defaultValue="Добро пожаловать в ваш личный кабинет! Здесь вы можете управлять вашими проектами и настройками." 
                    className="bg-black/20 border-white/10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Видимость разделов</h3>
              <div className="space-y-4">
                {[
                  { id: 'dashboard', label: 'Дашборд', desc: 'Основная панель управления' },
                  { id: 'projects', label: 'Проекты', desc: 'Управление проектами пользователя' },
                  { id: 'audits', label: 'Аудиты', desc: 'История и результаты аудитов' },
                  { id: 'analytics', label: 'Аналитика', desc: 'Статистика и графики' },
                  { id: 'billing', label: 'Оплата', desc: 'История платежей и подписки' },
                  { id: 'support', label: 'Поддержка', desc: 'Связь с технической поддержкой' }
                ].map(section => (
                  <div key={section.id} className="flex items-start justify-between py-3 border-b last:border-0 border-white/10">
                    <div>
                      <h4 className="font-medium">{section.label}</h4>
                      <p className="text-sm text-gray-400">{section.desc}</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Дополнительные функции</h3>
              <div className="space-y-4">
                {[
                  { id: 'notifications', label: 'Email-уведомления', default: true },
                  { id: 'reports', label: 'Еженедельные отчеты', default: false },
                  { id: 'alerts', label: 'Оповещения о важных событиях', default: true },
                  { id: 'recommendations', label: 'Персональные рекомендации', default: true },
                  { id: 'feedback', label: 'Сбор обратной связи', default: false }
                ].map(feature => (
                  <div key={feature.id} className="flex items-center justify-between">
                    <label className="text-sm">{feature.label}</label>
                    <Switch defaultChecked={feature.default} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </BaseContentEditor>
    </>
  );
};

export default ClientCabinetEditor;
