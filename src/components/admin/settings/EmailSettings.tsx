import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from 'lucide-react';

/**
 * Email-уведомления.
 *
 * Здесь были переключатели писем о завершении аудита, платежах и новых
 * пользователях, поля SMTP с подставленными smtp.example.com и паролем
 * «password», а кнопки «Тестовое письмо» и «Сохранить настройки» не имели
 * обработчиков вовсе. Настройки сбрасывались при перезагрузке и ни на что не
 * влияли: письма сервис шлёт серверной функцией через Resend, SMTP не
 * используется.
 */
const EmailSettings: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Info className="h-5 w-5 text-muted-foreground" />
        Настройки писем здесь не хранятся
      </CardTitle>
      <CardDescription>
        Какие письма отправлять и через какой сервер, из админки не настраивается.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-3 text-sm text-muted-foreground">
      <p>
        Письма уходят через серверную функцию send-email и почтовый сервис Resend. Ключ Resend
        хранится в секретах проекта Supabase, SMTP-сервер и пароль сервис не использует.
      </p>
      <p>
        Проверить, что отправка работает, можно на странице{' '}
        <Link to="/admin/system/email" className="text-primary hover:underline">
          «Настройки почты»
        </Link>{' '}
        — там тестовое письмо уходит по-настоящему.
      </p>
    </CardContent>
  </Card>
);

export default EmailSettings;
