
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save, Trash, RefreshCw } from 'lucide-react';

const SecuritySettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="password">Пароль администратора</Label>
        <Input id="password" type="password" defaultValue="secure-password" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="new-password">Новый пароль</Label>
        <Input id="new-password" type="password" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Подтвердите пароль</Label>
        <Input id="confirm-password" type="password" />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch id="two-factor" />
        <Label htmlFor="two-factor">Двухфакторная аутентификация</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch id="api-access" defaultChecked />
        <Label htmlFor="api-access">Разрешить API доступ</Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="api-key">API Ключ</Label>
        <div className="flex gap-2">
          <Input 
            id="api-key" 
            defaultValue="api-key-123456789" 
            readOnly
            className="font-mono"
          />
          <Button variant="outline">Обновить</Button>
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-4">Опасная зона</h3>
        <div className="flex gap-4">
          <Button variant="destructive" className="gap-2">
            <Trash className="h-4 w-4" />
            <span>Удалить все данные</span>
          </Button>
          <Button variant="destructive" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            <span>Сбросить настройки</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
