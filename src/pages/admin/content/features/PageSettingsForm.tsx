
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { PageSettings } from './types';

interface PageSettingsFormProps {
  settings: PageSettings;
  onSettingsChange: (settings: PageSettings) => void;
}

const PageSettingsForm: React.FC<PageSettingsFormProps> = ({
  settings,
  onSettingsChange
}) => {
  return (
    <Card className="bg-black/20 border-white/10">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Настройки страницы</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Заголовок страницы</label>
            <Input 
              value={settings.title}
              onChange={(e) => onSettingsChange({...settings, title: e.target.value})}
              className="bg-black/20 border-white/10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Подзаголовок</label>
            <Textarea 
              value={settings.subtitle}
              onChange={(e) => onSettingsChange({...settings, subtitle: e.target.value})}
              className="bg-black/20 border-white/10"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Макет страницы</label>
              <Select 
                value={settings.layout} 
                onValueChange={(value) => onSettingsChange({...settings, layout: value})}
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
                checked={settings.showIcons}
                onCheckedChange={(checked) => onSettingsChange({...settings, showIcons: checked})}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PageSettingsForm;
