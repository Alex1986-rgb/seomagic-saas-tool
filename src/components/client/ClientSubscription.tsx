import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Подписка.
 *
 * Здесь была нарисована действующая подписка: «Pro План», значок «Активна»,
 * 2900 ₽ в месяц, следующий платёж 15 января 2025 года и «47 из 50 аудитов».
 * Ничего этого нет: приём оплаты не подключён, тарифов и лимитов в базе не
 * существует. Человек видел оплаченный план, за который не платил, и считал,
 * что у него есть остаток проверок.
 *
 * Пока платежи не подключены, честно говорим об этом и даём способ связаться.
 */
const ClientSubscription: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg md:text-xl font-semibold">Подписка</h3>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-muted-foreground" />
            Оплата пока не подключена
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Тарифов и автоматических списаний сейчас нет: аудит и оптимизация работают без
            подписки. Когда понадобится объём больше обычного или счёт на организацию —
            напишите нам, согласуем работы и выставим счёт.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/contact">Написать нам</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/audit">Проверить сайт</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientSubscription;
