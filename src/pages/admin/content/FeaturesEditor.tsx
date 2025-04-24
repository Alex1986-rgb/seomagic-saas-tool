import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import BaseContentEditor from '@/components/admin/content/BaseContentEditor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Settings, Move } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  order: number;
  highlight: boolean;
}

const FeaturesEditor: React.FC = () => {
  const { toast } = useToast();
  const [pageSettings, setPageSettings] = useState({
    title: 'Возможности платформы',
    subtitle: 'Исчерпывающий набор инструментов для анализа и оптимизации',
    layout: 'grid',
    showIcons: true
  });
  
  const [features, setFeatures] = useState<Feature[]>([
    {
      id: '1',
      name: 'SEO Аудит',
      description: 'Полный технический и SEO анализ сайта с рекомендациями по оптимизации',
      icon: 'search',
      enabled: true,
      order: 1,
      highlight: true
    },
    {
      id: '2',
      name: 'Мониторинг позиций',
      description: 'Отслеживание позиций сайта по ключевым запросам в поисковых системах',
      icon: 'bar-chart',
      enabled: true,
      order: 2,
      highlight: false
    }
  ]);

  const handleSave = (data: any) => {
    console.log('Saving features page data:', data);
    toast({
      title: "Изменения сохранены",
      description: "Контент страницы возможностей обновлен"
    });
  };
  
  const addFeature = () => {
    const newFeature: Feature = {
      id: Date.now().toString(),
      name: 'Новая возможность',
      description: 'Описание новой возможности',
      icon: 'settings',
      enabled: true,
      order: features.length + 1,
      highlight: false
    };
    
    setFeatures([...features, newFeature]);
    
    toast({
      title: "Возможность добавлена",
      description: "Новая возможность успешно добавлена"
    });
  };
  
  const removeFeature = (id: string) => {
    setFeatures(features.filter(feature => feature.id !== id));
    
    toast({
      title: "Возможность удалена",
      description: "Возможность успешно удалена"
    });
  };
  
  const updateFeature = (id: string, field: string, value: string | boolean) => {
    setFeatures(features.map(feature => 
      feature.id === id ? { ...feature, [field]: value } : feature
    ));
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
                    value={pageSettings.title}
                    onChange={(e) => setPageSettings({...pageSettings, title: e.target.value})}
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Подзаголовок</label>
                  <Textarea 
                    value={pageSettings.subtitle}
                    onChange={(e) => setPageSettings({...pageSettings, subtitle: e.target.value})}
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Макет страницы</label>
                    <Select 
                      value={pageSettings.layout} 
                      onValueChange={(value) => setPageSettings({...pageSettings, layout: value})}
                    >
                      <SelectTrigger className="bg-black/20 border-white/10">
                        <SelectValue placeholder="Выберите макет" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Сетка</SelectItem>
                        <SelectItem value="list">Список</SelectItem>
                        <SelectItem value="cards">Карточки</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium">Показывать иконки</label>
                    <Switch 
                      checked={pageSettings.showIcons}
                      onCheckedChange={(checked) => setPageSettings({...pageSettings, showIcons: checked})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Список возможностей</h3>
                <Button onClick={addFeature} className="bg-primary hover:bg-primary/90" size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Добавить возможность
                </Button>
              </div>
              
              <div className="space-y-4 mt-6">
                {features.map((feature) => (
                  <Card key={feature.id} className="border-white/10 bg-black/30">
                    <CardContent className="p-4">
                      <div className="flex justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Move className="h-4 w-4 text-gray-400 cursor-move" />
                          <Input 
                            value={feature.name}
                            onChange={(e) => updateFeature(feature.id, 'name', e.target.value)}
                            className="bg-black/20 border-white/10 w-[400px]"
                            placeholder="Название возможности"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center space-x-2">
                            <label className="text-xs">Активен</label>
                            <Switch
                              checked={feature.enabled}
                              onCheckedChange={(checked) => updateFeature(feature.id, 'enabled', checked)}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="text-xs">Выделить</label>
                            <Switch
                              checked={feature.highlight}
                              onCheckedChange={(checked) => updateFeature(feature.id, 'highlight', checked)}
                            />
                          </div>
                          <Button 
                            onClick={() => removeFeature(feature.id)}
                            variant="ghost" 
                            size="sm" 
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Textarea 
                        value={feature.description}
                        onChange={(e) => updateFeature(feature.id, 'description', e.target.value)}
                        className="bg-black/20 border-white/10 mb-3"
                        placeholder="Описание возможности"
                        rows={2}
                      />
                      <div className="flex flex-wrap gap-4">
                        <div>
                          <label className="block text-xs font-medium mb-1">Иконка</label>
                          <Select 
                            value={feature.icon} 
                            onValueChange={(value) => updateFeature(feature.id, 'icon', value)}
                          >
                            <SelectTrigger className="bg-black/20 border-white/10 w-[150px]">
                              <SelectValue placeholder="Выберите иконку" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="search">Поиск</SelectItem>
                              <SelectItem value="bar-chart">График</SelectItem>
                              <SelectItem value="settings">Настройки</SelectItem>
                              <SelectItem value="user">Пользователь</SelectItem>
                              <SelectItem value="shield">Безопасность</SelectItem>
                              <SelectItem value="activity">Активность</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Порядок</label>
                          <Input 
                            type="number"
                            value={feature.order}
                            onChange={(e) => updateFeature(feature.id, 'order', e.target.value)}
                            className="bg-black/20 border-white/10 w-[100px]"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {features.length === 0 && (
                  <div className="p-8 text-center border border-dashed border-white/10 rounded-md bg-black/10">
                    <p className="text-gray-400">Возможности не найдены. Добавьте новую возможность.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </BaseContentEditor>
    </>
  );
};

export default FeaturesEditor;
