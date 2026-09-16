
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Key } from 'lucide-react';
import ClientPasswordTab from './ClientPasswordTab';

/**
 * Безопасность аккаунта.
 *
 * Здесь были декорации: кнопка «Обновить пароль» без обработчика, переключатели
 * двухфакторной защиты по SMS и через приложение, которые ни к чему не
 * подключены, и «История входов» с выдуманными сеансами («Chrome на Windows •
 * 192.168.1.1», «Safari на iPhone»). Смена пароля теперь настоящая, а про
 * остальное честно сказано, что его пока нет.
 */
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
        <CardContent>
          <ClientPasswordTab />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Двухфакторная защита и история входов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Пока не подключены: включить второй фактор или посмотреть список сеансов здесь нельзя.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientSecurityTab;
