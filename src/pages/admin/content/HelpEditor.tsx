
import React from 'react';
import { Helmet } from 'react-helmet-async';
import BaseContentEditor from '@/components/admin/content/BaseContentEditor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, MoveDown, MoveUp } from 'lucide-react';

const HelpEditor: React.FC = () => {
  const handleSave = (data: any) => {
    console.log('Saving help content:', data);
  };

  return (
    <>
      <Helmet>
        <title>Редактирование справочных материалов | Админ панель</title>
      </Helmet>
      
      <BaseContentEditor
        title="Редактирование справочных материалов"
        description="Управление разделами справки, FAQ и учебными материалами"
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
                    defaultValue="Центр помощи" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Описание</label>
                  <Textarea 
                    defaultValue="Ответы на часто задаваемые вопросы и руководства по использованию сервиса" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Часто задаваемые вопросы</h3>
                <Button className="bg-primary hover:bg-primary/90" size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Добавить вопрос
                </Button>
              </div>
              
              <div className="space-y-4 mt-6">
                <Card className="border-white/10 bg-black/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between mb-3 gap-2">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <MoveDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input 
                        defaultValue="Как начать использование сервиса?" 
                        className="bg-black/20 border-white/10 flex-1"
                        placeholder="Вопрос"
                      />
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea 
                      defaultValue="Для начала использования сервиса вам необходимо зарегистрироваться, указав адрес электронной почты и пароль. После подтверждения учетной записи вы сможете добавить свой первый сайт для аудита." 
                      className="bg-black/20 border-white/10"
                      placeholder="Ответ"
                      rows={3}
                    />
                  </CardContent>
                </Card>
                
                <Card className="border-white/10 bg-black/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between mb-3 gap-2">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <MoveDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input 
                        defaultValue="Как оплатить подписку?" 
                        className="bg-black/20 border-white/10 flex-1"
                        placeholder="Вопрос"
                      />
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea 
                      defaultValue="Для оплаты подписки перейдите в раздел 'Подписки' в личном кабинете, выберите подходящий тарифный план и нажмите кнопку 'Оплатить'. Вы можете использовать для оплаты банковские карты Visa, Mastercard или электронные платежные системы." 
                      className="bg-black/20 border-white/10"
                      placeholder="Ответ"
                      rows={3}
                    />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Руководства</h3>
                <Button className="bg-primary hover:bg-primary/90" size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Добавить руководство
                </Button>
              </div>
              
              <div className="space-y-4 mt-6">
                <Card className="border-white/10 bg-black/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between mb-3">
                      <Input 
                        defaultValue="Полный аудит сайта" 
                        className="bg-black/20 border-white/10 w-[400px]"
                        placeholder="Название руководства"
                      />
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea 
                      defaultValue="Пошаговое руководство по проведению полного аудита сайта с использованием всех возможностей сервиса" 
                      className="bg-black/20 border-white/10"
                      placeholder="Краткое описание"
                      rows={2}
                    />
                  </CardContent>
                </Card>
                
                <Card className="border-white/10 bg-black/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between mb-3">
                      <Input 
                        defaultValue="Мониторинг позиций" 
                        className="bg-black/20 border-white/10 w-[400px]"
                        placeholder="Название руководства"
                      />
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea 
                      defaultValue="Как настроить отслеживание позиций сайта по ключевым запросам в различных поисковых системах" 
                      className="bg-black/20 border-white/10"
                      placeholder="Краткое описание"
                      rows={2}
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

export default HelpEditor;
