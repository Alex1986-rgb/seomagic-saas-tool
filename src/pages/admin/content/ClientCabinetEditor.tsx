
import React from 'react';
import { Helmet } from 'react-helmet-async';
import BaseContentEditor from '@/components/admin/content/BaseContentEditor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const ClientCabinetEditor: React.FC = () => {
  const handleSave = (data: any) => {
    console.log('Saving client cabinet data:', data);
  };

  return (
    <>
      <Helmet>
        <title>Настройка кабинета клиента | Админ панель</title>
      </Helmet>
      
      <BaseContentEditor
        title="Настройка кабинета клиента"
        description="Управление интерфейсом и функциями личного кабинета пользователей"
        onSave={handleSave}
      >
        <div className="space-y-6">
          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Общие настройки</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Приветственный заголовок</label>
                  <Input 
                    defaultValue="Добро пожаловать в личный кабинет" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Описание</label>
                  <Textarea 
                    defaultValue="Управляйте проектами, просматривайте отчеты и оптимизируйте сайты" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Доступные разделы</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Аудиты</p>
                    <p className="text-xs text-gray-400">Просмотр истории и результатов аудитов</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Мониторинг позиций</p>
                    <p className="text-xs text-gray-400">Отслеживание позиций сайта в поисковых системах</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Отчеты</p>
                    <p className="text-xs text-gray-400">История и статистика роста позиций</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Подписки</p>
                    <p className="text-xs text-gray-400">Управление тарифным планом</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Настройки профиля</p>
                    <p className="text-xs text-gray-400">Изменение личных данных и настроек безопасности</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Настройки оповещений</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Оповещения о завершении аудита</p>
                    <p className="text-xs text-gray-400">Уведомления при завершении сканирования сайта</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Изменение позиций</p>
                    <p className="text-xs text-gray-400">Уведомления об изменении позиций сайта</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Статус подписки</p>
                    <p className="text-xs text-gray-400">Уведомления о скором истечении срока подписки</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </BaseContentEditor>
    </>
  );
};

export default ClientCabinetEditor;
