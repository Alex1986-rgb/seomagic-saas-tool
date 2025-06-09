
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, CreditCard } from 'lucide-react';

const ClientSubscription: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg md:text-xl font-semibold">Управление подпиской</h3>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Pro План
            </CardTitle>
            <Badge className="bg-green-500/10 text-green-500">Активна</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Стоимость</p>
              <p className="text-lg font-bold">2900 ₽/месяц</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Следующий платеж</p>
              <p className="font-medium">15 января 2025</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Аудитов осталось</p>
              <p className="font-bold text-primary">47 из 50</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button>
              <CreditCard className="h-4 w-4 mr-2" />
              Изменить план
            </Button>
            <Button variant="outline">Управление платежами</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Доступные возможности</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              До 50 SEO аудитов в месяц
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              Отслеживание позиций (до 100 ключевых слов)
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              Экспорт отчетов в PDF и Excel
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              Техническая поддержка 24/7
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientSubscription;
