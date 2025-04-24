
import React from 'react';
import { Helmet } from 'react-helmet-async';
import BaseContentEditor from '@/components/admin/content/BaseContentEditor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';

const HomePageEditor: React.FC = () => {
  const handleSave = (data: any) => {
    console.log('Saving home page data:', data);
  };

  return (
    <>
      <Helmet>
        <title>Редактирование главной страницы | Админ панель</title>
      </Helmet>
      
      <BaseContentEditor
        title="Редактирование главной страницы"
        description="Управление контентом, SEO-параметрами и настройками главной страницы"
        onSave={handleSave}
      >
        <div className="space-y-6">
          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Секция Hero</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Заголовок</label>
                  <Input 
                    defaultValue="Оптимизируйте ваш сайт с помощью искусственного интеллекта" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Подзаголовок</label>
                  <Textarea 
                    defaultValue="Автоматический SEO аудит и оптимизация для улучшения видимости вашего сайта" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Текст кнопки</label>
                  <Input 
                    defaultValue="Начать бесплатно" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Секция возможностей</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Показывать секцию</label>
                  <Switch />
                </div>
                {/* Features list would go here */}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Секция CTA</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Заголовок CTA</label>
                  <Input 
                    defaultValue="Попробуйте SEO аудит бесплатно" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Описание CTA</label>
                  <Textarea 
                    defaultValue="Получите полный отчет о состоянии вашего сайта" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </BaseContentEditor>
    </>
  );
};

export default HomePageEditor;
