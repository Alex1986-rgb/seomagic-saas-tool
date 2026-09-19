
import React from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/*
 * В таблице были строки о функциях, которых в сервисе нет: «Анализ
 * конкурентов», «Расчет PageRank», «Мониторинг позиций» по расписанию
 * (еженедельно / 3 раза в неделю / ежедневно — проверки запускаются вручную),
 * «История позиций 7/30/90 дней», «Уведомления об изменениях» по Email и SMS,
 * «API доступ», «White label», «Командный доступ» и уровни поддержки с
 * несуществующим форумом. Эти строки убраны. Оставшиеся лимиты по тарифам
 * в сервисе пока не применяются — их утверждает владелец, об этом сказано
 * под таблицей.
 */
const FeatureComparison: React.FC = () => {
  // Сравнительная таблица возможностей
  const featureComparison = [
    {
      name: 'Количество сайтов',
      free: '1',
      basic: '5',
      pro: '15',
      agency: 'Неограниченно',
    },
    {
      name: 'SEO-аудит',
      free: 'Базовый',
      basic: 'Полный',
      pro: 'Расширенный',
      agency: 'Полный',
    },
    {
      name: 'Оптимизации в месяц',
      free: '0',
      basic: '3',
      pro: '20',
      agency: 'Неограниченно',
    },
    {
      name: 'Проверка позиций',
      free: '10 запросов',
      basic: '100 запросов',
      pro: '500 запросов',
      agency: 'Неограниченно',
    },
    {
      name: 'Поиск битых ссылок',
      free: '✖',
      basic: '✓',
      pro: '✓',
      agency: '✓',
    },
    {
      name: 'Анализ дубликатов',
      free: '✖',
      basic: '✓',
      pro: '✓',
      agency: '✓',
    },
    {
      name: 'Генерация sitemap',
      free: 'Базовая',
      basic: 'Полная',
      pro: 'Расширенная',
      agency: 'Расширенная',
    },
    {
      name: 'Визуализация структуры',
      free: '✖',
      basic: '✖',
      pro: '✓',
      agency: '✓',
    },
    {
      name: 'Проверка уникальности',
      free: '✖',
      basic: '✖',
      pro: '✓',
      agency: '✓',
    },
    {
      name: 'Региональность проверки',
      free: '1 регион',
      basic: '3 региона',
      pro: '10 регионов',
      agency: 'Все регионы',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-10">Сравнение возможностей</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-4 px-4">Возможности</th>
              <th className="py-4 px-4 text-center">Бесплатно</th>
              <th className="py-4 px-4 text-center">Базовый</th>
              <th className="py-4 px-4 text-center">Про</th>
              <th className="py-4 px-4 text-center">Агентство</th>
            </tr>
          </thead>
          <tbody>
            {featureComparison.map((feature, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-secondary/10" : ""}>
                <td className="py-4 px-4 font-medium">
                  <div className="flex items-center gap-1">
                    {feature.name}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Информация о возможности "{feature.name}"</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">{feature.free}</td>
                <td className="py-4 px-4 text-center">{feature.basic}</td>
                <td className="py-4 px-4 text-center">{feature.pro}</td>
                <td className="py-4 px-4 text-center">{feature.agency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted-foreground text-center mt-6">
        Оплата на сайте пока не подключена, и лимиты тарифов в сервисе не применяются.
        Объём работ согласуем по заявке и выставим счёт.
      </p>
    </div>
  );
};

export default FeatureComparison;
