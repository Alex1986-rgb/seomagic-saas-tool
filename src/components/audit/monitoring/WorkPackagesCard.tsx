import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Star } from 'lucide-react';
import { OptimizationItem } from '@/types/audit/optimization-types';

interface WorkPackage {
  id: 'basic' | 'standard' | 'premium';
  name: string;
  description: string;
  price: number;
  discount: number;
  includes: string[];
  recommended?: boolean;
}

interface WorkPackagesCardProps {
  items: OptimizationItem[];
  onPackageSelect: (packageId: 'basic' | 'standard' | 'premium') => void;
  selectedPackage?: 'basic' | 'standard' | 'premium';
}

export const WorkPackagesCard: React.FC<WorkPackagesCardProps> = ({
  items,
  onPackageSelect,
  selectedPackage,
}) => {
  const totalCost = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  const packages: WorkPackage[] = [
    {
      id: 'basic',
      name: 'Базовый',
      description: 'Основные критические исправления',
      price: Math.round(totalCost * 0.4),
      discount: 0,
      includes: [
        'Исправление критических SEO-ошибок',
        'Базовая оптимизация мета-тегов',
        'Исправление битых ссылок',
        'Минимальная техническая оптимизация',
      ],
    },
    {
      id: 'standard',
      name: 'Стандарт',
      description: 'Комплексное улучшение сайта',
      price: Math.round(totalCost * 0.7),
      discount: 15,
      includes: [
        'Все из пакета "Базовый"',
        'Полная оптимизация контента',
        'Улучшение структуры заголовков',
        'Оптимизация изображений',
        'Настройка производительности',
        'Техническая SEO оптимизация',
      ],
      recommended: true,
    },
    {
      id: 'premium',
      name: 'Премиум',
      description: 'Максимальная оптимизация под ключ',
      price: totalCost,
      discount: 25,
      includes: [
        'Все из пакета "Стандарт"',
        'Создание семантического ядра',
        'Расширенная оптимизация контента',
        'A/B тестирование заголовков',
        'Оптимизация конверсии',
        'Настройка аналитики и отчетности',
        'Консультации и поддержка 30 дней',
        'Гарантия результата',
      ],
    },
  ];

  const getFinalPrice = (pkg: WorkPackage) => {
    return Math.round(pkg.price * (1 - pkg.discount / 100));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {packages.map((pkg) => {
        const finalPrice = getFinalPrice(pkg);
        const isSelected = selectedPackage === pkg.id;

        return (
          <Card
            key={pkg.id}
            className={`relative transition-all duration-300 ${
              pkg.recommended
                ? 'border-primary shadow-lg scale-105'
                : 'border-border hover:border-primary/50'
            } ${isSelected ? 'ring-2 ring-primary' : ''}`}
          >
            {pkg.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground shadow-md">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  РЕКОМЕНДУЕМ
                </Badge>
              </div>
            )}

            <CardHeader className="pb-4">
              <CardTitle className="text-xl">{pkg.name}</CardTitle>
              <CardDescription className="text-sm">{pkg.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Price */}
              <div className="space-y-1">
                {pkg.discount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground line-through">
                      {pkg.price.toLocaleString('ru-RU')} ₽
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      -{pkg.discount}%
                    </Badge>
                  </div>
                )}
                <div className="text-3xl font-bold">
                  {finalPrice.toLocaleString('ru-RU')} ₽
                </div>
                <div className="text-xs text-muted-foreground">
                  {pkg.discount > 0
                    ? `Экономия ${(pkg.price - finalPrice).toLocaleString('ru-RU')} ₽`
                    : 'Базовая цена'}
                </div>
              </div>

              {/* Includes */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Включено:</div>
                <ul className="space-y-2">
                  {pkg.includes.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <Button
                className="w-full"
                variant={isSelected ? 'default' : pkg.recommended ? 'default' : 'outline'}
                onClick={() => onPackageSelect(pkg.id)}
              >
                {isSelected ? 'Выбрано' : 'Выбрать пакет'}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
