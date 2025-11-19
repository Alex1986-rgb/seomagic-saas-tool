import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DollarSign, Package, Calculator, Clock, TrendingUp } from 'lucide-react';
import { OptimizationItem } from '@/types/audit/optimization-types';
import { WorkPackagesCard } from './WorkPackagesCard';

interface CostEstimatorProps {
  items: OptimizationItem[];
  discount?: number;
  onPackageSelect?: (pkg: 'basic' | 'standard' | 'premium') => void;
}

export const CostEstimator: React.FC<CostEstimatorProps> = ({
  items,
  discount = 0,
  onPackageSelect,
}) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(
    new Set(items.map((item) => item.id || ''))
  );
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'standard' | 'premium'>('standard');

  const categorizedItems = useMemo(() => {
    const categories: Record<string, OptimizationItem[]> = {};
    items.forEach((item) => {
      const category = item.category || 'Другое';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    });
    return categories;
  }, [items]);

  const selectedTotal = useMemo(() => {
    return items
      .filter((item) => selectedItems.has(item.id || ''))
      .reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  }, [items, selectedItems]);

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    Object.entries(categorizedItems).forEach(([category, categoryItems]) => {
      totals[category] = categoryItems
        .filter((item) => selectedItems.has(item.id || ''))
        .reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    });
    return totals;
  }, [categorizedItems, selectedItems]);

  const totalCost = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const discountAmount = Math.round((selectedTotal * discount) / 100);
  const finalTotal = selectedTotal - discountAmount;

  const estimatedTime = useMemo(() => {
    const selectedCount = selectedItems.size;
    const days = Math.ceil(selectedCount / 5); // 5 работ в день
    return `${days} ${days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}`;
  }, [selectedItems]);

  const toggleItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500';
      case 'low':
        return 'bg-blue-500/10 text-blue-600 border-blue-500';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handlePackageSelect = (pkg: 'basic' | 'standard' | 'premium') => {
    setSelectedPackage(pkg);
    onPackageSelect?.(pkg);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Детальная смета оптимизации</h3>
          <p className="text-muted-foreground">
            Выберите необходимые работы или готовый пакет
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Итого:</div>
          <div className="text-3xl font-bold text-primary">
            {finalTotal.toLocaleString('ru-RU')} ₽
          </div>
          {discount > 0 && (
            <Badge variant="secondary" className="mt-1">
              Скидка {discount}%: -{discountAmount.toLocaleString('ru-RU')} ₽
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="packages" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="packages">
            <Package className="h-4 w-4 mr-2" />
            Пакеты работ
          </TabsTrigger>
          <TabsTrigger value="calculator">
            <Calculator className="h-4 w-4 mr-2" />
            Калькулятор
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <Clock className="h-4 w-4 mr-2" />
            Сроки
          </TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-6">
          <WorkPackagesCard
            items={items}
            onPackageSelect={handlePackageSelect}
            selectedPackage={selectedPackage}
          />
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Интерактивный калькулятор</CardTitle>
              <CardDescription>
                Выберите необходимые работы для расчета стоимости
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-6">
                  {Object.entries(categorizedItems).map(([category, categoryItems]) => (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center justify-between sticky top-0 bg-background py-2 z-10">
                        <h4 className="font-semibold text-lg">{category}</h4>
                        <Badge variant="outline">
                          {categoryTotals[category]?.toLocaleString('ru-RU')} ₽
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {categoryItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                          >
                            <Checkbox
                              checked={selectedItems.has(item.id || '')}
                              onCheckedChange={() => toggleItem(item.id || '')}
                              className="mt-1"
                            />
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium">{item.name}</span>
                                <Badge
                                  variant="outline"
                                  className={getPriorityColor(item.priority || 'medium')}
                                >
                                  {item.priority || 'medium'}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {item.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-muted-foreground">
                                  Кол-во: {item.count}
                                </span>
                                <span className="text-muted-foreground">
                                  Цена: {(item.price || 0).toLocaleString('ru-RU')} ₽
                                </span>
                                <span className="font-semibold">
                                  Итого: {(item.totalPrice || 0).toLocaleString('ru-RU')} ₽
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Выбрано работ:</span>
                  <span className="font-medium">{selectedItems.size} из {items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Сумма:</span>
                  <span className="font-medium">{selectedTotal.toLocaleString('ru-RU')} ₽</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Скидка ({discount}%):</span>
                    <span>-{discountAmount.toLocaleString('ru-RU')} ₽</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Итого:</span>
                  <span className="text-primary">{finalTotal.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Временная оценка</CardTitle>
              <CardDescription>
                Примерные сроки выполнения работ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-accent/50">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <Clock className="h-8 w-8 mx-auto text-primary" />
                      <div className="text-2xl font-bold">{estimatedTime}</div>
                      <div className="text-sm text-muted-foreground">Оценка выполнения</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-accent/50">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <DollarSign className="h-8 w-8 mx-auto text-primary" />
                      <div className="text-2xl font-bold">{selectedItems.size}</div>
                      <div className="text-sm text-muted-foreground">Работ выбрано</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-accent/50">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <TrendingUp className="h-8 w-8 mx-auto text-primary" />
                      <div className="text-2xl font-bold">+{Math.round((totalCost / 10000) * 10)}%</div>
                      <div className="text-sm text-muted-foreground">Прирост трафика</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Этапы работ:</h4>
                {Object.entries(categorizedItems).map(([category, categoryItems], index) => {
                  const categorySelected = categoryItems.filter((item) =>
                    selectedItems.has(item.id || '')
                  ).length;
                  if (categorySelected === 0) return null;

                  return (
                    <div key={category} className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{category}</div>
                        <div className="text-sm text-muted-foreground">
                          {categorySelected} {categorySelected === 1 ? 'работа' : 'работ'} • ~
                          {Math.ceil(categorySelected / 5)} {Math.ceil(categorySelected / 5) === 1 ? 'день' : 'дней'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {categoryTotals[category]?.toLocaleString('ru-RU')} ₽
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
