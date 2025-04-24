
import React from 'react';
import { Helmet } from 'react-helmet-async';
import BaseContentEditor from '@/components/admin/content/BaseContentEditor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';

const MarketingEditor: React.FC = () => {
  const handleSave = (data: any) => {
    console.log('Saving marketing content:', data);
  };

  return (
    <>
      <Helmet>
        <title>Управление маркетинговыми материалами | Админ панель</title>
      </Helmet>
      
      <BaseContentEditor
        title="Управление маркетинговыми материалами"
        description="Редактирование рекламных материалов, акций и спецпредложений"
        onSave={handleSave}
      >
        <div className="space-y-6">
          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Главный рекламный баннер</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Заголовок</label>
                  <Input 
                    defaultValue="Увеличьте трафик сайта на 150%" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Подзаголовок</label>
                  <Textarea 
                    defaultValue="Используйте наши инструменты SEO-оптимизации и аналитики для быстрого роста" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Текст кнопки</label>
                  <Input 
                    defaultValue="Попробовать бесплатно" 
                    className="bg-black/20 border-white/10 w-[300px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">URL кнопки</label>
                  <Input 
                    defaultValue="/audit" 
                    className="bg-black/20 border-white/10 w-[300px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Акции и спецпредложения</h3>
                <Button className="bg-primary hover:bg-primary/90" size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Добавить акцию
                </Button>
              </div>
              
              <div className="space-y-4 mt-6">
                <Card className="border-white/10 bg-black/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between mb-3">
                      <Input 
                        defaultValue="Скидка 25% на годовую подписку" 
                        className="bg-black/20 border-white/10 w-[400px]"
                        placeholder="Название акции"
                      />
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea 
                      defaultValue="Оформите годовую подписку и получите скидку 25% на все тарифы" 
                      className="bg-black/20 border-white/10 mb-3"
                      placeholder="Описание акции"
                      rows={2}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Дата начала</label>
                        <Input 
                          defaultValue="2025-04-01" 
                          type="date"
                          className="bg-black/20 border-white/10"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Дата окончания</label>
                        <Input 
                          defaultValue="2025-05-01" 
                          type="date"
                          className="bg-black/20 border-white/10"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-white/10 bg-black/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between mb-3">
                      <Input 
                        defaultValue="Бесплатный аудит для новых клиентов" 
                        className="bg-black/20 border-white/10 w-[400px]"
                        placeholder="Название акции"
                      />
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea 
                      defaultValue="Зарегистрируйтесь и получите бесплатный полный аудит для одного сайта" 
                      className="bg-black/20 border-white/10 mb-3"
                      placeholder="Описание акции"
                      rows={2}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Дата начала</label>
                        <Input 
                          defaultValue="2025-04-01" 
                          type="date"
                          className="bg-black/20 border-white/10"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Дата окончания</label>
                        <Input 
                          defaultValue="2025-06-30" 
                          type="date"
                          className="bg-black/20 border-white/10"
                        />
                      </div>
                    </div>
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

export default MarketingEditor;
