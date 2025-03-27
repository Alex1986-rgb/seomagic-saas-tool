
import React from 'react';
import { Shield, LockKeyhole, ShieldCheck, Key, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ClientSecurityTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b pb-4 mb-6">
        <ShieldCheck className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">Безопасность аккаунта</h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LockKeyhole className="h-5 w-5" />
              Двухфакторная аутентификация
            </CardTitle>
            <CardDescription>
              Усильте безопасность вашего аккаунта с помощью 2FA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <Label htmlFor="2fa">Статус 2FA</Label>
                <p className="text-sm text-muted-foreground">
                  В настоящее время отключено
                </p>
              </div>
              <Switch id="2fa" />
            </div>
            <div className="rounded-lg border p-3 bg-muted/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Рекомендуемая настройка</h4>
                  <p className="text-sm text-muted-foreground">
                    Включение 2FA значительно повышает безопасность вашего аккаунта
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Настроить 2FA
            </Button>
          </CardFooter>
        </Card>

        <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Активные сессии
            </CardTitle>
            <CardDescription>
              Управляйте всеми устройствами, на которых вы вошли в аккаунт
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Chrome на Windows</p>
                  <p className="text-sm text-muted-foreground">Москва, Россия • Текущее устройство</p>
                </div>
                <Button variant="ghost" size="sm" disabled>
                  Активно
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Firefox на MacOS</p>
                  <p className="text-sm text-muted-foreground">Санкт-Петербург, Россия • 2 дня назад</p>
                </div>
                <Button variant="outline" size="sm">
                  Завершить
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" className="w-full">
              Завершить все сеансы
            </Button>
          </CardFooter>
        </Card>

        <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Настройки безопасности
            </CardTitle>
            <CardDescription>
              Дополнительные настройки для вашего аккаунта
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="login-alerts">Уведомления о входе</Label>
                <p className="text-sm text-muted-foreground">
                  Получайте уведомления о новых входах в аккаунт
                </p>
              </div>
              <Switch id="login-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="suspicious">Блокировка подозрительной активности</Label>
                <p className="text-sm text-muted-foreground">
                  Автоматически блокировать подозрительные действия
                </p>
              </div>
              <Switch id="suspicious" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="data-access">Журнал доступа к данным</Label>
                <p className="text-sm text-muted-foreground">
                  Вести подробный журнал доступа к вашим данным
                </p>
              </div>
              <Switch id="data-access" />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Опасная зона
            </CardTitle>
            <CardDescription>
              Необратимые действия для вашего аккаунта
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-destructive/20 p-4 bg-destructive/5">
              <h4 className="font-medium mb-1">Сбросить все настройки</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Все ваши настройки и предпочтения будут сброшены до значений по умолчанию.
              </p>
              <Button variant="outline" size="sm">Сбросить настройки</Button>
            </div>
            <div className="rounded-lg border border-destructive/20 p-4 bg-destructive/5">
              <h4 className="font-medium mb-1">Удалить аккаунт</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Удаление аккаунта приведет к безвозвратной потере всех данных.
              </p>
              <Button variant="destructive" size="sm">Удалить аккаунт</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientSecurityTab;
