
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Move, Trash2 } from 'lucide-react';
import { Feature } from './types';

interface FeatureCardProps {
  feature: Feature;
  onUpdate: (id: string, field: string, value: string | boolean) => void;
  onRemove: (id: string) => void;
  dragHandleProps?: Record<string, any>;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  onUpdate,
  onRemove,
  dragHandleProps = {}
}) => {
  return (
    <Card className="border-white/10 bg-black/30">
      <CardContent className="p-4">
        <div className="flex justify-between mb-3">
          <div className="flex items-center gap-2">
            <Move 
              className="h-4 w-4 text-gray-400 cursor-move" 
              {...dragHandleProps}
            />
            <Input 
              value={feature.name}
              onChange={(e) => onUpdate(feature.id, 'name', e.target.value)}
              className="bg-black/20 border-white/10 w-[400px]"
              placeholder="Название возможности"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <label className="text-xs">Активен</label>
              <Switch
                checked={feature.enabled}
                onCheckedChange={(checked) => onUpdate(feature.id, 'enabled', checked)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-xs">Выделить</label>
              <Switch
                checked={feature.highlight}
                onCheckedChange={(checked) => onUpdate(feature.id, 'highlight', checked)}
              />
            </div>
            <Button 
              onClick={() => onRemove(feature.id)}
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
          onChange={(e) => onUpdate(feature.id, 'description', e.target.value)}
          className="bg-black/20 border-white/10 mb-3"
          placeholder="Описание возможности"
          rows={2}
        />
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-xs font-medium mb-1">Иконка</label>
            <Select 
              value={feature.icon} 
              onValueChange={(value) => onUpdate(feature.id, 'icon', value)}
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
              onChange={(e) => onUpdate(feature.id, 'order', e.target.value)}
              className="bg-black/20 border-white/10 w-[100px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
