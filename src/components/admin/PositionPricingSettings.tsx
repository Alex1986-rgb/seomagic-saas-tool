import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from 'lucide-react';

/**
 * Цены мониторинга позиций.
 *
 * Здесь была форма на четыре вкладки: «цена за ключевое слово 0,30 ₽»,
 * множители частоты и региона, три тарифа за 500 / 1900 / 4900 ₽, скидки за
 * объём 5–20 %, пробный период на 7 дней, «white label» за 3000 ₽. Кнопка
 * «Сохранить настройки» только показывала «Настройки сохранены», а «Сбросить
 * настройки» — «Цены возвращены к значениям по умолчанию», не меняя ни одного
 * поля. Ни таблицы, ни настройки для цен мониторинга в проекте нет
 * (pricing_rules — это прайс оптимизации), и ни одно из этих чисел нигде не
 * применялось; с тарифами на публичной странице они к тому же не совпадали.
 *
 * Тарифы, которые видят посетители на /position-pricing, заданы прямо в коде
 * компонента PositionPricingPlans. Пока цены мониторинга не хранятся в базе,
 * раздел только говорит, где их менять, — чтобы никто не правил поля, думая,
 * что они сохраняются.
 */
const PositionPricingSettings: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-muted-foreground" />
          Цены мониторинга из админки не настраиваются
        </CardTitle>
        <CardDescription>
          Цены мониторинга позиций нигде не хранятся: ни таблицы, ни настройки для них нет.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          Тарифы на странице{' '}
          <Link to="/position-pricing" className="text-primary hover:underline">
            «Мониторинг позиций»
          </Link>{' '}
          заданы в коде, в файле{' '}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            src/components/position-pricing/PositionPricingPlans.tsx
          </code>
          . Чтобы изменить цену или состав тарифа, нужно поправить этот файл и заново
          опубликовать сайт.
        </p>
        <p>
          Форма, которая была здесь раньше, ничего не сохраняла: кнопки «Сохранить» и
          «Сбросить» только показывали сообщение об успехе, а числа в полях не совпадали с
          тарифами на сайте. Поэтому она убрана.
        </p>
        <p>
          Цены оптимизации — другое дело: они хранятся в базе и редактируются на вкладке
          «Цены оптимизации».
        </p>
      </CardContent>
    </Card>
  );
};

export default PositionPricingSettings;
