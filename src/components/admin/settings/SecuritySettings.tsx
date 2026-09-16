import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from 'lucide-react';

/**
 * Безопасность.
 *
 * Здесь было поле «Пароль администратора» с подставленным значением
 * «secure-password», «API Ключ» api-key-123456789, переключатели двухфакторной
 * аутентификации и API-доступа и красные кнопки «Удалить все данные» и
 * «Сбросить настройки». Ни у одной кнопки не было обработчика, ни одно поле
 * ничего не меняло — всё это выдумано.
 */
const SecuritySettings: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Info className="h-5 w-5 text-muted-foreground" />
        Безопасность из админки не настраивается
      </CardTitle>
      <CardDescription>
        Паролей, API-ключей и «опасной зоны» на этой вкладке больше нет: они ничего не делали.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-3 text-sm text-muted-foreground">
      <p>
        Вход и пароли обслуживает Supabase Auth, права администратора дают роли пользователей.
        Двухфакторная аутентификация и ограничения входа настраиваются в панели Supabase.
      </p>
      <p>
        Подробнее — на странице{' '}
        <Link to="/admin/system/security" className="text-primary hover:underline">
          «Безопасность»
        </Link>
        .
      </p>
    </CardContent>
  </Card>
);

export default SecuritySettings;
