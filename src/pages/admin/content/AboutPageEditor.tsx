
import React from 'react';
import { Helmet } from 'react-helmet-async';
import BaseContentEditor from '@/components/admin/content/BaseContentEditor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

const AboutPageEditor: React.FC = () => {
  const handleSave = (data: any) => {
    console.log('Saving about page data:', data);
  };

  return (
    <>
      <Helmet>
        <title>Редактирование страницы "О нас" | Админ панель</title>
      </Helmet>
      
      <BaseContentEditor
        title='Редактирование страницы "О нас"'
        description="Управление контентом, SEO-параметрами и настройками страницы о компании"
        onSave={handleSave}
      >
        <div className="space-y-6">
          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Секция Заголовок</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Заголовок</label>
                  <Input 
                    defaultValue="О нашей компании" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Подзаголовок</label>
                  <Textarea 
                    defaultValue="Мы создаем инструменты для оптимизации и анализа сайтов" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Секция Миссия</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Заголовок миссии</label>
                  <Input 
                    defaultValue="Наша миссия" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Текст миссии</label>
                  <Textarea 
                    defaultValue="Помогать бизнесу расти в цифровом пространстве с помощью современных технологий оптимизации." 
                    className="bg-black/20 border-white/10"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Команда</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Заголовок секции</label>
                  <Input 
                    defaultValue="Наша команда" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Описание команды</label>
                  <Textarea 
                    defaultValue="Профессионалы, объединенные общей целью." 
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

export default AboutPageEditor;
