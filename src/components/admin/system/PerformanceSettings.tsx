
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Activity, Save, BarChart, AlertTriangle } from 'lucide-react';

const PerformanceSettings: React.FC = () => {
  const [cacheEnabled, setCacheEnabled] = useState(true);
  const [optimizeImages, setOptimizeImages] = useState(true);
  const [compressionEnabled, setCompressionEnabled] = useState(true);
  const [maxConcurrentRequests, setMaxConcurrentRequests] = useState('20');
  const [requestTimeout, setRequestTimeout] = useState('30');
  const [alertThresholds, setAlertThresholds] = useState({
    cpuUsage: '80',
    memoryUsage: '85',
    diskSpace: '90',
    responseTime: '2000'
  });
  
  const handleSaveSettings = () => {
    console.log('Saving performance settings:', {
      cacheEnabled, optimizeImages, compressionEnabled,
      maxConcurrentRequests, requestTimeout, alertThresholds
    });
    // Here would be an API call to save settings
  };
  
  const handleAlertThresholdChange = (key: keyof typeof alertThresholds, value: string) => {
    setAlertThresholds({
      ...alertThresholds,
      [key]: value
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center mb-6 space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Настройки производительности</h3>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Оптимизация контента</h4>
              
              <div className="space-y-3 pl-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="cache-enabled">Кеширование</Label>
                    <p className="text-xs text-muted-foreground">Включить кеширование статического контента</p>
                  </div>
                  <Switch 
                    id="cache-enabled" 
                    checked={cacheEnabled}
                    onCheckedChange={setCacheEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="optimize-images">Оптимизация изображений</Label>
                    <p className="text-xs text-muted-foreground">Автоматически оптимизировать изображения</p>
                  </div>
                  <Switch 
                    id="optimize-images" 
                    checked={optimizeImages}
                    onCheckedChange={setOptimizeImages}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compress-enabled">Сжатие GZIP/Brotli</Label>
                    <p className="text-xs text-muted-foreground">Включить сжатие ответов сервера</p>
                  </div>
                  <Switch 
                    id="compress-enabled" 
                    checked={compressionEnabled}
                    onCheckedChange={setCompressionEnabled}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Ограничения ресурсов</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-2">
                <div className="space-y-2">
                  <Label htmlFor="max-requests">Макс. одновременных запросов</Label>
                  <Input 
                    id="max-requests" 
                    type="number"
                    value={maxConcurrentRequests} 
                    onChange={(e) => setMaxConcurrentRequests(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="request-timeout">Таймаут запроса (сек)</Label>
                  <Input 
                    id="request-timeout" 
                    type="number"
                    value={requestTimeout} 
                    onChange={(e) => setRequestTimeout(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <h4 className="font-medium">Пороги оповещений</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-2">
                <div className="space-y-2">
                  <Label htmlFor="cpu-threshold">Использование CPU (%)</Label>
                  <Input 
                    id="cpu-threshold" 
                    type="number"
                    value={alertThresholds.cpuUsage} 
                    onChange={(e) => handleAlertThresholdChange('cpuUsage', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Оповещать при превышении порога</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="memory-threshold">Использование памяти (%)</Label>
                  <Input 
                    id="memory-threshold" 
                    type="number"
                    value={alertThresholds.memoryUsage} 
                    onChange={(e) => handleAlertThresholdChange('memoryUsage', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Оповещать при превышении порога</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="disk-threshold">Использование диска (%)</Label>
                  <Input 
                    id="disk-threshold" 
                    type="number"
                    value={alertThresholds.diskSpace} 
                    onChange={(e) => handleAlertThresholdChange('diskSpace', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Оповещать при превышении порога</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="response-threshold">Время ответа (мс)</Label>
                  <Input 
                    id="response-threshold" 
                    type="number"
                    value={alertThresholds.responseTime} 
                    onChange={(e) => handleAlertThresholdChange('responseTime', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Оповещать при превышении порога</p>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={handleSaveSettings}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Сохранить настройки производительности
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceSettings;
