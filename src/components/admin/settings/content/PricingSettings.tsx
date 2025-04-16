
import React from 'react';
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Check, X } from 'lucide-react';
import { PricingPlanContent } from './types';

interface PricingSettingsProps {
  pricingContent: PricingPlanContent;
  updatePlan: (index: number, field: string, value: string | number | boolean) => void;
  updatePlanFeature: (planIndex: number, featureIndex: number, value: string) => void;
  addPlanFeature: (planIndex: number) => void;
  removePlanFeature: (planIndex: number, featureIndex: number) => void;
  addPlan: () => void;
  removePlan: (index: number) => void;
  updateComparison: (index: number, field: string, value: boolean) => void;
  addComparisonFeature: () => void;
  removeComparisonFeature: (index: number) => void;
}

const PricingSettings: React.FC<PricingSettingsProps> = ({
  pricingContent,
  updatePlan,
  updatePlanFeature,
  addPlanFeature,
  removePlanFeature,
  addPlan,
  removePlan,
  updateComparison,
  addComparisonFeature,
  removeComparisonFeature
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Тарифные планы</CardTitle>
            <CardDescription>Управление ценовыми планами и их функциями</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addPlan}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>Добавить план</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {pricingContent.plans.map((plan, index) => (
            <div key={index} className="p-4 border rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">План: {plan.name || `#${index + 1}`}</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch 
                      id={`plan-visible-${index}`} 
                      checked={plan.isVisible}
                      onCheckedChange={(checked) => updatePlan(index, 'isVisible', checked)}
                    />
                    <Label htmlFor={`plan-visible-${index}`}>Видимость</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      id={`plan-recommended-${index}`} 
                      checked={plan.isRecommended}
                      onCheckedChange={(checked) => updatePlan(index, 'isRecommended', checked)}
                    />
                    <Label htmlFor={`plan-recommended-${index}`}>Рекомендуемый</Label>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removePlan(index)}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`plan-name-${index}`}>Название</Label>
                  <Input 
                    id={`plan-name-${index}`} 
                    value={plan.name}
                    onChange={(e) => updatePlan(index, 'name', e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`plan-price-${index}`}>Цена (руб.)</Label>
                  <Input 
                    id={`plan-price-${index}`} 
                    type="number"
                    value={plan.price}
                    onChange={(e) => updatePlan(index, 'price', Number(e.target.value))} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`plan-period-${index}`}>Период (месяц/год)</Label>
                  <Input 
                    id={`plan-period-${index}`} 
                    value={plan.period}
                    onChange={(e) => updatePlan(index, 'period', e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`plan-button-${index}`}>Текст кнопки</Label>
                <Input 
                  id={`plan-button-${index}`} 
                  value={plan.buttonText}
                  onChange={(e) => updatePlan(index, 'buttonText', e.target.value)} 
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Особенности плана</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => addPlanFeature(index)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Добавить</span>
                  </Button>
                </div>
                
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2">
                    <Input 
                      value={feature}
                      onChange={(e) => updatePlanFeature(index, featureIndex, e.target.value)} 
                      className="flex-grow"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removePlanFeature(index, featureIndex)}
                      className="flex-shrink-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {plan.features.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    Нет добавленных особенностей для этого плана
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {pricingContent.plans.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Нет добавленных тарифных планов. Нажмите "Добавить план", чтобы создать первый тарифный план.
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Сравнение функций</CardTitle>
            <CardDescription>Управление таблицей сравнения функций в тарифах</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addComparisonFeature}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>Добавить функцию</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">Функция</th>
                  <th className="p-2 text-center">Базовый</th>
                  <th className="p-2 text-center">Про</th>
                  <th className="p-2 text-center">Корпоративный</th>
                  <th className="p-2 text-center">Действия</th>
                </tr>
              </thead>
              <tbody>
                {pricingContent.comparisons.map((comparison, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">
                      <Input 
                        value={comparison.feature}
                        onChange={(e) => {
                          const updatedComparisons = [...pricingContent.comparisons];
                          updatedComparisons[index].feature = e.target.value;
                          // Здесь должна быть логика обновления всего объекта comparisons
                        }} 
                      />
                    </td>
                    <td className="p-2 text-center">
                      <Switch 
                        checked={comparison.basic}
                        onCheckedChange={(checked) => updateComparison(index, 'basic', checked)}
                      />
                    </td>
                    <td className="p-2 text-center">
                      <Switch 
                        checked={comparison.pro}
                        onCheckedChange={(checked) => updateComparison(index, 'pro', checked)}
                      />
                    </td>
                    <td className="p-2 text-center">
                      <Switch 
                        checked={comparison.enterprise}
                        onCheckedChange={(checked) => updateComparison(index, 'enterprise', checked)}
                      />
                    </td>
                    <td className="p-2 text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeComparisonFeature(index)}
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {pricingContent.comparisons.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Нет добавленных функций для сравнения. Нажмите "Добавить функцию", чтобы добавить первую функцию.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingSettings;
