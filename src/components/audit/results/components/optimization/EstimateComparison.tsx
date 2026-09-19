import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';

interface EstimateComparisonProps {
  recommendedCost: number;
  recommendedCount: number;
  selectedCost: number;
  selectedCount: number;
  removedHighPriority: number;
}

/**
 * Сравнение сметы с рекомендованной.
 *
 * Раньше блок обещал «Ожидаемый рост скора: +35 баллов» и «снизит результат на
 * N баллов». Число считалось от вписанной в код оценки 65 и придуманного
 * коэффициента — одинаково для любого сайта. Прогноза роста у нас нет (новую
 * оценку даёт только повторный аудит), поэтому говорим о том, что известно:
 * какие работы включены и какие убраны.
 */
const EstimateComparison: React.FC<EstimateComparisonProps> = ({
  recommendedCost,
  recommendedCount,
  selectedCost,
  selectedCount,
  removedHighPriority,
}) => {
  const costDifference = selectedCost - recommendedCost;
  const countDifference = selectedCount - recommendedCount;
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Сравнение смет</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="text-sm text-muted-foreground mb-1">Рекомендовано</div>
            <div className="text-2xl font-bold">{recommendedCost.toLocaleString('ru-RU')} ₽</div>
            <div className="text-sm text-muted-foreground">{recommendedCount} работ</div>
          </div>
          
          <div className="border rounded-lg p-4 bg-primary/5">
            <div className="text-sm text-muted-foreground mb-1">Ваш выбор</div>
            <div className="text-2xl font-bold">{selectedCost.toLocaleString('ru-RU')} ₽</div>
            <div className="text-sm text-muted-foreground">{selectedCount} работ</div>
          </div>
        </div>
        
        {costDifference !== 0 && (
          <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg mb-4">
            {costDifference < 0 ? (
              <TrendingDown className="w-5 h-5 text-green-500" />
            ) : (
              <TrendingUp className="w-5 h-5 text-orange-500" />
            )}
            <div>
              <div className="font-medium">
                {costDifference < 0 ? 'Экономия' : 'Удорожание'}: {Math.abs(costDifference).toLocaleString('ru-RU')} ₽
              </div>
              <div className="text-sm text-muted-foreground">
                {countDifference < 0 ? `Убрано ${Math.abs(countDifference)} работ` : `Добавлено ${countDifference} работ`}
              </div>
            </div>
          </div>
        )}
        
        {removedHighPriority > 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Вы убрали критических работ: {removedHighPriority}. Эти замечания останутся неисправленными.
            </AlertDescription>
          </Alert>
        )}
        
        {removedHighPriority === 0 && recommendedCount > 0 && (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <div className="font-medium text-green-700 dark:text-green-400">
              Все критические работы включены в смету
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EstimateComparison;
