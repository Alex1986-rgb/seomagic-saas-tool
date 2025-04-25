
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, RefreshCw, Shield } from 'lucide-react';
import { useProxyManager } from '@/hooks/use-proxy-manager';
import { useToast } from '@/hooks/use-toast';

interface PositionTrackerSettingsProps {
  onClose?: () => void;
}

export const PositionTrackerSettings: React.FC<PositionTrackerSettingsProps> = ({ onClose }) => {
  const { 
    activeProxies, 
    isLoading, 
    collectProxies, 
    testProxies,
    getCaptchaApiKey,
    setBotableApiKey,
    setCaptchaApiKey,
    getBotableApiKey
  } = useProxyManager();
  
  const [captchaApiKey, setCaptchaKey] = useState('');
  const [botableApiKey, setBotableKey] = useState('');
  const [useProxy, setUseProxy] = useState(true);
  const [checkInterval, setCheckInterval] = useState(60);
  const { toast } = useToast();

  useEffect(() => {
    // Загрузка сохраненных настроек
    const savedSettings = localStorage.getItem('position_tracker_settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setUseProxy(settings.useProxy !== undefined ? settings.useProxy : true);
        setCheckInterval(settings.checkInterval || 60);
      } catch (error) {
        console.error('Ошибка загрузки настроек:', error);
      }
    }
    
    // Загрузка ключей API
    setCaptchaKey(getCaptchaApiKey() || '');
    setBotableKey(getBotableApiKey() || '');
  }, [getCaptchaApiKey, getBotableApiKey]);

  const handleSaveSettings = () => {
    try {
      const settings = {
        useProxy,
        checkInterval
      };
      
      localStorage.setItem('position_tracker_settings', JSON.stringify(settings));
      
      if (captchaApiKey) {
        setCaptchaApiKey(captchaApiKey);
      }
      
      if (botableApiKey) {
        setBotableApiKey(botableApiKey);
      }
      
      toast({
        title: "Настройки сохранены",
        description: "Настройки трекера позиций успешно сохранены",
      });
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
      toast({
        title: "Ошибка сохранения",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive",
      });
    }
  };

  const handleCollectProxies = async () => {
    await collectProxies();
  };

  const handleTestProxies = async () => {
    await testProxies();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Настройки трекера позиций
        </CardTitle>
        <CardDescription>
          Настройка параметров проверки и используемых прокси
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="general">Основные настройки</TabsTrigger>
            <TabsTrigger value="proxy">Прокси и защита</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Интервал проверки позиций (минуты)</Label>
              <Input 
                type="number"
                value={checkInterval}
                onChange={(e) => setCheckInterval(Number(e.target.value))}
                min={5}
                max={1440}
              />
              <p className="text-xs text-muted-foreground">
                Минимальный интервал между автоматическими проверками позиций
              </p>
            </div>

            <div className="flex flex-col space-y-1.5 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="use-proxy">Использовать прокси</Label>
                <Switch 
                  id="use-proxy" 
                  checked={useProxy}
                  onCheckedChange={setUseProxy}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Использование прокси помогает избежать блокировок и получать более точные результаты
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="proxy" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Активные прокси</Label>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {activeProxies.length}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCollectProxies}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Собрать прокси
                </Button>
                <Button
                  variant="outline"
                  onClick={handleTestProxies}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Проверить прокси
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {isLoading 
                  ? "Выполняется операция с прокси..." 
                  : activeProxies.length > 0 
                    ? `Доступно ${activeProxies.length} прокси для использования`
                    : "Нет активных прокси. Нажмите 'Собрать прокси' для автоматического сбора"}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Для более детальной настройки прокси перейдите в <a href="/admin/proxies" className="text-primary hover:underline">раздел управления прокси</a>
              </p>
            </div>
            
            <div className="space-y-2 pt-2 border-t">
              <Label>IP Captcha Guru API ключ</Label>
              <Input
                type="password"
                value={captchaApiKey}
                onChange={(e) => setCaptchaKey(e.target.value)}
                placeholder="Введите API ключ для IPCaptchaGuru"
              />
              <p className="text-xs text-muted-foreground">
                Используется для обхода капчи при проверке позиций
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Botable API ключ</Label>
              <Input
                type="password"
                value={botableApiKey}
                onChange={(e) => setBotableKey(e.target.value)}
                placeholder="Введите API ключ для Botable"
              />
              <p className="text-xs text-muted-foreground">
                Используется для обхода защиты от ботов
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
          )}
          <Button onClick={handleSaveSettings}>
            Сохранить настройки
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PositionTrackerSettings;
