
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import ClientProfileTab from './settings/ClientProfileTab';
import ClientNotificationsTab from './settings/ClientNotificationsTab';

type ThemeValue = 'light' | 'dark' | 'system';

/**
 * Настройки профиля.
 *
 * Раньше здесь были вписаны чужие «Иван», «Петров», ivan.petrov@example.com и
 * телефон, кнопка «Сохранить изменения» ничего не делала, выбор темы никуда не
 * применялся, а переключатель «Автоматические отчеты» не был связан ни с чем
 * на сервере. Теперь имя читается из профиля и сохраняется в базу, тема
 * переключается по-настоящему, а вместо выдуманного переключателя — настройки
 * почтовых уведомлений, которые учитывает сервер при рассылке.
 */
const ClientSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <h3 className="text-lg md:text-xl font-semibold">Настройки профиля</h3>

      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientProfileTab />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Предпочтения</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label>Тема интерфейса</Label>
              <p className="text-sm text-muted-foreground">Выберите светлую или темную тему</p>
            </div>
            <Select value={theme} onValueChange={(value) => setTheme(value as ThemeValue)}>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Уведомления</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientNotificationsTab />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientSettings;
