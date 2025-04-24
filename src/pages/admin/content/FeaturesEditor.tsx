
import React from 'react';
import { Helmet } from 'react-helmet-async';
import BaseContentEditor from '@/components/admin/content/BaseContentEditor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';

const FeaturesEditor: React.FC = () => {
  const handleSave = (data: any) => {
    console.log('Saving features page data:', data);
  };

  return (
    <>
      <Helmet>
        <title>Редактирование возможностей | Админ панель</title>
      </Helmet>
      
      <BaseContentEditor
        title="Редактирование возможностей"
        description="Управление списком функций и возможностей платформы"
        onSave={handleSave}
      >
        <div className="space-y-6">
          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Настройки страницы</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Заголовок страницы</label>
                  <Input 
                    defaultValue="Возможности платформы" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Подзаголовок</label>
                  <Textarea 
                    defaultValue="Исчерпывающий набор инструментов для анализа и оптимизации" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Список возможностей</h3>
                <Button className="bg-primary hover:bg-primary/90" size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Добавить возможность
                </Button>
              </div>
              
              <div className="space-y-4 mt-6">
                <Card className="border-white/10 bg-black/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between mb-3">
                      <Input 
                        defaultValue="SEO Аудит" 
                        className="bg-black/20 border-white/10 w-[400px]"
                        placeholder="Название возможности"
                      />
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea 
                      defaultValue="Полный технический и SEO анализ сайта с рекомендациями по оптимизации" 
                      className="bg-black/20 border-white/10 mb-3"
                      placeholder="Описание возможности"
                      rows={2}
                    />
                    <Input 
                      defaultValue="audit" 
                      className="bg-black/20 border-white/10 w-[200px]"
                      placeholder="Идентификатор"
                    />
                  </CardContent>
                </Card>
                
                <Card className="border-white/10 bg-black/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between mb-3">
                      <Input 
                        defaultValue="Мониторинг позиций" 
                        className="bg-black/20 border-white/10 w-[400px]"
                        placeholder="Название возможности"
                      />
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea 
                      defaultValue="Отслеживание позиций сайта по ключевым запросам в поисковых системах" 
                      className="bg-black/20 border-white/10 mb-3"
                      placeholder="Описание возможности"
                      rows={2}
                    />
                    <Input 
                      defaultValue="position-tracking" 
                      className="bg-black/20 border-white/10 w-[200px]"
                      placeholder="Идентификатор"
                    />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </BaseContentEditor>
    </>
  );
};

export default FeaturesEditor;
