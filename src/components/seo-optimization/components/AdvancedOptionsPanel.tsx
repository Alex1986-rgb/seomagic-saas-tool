
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { AdvancedOptions } from '@/hooks/useSeoOptimization';

interface AdvancedOptionsPanelProps {
  options: AdvancedOptions;
  onToggle: (option: keyof AdvancedOptions) => void;
  onMaxPagesChange: (value: number) => void;
}

const AdvancedOptionsPanel: React.FC<AdvancedOptionsPanelProps> = ({ 
  options, 
  onToggle,
  onMaxPagesChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Настройки оптимизации</h3>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="maxPages" className="flex-1">Максимальное количество страниц</Label>
          <Input 
            id="maxPages" 
            type="number" 
            className="w-24" 
            value={options.maxPages} 
            onChange={(e) => onMaxPagesChange(parseInt(e.target.value))}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(options).map(([key, value]) => {
          if (key === 'maxPages') return null;
          return (
            <div key={key} className="flex items-center space-x-2">
              <Switch 
                id={key}
                checked={value}
                onCheckedChange={() => onToggle(key as keyof AdvancedOptions)}
              />
              <Label htmlFor={key}>{getOptionLabel(key)}</Label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const getOptionLabel = (key: string): string => {
  const labels: Record<string, string> = {
    dynamicRendering: 'Обрабатывать JavaScript контент',
    followExternalLinks: 'Следовать по внешним ссылкам',
    analyzeMobile: 'Анализировать мобильную версию',
    optimizeImages: 'Оптимизировать изображения',
    optimizeHeadings: 'Оптимизировать заголовки',
    optimizeMetaTags: 'Оптимизировать мета-теги',
    optimizeContent: 'Оптимизировать контент'
  };
  return labels[key] || key;
};

export default AdvancedOptionsPanel;
