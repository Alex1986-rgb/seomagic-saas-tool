
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Search, Settings2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ScanFormProps {
  url: string;
  isScanning: boolean;
  scanProgress: number;
  scanStage: string;
  isError: boolean;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartScan: () => void;
}

const ScanForm = ({
  url,
  isScanning,
  scanProgress,
  scanStage,
  isError,
  onUrlChange,
  onStartScan
}: ScanFormProps) => {
  const { toast } = useToast();
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState({
    useSitemap: true,
    useRobotsTxt: true,
    maxPages: 1000,
    followExternalLinks: false,
    scanJavascript: true,
    includeImages: true,
    performSeoAudit: true,
    generateOptimizedVersion: true
  });

  const handleOptionChange = (option: string, value: boolean | number) => {
    setAdvancedOptions(prev => ({ ...prev, [option]: value }));
  };

  const handleStartScan = () => {
    if (!url) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите URL сайта",
        variant: "destructive",
      });
      return;
    }

    // Pass advanced options to scan function if needed
    onStartScan();
  };

  return (
    <div>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Например: example.com"
          value={url}
          onChange={onUrlChange}
          className="flex-1"
        />
        <Button 
          onClick={handleStartScan} 
          disabled={isScanning}
          className="gap-2"
        >
          <Search className="h-4 w-4" />
          Сканировать
        </Button>
      </div>

      <Collapsible 
        open={advancedOptionsOpen} 
        onOpenChange={setAdvancedOptionsOpen}
        className="mt-4"
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
            <Settings2 className="h-3 w-3" />
            {advancedOptionsOpen ? 'Скрыть' : 'Показать'} расширенные настройки
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-4 rounded-md border p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch 
                checked={advancedOptions.useSitemap}
                onCheckedChange={(checked) => handleOptionChange('useSitemap', checked)}
                id="useSitemap"
              />
              <Label htmlFor="useSitemap">Использовать sitemap.xml</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                checked={advancedOptions.useRobotsTxt}
                onCheckedChange={(checked) => handleOptionChange('useRobotsTxt', checked)}
                id="useRobotsTxt"
              />
              <Label htmlFor="useRobotsTxt">Анализировать robots.txt</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                checked={advancedOptions.followExternalLinks}
                onCheckedChange={(checked) => handleOptionChange('followExternalLinks', checked)}
                id="followExternalLinks"
              />
              <Label htmlFor="followExternalLinks">Проверять внешние ссылки</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                checked={advancedOptions.scanJavascript}
                onCheckedChange={(checked) => handleOptionChange('scanJavascript', checked)}
                id="scanJavascript"
              />
              <Label htmlFor="scanJavascript">Сканировать JavaScript</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                checked={advancedOptions.includeImages}
                onCheckedChange={(checked) => handleOptionChange('includeImages', checked)}
                id="includeImages"
              />
              <Label htmlFor="includeImages">Включать изображения</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                checked={advancedOptions.performSeoAudit}
                onCheckedChange={(checked) => handleOptionChange('performSeoAudit', checked)}
                id="performSeoAudit"
              />
              <Label htmlFor="performSeoAudit">Выполнить SEO аудит</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                checked={advancedOptions.generateOptimizedVersion}
                onCheckedChange={(checked) => handleOptionChange('generateOptimizedVersion', checked)}
                id="generateOptimizedVersion"
              />
              <Label htmlFor="generateOptimizedVersion">Создать оптимизированную версию</Label>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {isScanning && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{scanStage}</span>
            <span>{scanProgress}%</span>
          </div>
          <Progress value={scanProgress} className="h-2" />
        </div>
      )}

      {isError && !isScanning && (
        <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          Произошла ошибка при сканировании. Пожалуйста, проверьте URL и попробуйте снова.
        </div>
      )}
    </div>
  );
};

export default ScanForm;
