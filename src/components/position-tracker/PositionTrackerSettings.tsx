import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from 'lucide-react';
import { useProxyManager } from '@/hooks/use-proxy-manager';
import { useToast } from '@/hooks/use-toast';
import { GeneralSettingsTab } from './settings/GeneralSettingsTab';
import { ProxySettingsTab } from './settings/ProxySettingsTab';
import { ApiSettingsSection } from './settings/ApiSettingsSection';

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
    getBotableApiKey,
    proxyManager
  } = useProxyManager();
  
  const [captchaApiKey, setCaptchaKey] = useState('');
  const [botableApiKey, setBotableKey] = useState('');
  const [useProxy, setUseProxy] = useState(true);
  const [checkInterval, setCheckInterval] = useState(60);
  const [testUrl, setTestUrl] = useState('https://api.ipify.org/');
  const [clearBeforeCollect, setClearBeforeCollect] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Загрузка сохраненных настроек
    const savedSettings = localStorage.getItem('position_tracker_settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setUseProxy(settings.useProxy !== undefined ? settings.useProxy : true);
        setCheckInterval(settings.checkInterval || 60);
        setClearBeforeCollect(settings.clearBeforeCollect !== undefined ? settings.clearBeforeCollect : true);
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
        checkInterval,
        clearBeforeCollect
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
    await collectProxies(clearBeforeCollect);
  };

  const handleTestProxies = async () => {
    await testProxies(proxyManager.getAllProxies(), testUrl);
  };

  const handleClearProxies = async () => {
    try {
      proxyManager.clearAllProxies();
      toast({
        title: "Список прокси очищен",
        description: "Все прокси успешно удалены",
      });
    } catch (error) {
      toast({
        title: "Ошибка очистки прокси",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive",
      });
    }
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
            <GeneralSettingsTab
              checkInterval={checkInterval}
              setCheckInterval={setCheckInterval}
              useProxy={useProxy}
              setUseProxy={setUseProxy}
            />
          </TabsContent>
          
          <TabsContent value="proxy" className="space-y-4 pt-4">
            <ProxySettingsTab
              activeProxies={activeProxies.length}
              isLoading={isLoading}
              clearBeforeCollect={clearBeforeCollect}
              setClearBeforeCollect={setClearBeforeCollect}
              testUrl={testUrl}
              setTestUrl={setTestUrl}
              onCollectProxies={handleCollectProxies}
              onTestProxies={handleTestProxies}
              onClearProxies={handleClearProxies}
            />
            
            <ApiSettingsSection
              captchaApiKey={captchaApiKey}
              setCaptchaKey={setCaptchaKey}
              botableApiKey={botableApiKey}
              setBotableKey={setBotableKey}
            />
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
