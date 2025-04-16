
import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import type { MassiveCrawlOptions } from '@/services/api/firecrawlService';

interface CrawlOptionsFormProps {
  maxPages: number;
  maxDepth: number;
  followExternalLinks: boolean;
  crawlSpeed: 'slow' | 'medium' | 'fast';
  includeMedia: boolean;
  respectRobotsTxt: boolean;
  onMaxPagesChange: (value: number) => void;
  onMaxDepthChange: (value: number) => void;
  onFollowExternalLinksChange: (value: boolean) => void;
  onCrawlSpeedChange: (value: 'slow' | 'medium' | 'fast') => void;
  onIncludeMediaChange: (value: boolean) => void;
  onRespectRobotsTxtChange: (value: boolean) => void;
}

export const CrawlOptionsForm: React.FC<CrawlOptionsFormProps> = ({
  maxPages,
  maxDepth,
  followExternalLinks,
  crawlSpeed,
  includeMedia,
  respectRobotsTxt,
  onMaxPagesChange,
  onMaxDepthChange,
  onFollowExternalLinksChange,
  onCrawlSpeedChange,
  onIncludeMediaChange,
  onRespectRobotsTxtChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Максимальное количество страниц: {maxPages.toLocaleString('ru-RU')}</Label>
        <Slider
          value={[maxPages]}
          min={1000}
          max={1000000}
          step={1000}
          onValueChange={(values) => onMaxPagesChange(values[0])}
        />
      </div>

      <div className="space-y-2">
        <Label>Максимальная глубина сканирования: {maxDepth}</Label>
        <Slider
          value={[maxDepth]}
          min={5}
          max={100}
          step={5}
          onValueChange={(values) => onMaxDepthChange(values[0])}
        />
      </div>

      <div className="space-y-2">
        <Label>Скорость сканирования</Label>
        <Select value={crawlSpeed} onValueChange={onCrawlSpeedChange}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите скорость сканирования" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="slow">Медленная (меньше нагрузки на сервер)</SelectItem>
            <SelectItem value="medium">Средняя (оптимальный баланс)</SelectItem>
            <SelectItem value="fast">Быстрая (может повысить нагрузку)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="follow-external">Следовать по внешним ссылкам</Label>
        <Switch
          id="follow-external"
          checked={followExternalLinks}
          onCheckedChange={onFollowExternalLinksChange}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="include-media">Включать медиафайлы</Label>
        <Switch
          id="include-media"
          checked={includeMedia}
          onCheckedChange={onIncludeMediaChange}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="respect-robots">Учитывать robots.txt</Label>
        <Switch
          id="respect-robots"
          checked={respectRobotsTxt}
          onCheckedChange={onRespectRobotsTxtChange}
        />
      </div>
    </div>
  );
};
