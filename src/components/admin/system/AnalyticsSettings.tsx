
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BarChart2, Save, BarChart } from 'lucide-react';

const AnalyticsSettings: React.FC = () => {
  const [isGoogleAnalytics, setIsGoogleAnalytics] = useState(true);
  const [isSelfHosted, setIsSelfHosted] = useState(false);
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('UA-123456789-1');
  const [dataRetentionDays, setDataRetentionDays] = useState('90');
  const [collectUserData, setCollectUserData] = useState({
    userBehavior: true,
    userQueries: true,
    performance: true,
    errors: true
  });
  
  const handleSaveSettings = () => {
    console.log('Saving analytics settings:', {
      isGoogleAnalytics, isSelfHosted, googleAnalyticsId,
      dataRetentionDays, collectUserData
    });
    // Here would be an API call to save settings
  };
  
  const handleToggleCollectData = (key: keyof typeof collectUserData) => {
    setCollectUserData({
      ...collectUserData,
      [key]: !collectUserData[key]
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center mb-6 space-x-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Настройки аналитики системы</h3>
          </div>
          
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="google-analytics">Google Analytics</Label>
                <p className="text-sm text-muted-foreground">Использовать Google Analytics для сбора данных</p>
              </div>
              <Switch 
                id="google-analytics" 
                checked={isGoogleAnalytics}
                onCheckedChange={setIsGoogleAnalytics}
              />
            </div>
            
            {isGoogleAnalytics && (
              <div className="pl-4 border-l-2 border-primary/20 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ga-id">Google Analytics ID</Label>
                  <Input 
                    id="ga-id" 
                    value={googleAnalyticsId} 
                    onChange={(e) => setGoogleAnalyticsId(e.target.value)} 
                    placeholder="UA-XXXXXXXXX-X или G-XXXXXXXXXX"
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="self-hosted">Собственная аналитика</Label>
                <p className="text-sm text-muted-foreground">Использовать самостоятельный сбор данных</p>
              </div>
              <Switch 
                id="self-hosted" 
                checked={isSelfHosted}
                onCheckedChange={setIsSelfHosted}
              />
            </div>
            
            {isSelfHosted && (
              <div className="pl-4 border-l-2 border-primary/20 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="data-retention">Хранение данных (дней)</Label>
                  <Input 
                    id="data-retention" 
                    type="number"
                    value={dataRetentionDays} 
                    onChange={(e) => setDataRetentionDays(e.target.value)} 
                    placeholder="90"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Собираемые данные</Label>
                  
                  <div className="space-y-2 pl-2">
                    {Object.entries(collectUserData).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Switch 
                          id={`collect-${key}`} 
                          checked={value}
                          onCheckedChange={() => handleToggleCollectData(key as keyof typeof collectUserData)}
                        />
                        <Label htmlFor={`collect-${key}`}>
                          {key === 'userBehavior' ? 'Поведение пользователей' : 
                           key === 'userQueries' ? 'Поисковые запросы' : 
                           key === 'performance' ? 'Производительность системы' : 
                           key === 'errors' ? 'Ошибки и исключения' : key}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="pt-2">
              <Button 
                onClick={handleSaveSettings}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Сохранить настройки аналитики
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsSettings;
