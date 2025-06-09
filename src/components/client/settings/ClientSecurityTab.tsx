
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield, Key, Smartphone } from 'lucide-react';

const ClientSecurityTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg md:text-xl font-semibold">Безопасность аккаунта</h3>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Смена пароля
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="current-password">Текущий пароль</Label>
            <Input id="current-password" type="password" />
          </div>
          <div>
            <Label htmlFor="new-password">Новый пароль</Label>
            <Input id="new-password" type="password" />
          </div>
          <div>
            <Label htmlFor="confirm-password">Подтвердите новый пароль</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button>Обновить пароль</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Двухфакторная аутентификация
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">2FA через SMS</p>
              <p className="text-sm text-muted-foreground">Дополнительная защита через SMS-код</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">2FA через приложение</p>
              <p className="text-sm text-muted-foreground">Используйте Google Authenticator или аналогичное приложение</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            История входов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
              <div>
                <p className="font-medium text-sm">Текущий сеанс</p>
                <p className="text-xs text-muted-foreground">Chrome на Windows • 192.168.1.1</p>
              </div>
              <span className="text-xs text-green-500">Активен</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/10 rounded-md">
              <div>
                <p className="font-medium text-sm">14 декабря 2024, 15:30</p>
                <p className="text-xs text-muted-foreground">Safari на iPhone • 192.168.1.5</p>
              </div>
              <span className="text-xs text-muted-foreground">Завершен</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientSecurityTab;
