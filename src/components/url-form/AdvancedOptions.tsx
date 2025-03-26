
import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AdvancedOptionsProps {
  options: {
    maxPages: number;
    scanDepth: number;
    followExternalLinks: boolean;
    analyzeMobile: boolean;
    checkSecurity: boolean;
    checkPerformance: boolean;
  };
  onOptionsChange: (key: string, value: any) => void;
}

const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({ options, onOptionsChange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <h4 className="font-medium mb-4">Настройки аудита</h4>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Максимум страниц: {options.maxPages}</Label>
            </div>
            <Slider 
              value={[options.maxPages]} 
              min={100}
              max={250000}
              step={100}
              onValueChange={(value) => onOptionsChange('maxPages', value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Глубина сканирования: {options.scanDepth}</Label>
            </div>
            <Slider 
              value={[options.scanDepth]} 
              min={1}
              max={50}
              step={1}
              onValueChange={(value) => onOptionsChange('scanDepth', value[0])}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="follow-external" 
              checked={options.followExternalLinks}
              onCheckedChange={(checked) => onOptionsChange('followExternalLinks', checked)}
            />
            <Label htmlFor="follow-external">Внешние ссылки</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="mobile-check"
              checked={options.analyzeMobile}
              onCheckedChange={(checked) => onOptionsChange('analyzeMobile', checked)}
            />
            <Label htmlFor="mobile-check">Мобильная версия</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="security-check"
              checked={options.checkSecurity}
              onCheckedChange={(checked) => onOptionsChange('checkSecurity', checked)}
            />
            <Label htmlFor="security-check">Проверка безопасности</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="performance-check"
              checked={options.checkPerformance}
              onCheckedChange={(checked) => onOptionsChange('checkPerformance', checked)}
            />
            <Label htmlFor="performance-check">Анализ производительности</Label>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdvancedOptions;
