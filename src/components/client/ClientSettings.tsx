
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ClientSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg md:text-xl font-semibold">Настройки профиля</h3>
      
      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Имя</Label>
              <Input id="firstName" defaultValue="Иван" />
            </div>
            <div>
              <Label htmlFor="lastName">Фамилия</Label>
              <Input id="lastName" defaultValue="Петров" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="ivan.petrov@example.com" />
            </div>
            <div>
              <Label htmlFor="phone">Телефон</Label>
              <Input id="phone" defaultValue="+7 (999) 123-45-67" />
            </div>
          </div>
          <Button>Сохранить изменения</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Предпочтения</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Тема интерфейса</Label>
              <p className="text-sm text-muted-foreground">Выберите светлую или темную тему</p>
            </div>
            <Select defaultValue="system">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Светлая</SelectItem>
                <SelectItem value="dark">Темная</SelectItem>
                <SelectItem value="system">Системная</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Автоматические отчеты</Label>
              <p className="text-sm text-muted-foreground">Создавать еженедельные отчеты автоматически</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientSettings;
