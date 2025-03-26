
import React from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      name: 'Анализ конкурентов',
      free: '✖',
      basic: '✖',
      pro: '✓',
      agency: '✓',
    },
    {
      name: 'Оптимизации в месяц',
      free: '0',
      basic: '3',
      pro: '20',
      agency: 'Неограниченно',
    },
    {
      name: 'API доступ',
      free: '✖',
      basic: '✖',
      pro: '✓',
      agency: '✓ (расширенный)',
    },
    {
      name: 'White label',
      free: '✖',
      basic: '✖',
      pro: '✖',
      agency: '✓',
    },
    {
      name: 'Техническая поддержка',
      free: 'Форум',
      basic: 'Email',
      pro: 'Приоритетная',
      agency: 'Выделенная',
    },
    {
      name: 'Командный доступ',
      free: '✖',
      basic: '✖',
      pro: '✖',
      agency: '✓',
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
    </div>
  );
};

export default FeatureComparison;
