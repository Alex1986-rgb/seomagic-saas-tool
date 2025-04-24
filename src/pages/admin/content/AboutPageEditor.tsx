
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import BaseContentEditor from '@/components/admin/content/BaseContentEditor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SEO } from '@/components/SEO';

const AboutPageEditor: React.FC = () => {
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState([
    { name: 'Алексей Петров', position: 'CEO', photo: 'alex.jpg', bio: 'Эксперт в SEO с опытом более 10 лет.' },
    { name: 'Мария Смирнова', position: 'CTO', photo: 'maria.jpg', bio: 'Разработчик алгоритмов оптимизации.' }
  ]);

  const handleSave = (data: any) => {
    console.log('Saving about page data:', data);
    toast({
      title: "Изменения сохранены",
      description: "Контент страницы о нас обновлен",
    });
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, {
      name: 'Новый сотрудник',
      position: 'Должность',
      photo: 'placeholder.jpg',
      bio: 'Информация о сотруднике'
    }]);
  };

  const removeTeamMember = (index: number) => {
    const updatedMembers = [...teamMembers];
    updatedMembers.splice(index, 1);
    setTeamMembers(updatedMembers);
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Команда</h3>
                <Button 
                  onClick={addTeamMember} 
                  className="bg-primary hover:bg-primary/90" 
                  size="sm"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Добавить сотрудника
                </Button>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Заголовок секции</label>
                <Input 
                  defaultValue="Наша команда" 
                  className="bg-black/20 border-white/10 mb-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Описание команды</label>
                <Textarea 
                  defaultValue="Профессионалы, объединенные общей целью." 
                  className="bg-black/20 border-white/10 mb-6"
                />
              </div>

              <div className="space-y-4 mt-6">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="border-white/10 bg-black/30">
                    <CardContent className="p-4">
                      <div className="flex justify-between mb-3">
                        <h4 className="font-medium">Сотрудник #{index + 1}</h4>
                        <Button 
                          onClick={() => removeTeamMember(index)} 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium mb-2">Имя</label>
                          <Input 
                            defaultValue={member.name} 
                            className="bg-black/20 border-white/10"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Должность</label>
                          <Input 
                            defaultValue={member.position} 
                            className="bg-black/20 border-white/10"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label className="block text-sm font-medium mb-2">Фото</label>
                        <Input 
                          defaultValue={member.photo} 
                          className="bg-black/20 border-white/10"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Био</label>
                        <Textarea 
                          defaultValue={member.bio} 
                          className="bg-black/20 border-white/10"
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </BaseContentEditor>
    </>
  );
};

export default AboutPageEditor;
