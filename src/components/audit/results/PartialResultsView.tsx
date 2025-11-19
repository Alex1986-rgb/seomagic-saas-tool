import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, TrendingUp, DollarSign } from 'lucide-react';
import { AuditData } from '@/types/audit';

interface PartialResultsViewProps {
  results: Partial<AuditData>;
  completionPercentage: number;
}

export const PartialResultsView: React.FC<PartialResultsViewProps> = ({
  results,
  completionPercentage,
}) => {
  const criticalCount = Array.isArray(results.issues?.critical) ? results.issues.critical.length : 0;
  const importantCount = Array.isArray(results.issues?.important) ? results.issues.important.length : 0;
  const opportunitiesCount = Array.isArray(results.issues?.opportunities) ? results.issues.opportunities.length : 0;

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <Alert variant="default" className="bg-yellow-500/10 border-yellow-500/30">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-sm">
          <strong>⚠️ Частичные данные</strong> - Аудит просканирован на {completionPercentage}%.
          Результаты основаны на проанализированных страницах и могут не отражать полную картину.
        </AlertDescription>
      </Alert>

      {/* Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Оценка на основе частичных данных</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Общий балл</div>
              <div className="text-3xl font-bold text-primary">
                {results.score || 0}
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">SEO</div>
              <div className="text-3xl font-bold">
                {results.details?.seo?.score || 0}
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Технические</div>
              <div className="text-3xl font-bold">
                {results.details?.technical?.score || 0}
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Контент</div>
              <div className="text-3xl font-bold">
                {results.details?.content?.score || 0}
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Найденные проблемы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground">Критичные</div>
                <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
              </div>
              <Badge variant="destructive">Высокий приоритет</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-500/10 rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground">Важные</div>
                <div className="text-2xl font-bold text-yellow-600">{importantCount}</div>
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Средний</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground">Возможности</div>
                <div className="text-2xl font-bold text-blue-600">{opportunitiesCount}</div>
              </div>
              <Badge className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">
                <TrendingUp className="h-3 w-3 mr-1" />
                Улучшения
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Estimate */}
      {results.optimizationCost && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Предварительная смета оптимизации
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground">Ориентировочная стоимость</div>
                <div className="text-3xl font-bold text-primary">
                  ${results.optimizationCost.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  * Финальная стоимость будет рассчитана после полного аудита
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendation */}
      <Alert>
        <TrendingUp className="h-4 w-4" />
        <AlertDescription>
          <strong>Рекомендация:</strong> Запустите полный аудит для получения детального анализа
          всех страниц, точной сметы и полного списка рекомендаций по оптимизации.
        </AlertDescription>
      </Alert>
    </div>
  );
};
