
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Shield, Save, RefreshCw } from 'lucide-react';

const SecuritySettings: React.FC = () => {
  const [isTwoFactor, setIsTwoFactor] = useState(false);
  const [isIPRestriction, setIsIPRestriction] = useState(false);
  const [isBruteForceProtection, setIsBruteForceProtection] = useState(true);
  const [allowedIPs, setAllowedIPs] = useState('');
  
  const handleSaveSettings = () => {
    console.log('Saving security settings:', {
      isTwoFactor, isIPRestriction, isBruteForceProtection, allowedIPs
    });
    // Here would be an API call to save settings
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center mb-6 space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Настройки безопасности</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="two-factor">Двухфакторная аутентификация</Label>
                <p className="text-sm text-muted-foreground">Требовать двухфакторную аутентификацию для всех админов</p>
              </div>
              <Switch 
                id="two-factor" 
                checked={isTwoFactor}
                onCheckedChange={setIsTwoFactor}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ip-restriction">Ограничение по IP</Label>
                <p className="text-sm text-muted-foreground">Ограничить доступ к админ-панели по IP-адресам</p>
              </div>
              <Switch 
                id="ip-restriction" 
                checked={isIPRestriction}
                onCheckedChange={setIsIPRestriction}
              />
            </div>
            
            {isIPRestriction && (
              <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                <Label htmlFor="allowed-ips">Разрешенные IP-адреса</Label>
                <Input 
                  id="allowed-ips" 
                  value={allowedIPs} 
                  onChange={(e) => setAllowedIPs(e.target.value)} 
                  placeholder="Например: 192.168.1.1, 10.0.0.1"
                />
                <p className="text-xs text-muted-foreground">Укажите разрешенные IP-адреса через запятую</p>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="brute-force">Защита от перебора паролей</Label>
                <p className="text-sm text-muted-foreground">Блокировать попытки подбора паролей</p>
              </div>
              <Switch 
                id="brute-force" 
                checked={isBruteForceProtection}
                onCheckedChange={setIsBruteForceProtection}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="admin-password">Глобальный пароль администратора</Label>
              <Input 
                id="admin-password" 
                type="password" 
                placeholder="Новый пароль администратора"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Подтверждение пароля</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                placeholder="Подтвердите пароль"
              />
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={handleSaveSettings}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Сохранить настройки безопасности
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
