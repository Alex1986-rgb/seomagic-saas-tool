
import React from 'react';
import { Helmet } from 'react-helmet-async';
import BaseContentEditor from '@/components/admin/content/BaseContentEditor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const BlogEditor: React.FC = () => {
  const handleSave = (data: any) => {
    console.log('Saving blog page data:', data);
  };

  return (
    <>
      <Helmet>
        <title>Управление блогом | Админ панель</title>
      </Helmet>
      
      <BaseContentEditor
        title="Управление блогом"
        description="Редактирование статей, категорий и настройка страницы блога"
        onSave={handleSave}
      >
        <div className="space-y-6">
          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Настройки страницы блога</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Заголовок страницы</label>
                  <Input 
                    defaultValue="Блог о SEO и оптимизации" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Описание</label>
                  <Textarea 
                    defaultValue="Полезные статьи о современных инструментах оптимизации сайтов" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Статьи блога</h3>
                <Button className="bg-primary hover:bg-primary/90" size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Добавить статью
                </Button>
              </div>
              
              <div className="space-y-4 mt-6">
                <div className="p-4 border border-white/10 rounded-md bg-black/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Как улучшить SEO в 2025 году</h4>
                      <p className="text-sm text-gray-400">Опубликовано: 15.03.2025</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
                        Редактировать
                      </Button>
                      <Button variant="destructive" size="sm">
                        Удалить
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-white/10 rounded-md bg-black/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Влияние ИИ на поисковую оптимизацию</h4>
                      <p className="text-sm text-gray-400">Опубликовано: 02.04.2025</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
                        Редактировать
                      </Button>
                      <Button variant="destructive" size="sm">
                        Удалить
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </BaseContentEditor>
    </>
  );
};

export default BlogEditor;
