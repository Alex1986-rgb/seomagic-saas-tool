import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { OptimizationItem } from '@/features/audit/types/optimization-types';
import { AlertCircle, Bot, Calculator, CheckCircle, ExternalLink, Receipt } from 'lucide-react';
import EstimateSelectors from './EstimateSelectors';
import CostSummary from './CostSummary';
import CostDetailsTable from './CostDetailsTable';
import PaymentDialog from './PaymentDialog';
import EstimateComparison from './EstimateComparison';
import OptimizationResults from './OptimizationResults';
import OptimizationProcessContainer from './process/OptimizationProcessContainer';
import {
  generateGroupsFromAuditData,
  generateKeyFromName,
  createSelectedItems,
  validateSelection,
  getPriorityStats,
} from './auditToInteractiveMapper';
import { Link } from 'react-router-dom';
import { runOptimization } from '@/services/optimization/runOptimization';
import { plural } from '@/lib/issue-labels';

interface InteractiveOptimizationPanelProps {
  url: string;
  /** Задача аудита, по которой запускается оптимизация. Без неё запуск невозможен. */
  taskId?: string | null;
  /** Оценка сайта по аудиту — от неё считается «было». */
  currentScore?: number;
  optimizationCost?: number;
  optimizationItems?: OptimizationItem[];
  pageCount?: number;
  isOptimized?: boolean;
  /** Посчитать смету, если её ещё нет. */
  onCalculateCost?: () => void;
  onDownloadOptimizedSite?: () => void;
  onGeneratePdfReport?: () => void;
}

type ViewMode = 'audit-results' | 'edit-estimate';

const InteractiveOptimizationPanel: React.FC<InteractiveOptimizationPanelProps> = ({
  url,
  taskId,
  currentScore = 0,
  optimizationItems,
  pageCount = 0,
  isOptimized = false,
  onCalculateCost,
  onDownloadOptimizedSite,
  onGeneratePdfReport,
}) => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('audit-results');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isInvoiceRequested, setIsInvoiceRequested] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  // Предел страниц за запуск — из ответа сервера, если он его назвал.
  const [pageLimit, setPageLimit] = useState<number | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [localIsOptimized, setLocalIsOptimized] = useState(isOptimized);

  // Пустой список держим одним и тем же массивом: новый `[]` на каждой
  // отрисовке заново запускал бы эффекты и пересчёты ниже.
  const items = useMemo(() => optimizationItems ?? [], [optimizationItems]);

  // Все хуки идут до любых ранних выходов. Раньше заглушка «нет сметы»
  // возвращалась раньше них, и как только смета приходила, React падал с
  // «Rendered more hooks than during the previous render».

  // По умолчанию выбраны все работы высокой важности.
  useEffect(() => {
    if (items.length > 0 && selectedKeys.size === 0) {
      const initialKeys = new Set<string>();
      items.forEach((item) => {
        if (item.priority === 'high') {
          initialKeys.add(generateKeyFromName(item.name));
        }
      });
      if (initialKeys.size > 0) {
        setSelectedKeys(initialKeys);
      }
    }
  }, [items]);

  const selectedItems = useMemo(() => {
    return createSelectedItems(items, selectedKeys);
  }, [items, selectedKeys]);

  const selectedTotalCost = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [selectedItems]);

  const recommendedItems = useMemo(() => {
    return items.filter(i => i.priority === 'high');
  }, [items]);

  const recommendedTotalCost = useMemo(() => {
    return recommendedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [recommendedItems]);

  const removedHighPriority = useMemo(() => {
    return recommendedItems.filter(
      i => !selectedKeys.has(generateKeyFromName(i.name))
    ).length;
  }, [recommendedItems, selectedKeys]);

  // Здесь считался «ожидаемый рост скора»: от вписанной в код оценки 65 и
  // придуманного коэффициента — «+35 баллов» любому сайту. Прогноза роста у нас
  // нет: новую оценку даёт только повторный аудит, поэтому число не показываем.

  const groups = useMemo(() => {
    return generateGroupsFromAuditData(items, selectedKeys);
  }, [items, selectedKeys]);

  const handleToggle = (key: string, selected: boolean) => {
    setSelectedKeys((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(key);
      } else {
        newSet.delete(key);
      }
      return newSet;
    });
  };

  // Раньше здесь объявлялось «Оплата успешно произведена» — при неподключённом
  // приёме платежей, а потом окно закрывалось раньше, чем человек видел
  // подтверждение. Теперь это заявка на счёт: окно само показывает «Заявка
  // принята», а оптимизацию заявка не запускает.
  const handleInvoiceRequested = () => {
    setIsInvoiceRequested(true);
  };

  /**
   * Запуск оптимизации.
   *
   * Функция была написана, но ни одна кнопка её не вызывала: «Оплатить и
   * оптимизировать» только оформляла заявку на счёт. Теперь у запуска своя
   * кнопка. Выбор работ в смете на запуск не влияет — модель переписывает
   * мета-теги и тексты страниц аудита, и интерфейс говорит об этом прямо.
   */
  const startOptimization = async () => {
    if (!taskId) {
      toast({
        title: 'Оптимизация недоступна',
        description: 'Не видим аудит, к которому относится смета. Запустите аудит заново.',
        variant: 'destructive',
      });
      return;
    }

    setIsOptimizing(true);
    setOptimizationProgress(0);
    setPageLimit(null);

    try {
      const outcome = await runOptimization(
        taskId,
        { fixMetaTags: true, improveContent: true, language: 'ru' },
        ({ processed, total, pageLimit: limit }) => {
          setOptimizationProgress(total > 0 ? Math.min(99, Math.round((processed / total) * 100)) : 5);
          setPageLimit(typeof limit === 'number' ? limit : null);
        },
      );

      if (outcome.status === 'failed') {
        throw new Error(outcome.error ?? 'Оптимизация не удалась');
      }

      setOptimizationProgress(100);
      setLocalIsOptimized(true);
      setOptimizationResult({
        beforeScore: currentScore,
        // Оценку после работ поставит следующий аудит: пока страницы только
        // переписаны, придумывать новый балл нельзя.
        afterScore: null,
        pages: outcome.pages,
        failures: outcome.failures,
        cost: outcome.cost,
        status: outcome.status,
      });

      toast({
        title: outcome.status === 'partial' ? 'Оптимизация прошла частично' : 'Оптимизация завершена',
        description: `Переписано страниц: ${outcome.pages.length}` +
          (outcome.failures.length > 0 ? `, не удалось: ${outcome.failures.length}` : ''),
      });
    } catch (error) {
      toast({
        title: 'Оптимизация не запустилась',
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
        variant: 'destructive',
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleOpenPaymentDialog = () => {
    const validation = validateSelection(items, selectedKeys);

    if (!validation.valid) {
      toast({
        title: 'Ошибка',
        description: validation.warning,
        variant: 'destructive',
      });
      return;
    }

    if (validation.warning) {
      toast({
        title: 'Предупреждение',
        description: validation.warning,
      });
    }

    setIsPaymentDialogOpen(true);
  };

  // Show optimization results if optimized
  if (localIsOptimized && optimizationResult) {
    return (
      <OptimizationResults
        url={url}
        optimizationResult={optimizationResult}
        onDownloadOptimized={onDownloadOptimizedSite}
        onGeneratePdfReport={onGeneratePdfReport}
      />
    );
  }

  // Show optimization process if optimizing
  if (isOptimizing) {
    return (
      <>
        <OptimizationProcessContainer
          url={url}
          progress={optimizationProgress}
        />
        {pageLimit !== null && (
          <p className="-mt-4 mb-6 text-sm text-muted-foreground">
            За запуск обработаем до {pageLimit} {plural(pageLimit, ['страницы', 'страниц', 'страниц'])}
          </p>
        )}
      </>
    );
  }

  const startBlock = taskId ? (
    <div className="rounded-lg border p-4 space-y-3">
      <p className="text-sm text-muted-foreground">
        Языковая модель пройдёт по страницам этого аудита и предложит новые title,
        description и правки текстов. Выбор работ в смете на запуск не влияет.
      </p>
      <Button onClick={() => void startOptimization()} className="gap-2">
        <Bot className="h-4 w-4" />
        Запустить оптимизацию текстов
      </Button>
    </div>
  ) : null;

  // Сметы нет. Раньше здесь было «Идет расчет сметы… попробуйте обновить
  // страницу», хотя на этой странице смету никто не считал и обновление ничего
  // не меняло.
  if (items.length === 0) {
    return (
      <Card className="p-6 bg-card/90 backdrop-blur-sm">
        <div className="text-center space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-warning" />
          <h3 className="text-xl font-semibold">
            Смета оптимизации ещё не рассчитана
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {onCalculateCost
              ? 'Посчитаем, во что обойдётся исправление замечаний этого аудита.'
              : 'Для этого аудита смета пока не сформирована.'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            {onCalculateCost && (
              <Button onClick={onCalculateCost}>
                <Calculator className="mr-2 h-4 w-4" />
                Рассчитать смету
              </Button>
            )}
            <Link to="/optimization-demo">
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                Посмотреть демо
              </Button>
            </Link>
          </div>
        </div>
        {startBlock && <div className="mt-6 text-left">{startBlock}</div>}
      </Card>
    );
  }

  const priorityStats = getPriorityStats(items);

  const invoiceButton = (label: string) => (
    isInvoiceRequested ? (
      <Button size="lg" variant="outline" disabled className="gap-2">
        <CheckCircle className="h-4 w-4" />
        Счёт запрошен
      </Button>
    ) : (
      <Button
        onClick={handleOpenPaymentDialog}
        disabled={selectedItems.length === 0}
        size="lg"
        className="gap-2"
      >
        <Receipt className="h-4 w-4" />
        {label} ({selectedTotalCost.toLocaleString('ru-RU')} ₽)
      </Button>
    )
  );

  return (
    <section id="optimization-section" className="mb-12 scroll-mt-20">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Оптимизация сайта - Интерактивная смета</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
            <TabsList className="mb-6">
              <TabsTrigger value="audit-results">Результаты аудита</TabsTrigger>
              <TabsTrigger value="edit-estimate">Настроить смету</TabsTrigger>
            </TabsList>

            <TabsContent value="audit-results">
              <div className="mb-6">
                <p className="text-muted-foreground mb-4">
                  На основе результатов аудита мы рекомендуем выполнить следующие работы.
                  По умолчанию выбраны все критические элементы ({priorityStats.high} работ).
                </p>

                <EstimateComparison
                  recommendedCost={recommendedTotalCost}
                  recommendedCount={recommendedItems.length}
                  selectedCost={selectedTotalCost}
                  selectedCount={selectedItems.length}
                  removedHighPriority={removedHighPriority}
                />

                <CostSummary
                  optimizationCost={selectedTotalCost}
                  pageCount={pageCount}
                  discount={0}
                />

                <CostDetailsTable items={selectedItems} />

                <div className="flex flex-wrap gap-3 mt-6">
                  {invoiceButton('Запросить счёт')}

                  {onGeneratePdfReport && (
                    <Button onClick={onGeneratePdfReport} variant="outline" size="lg">
                      Скачать PDF отчёт
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="edit-estimate">
              <div className="mb-6">
                <p className="text-muted-foreground mb-4">
                  Настройте смету под ваш бюджет. Выбирайте работы, которые хотите включить в оптимизацию.
                </p>

                <EstimateSelectors
                  groups={groups}
                  onToggle={handleToggle}
                  className="mb-6"
                />

                <EstimateComparison
                  recommendedCost={recommendedTotalCost}
                  recommendedCount={recommendedItems.length}
                  selectedCost={selectedTotalCost}
                  selectedCount={selectedItems.length}
                  removedHighPriority={removedHighPriority}
                />

                <CostSummary
                  optimizationCost={selectedTotalCost}
                  pageCount={pageCount}
                  discount={0}
                />

                <CostDetailsTable items={selectedItems} />

                <div className="flex flex-wrap gap-3 mt-6">
                  {invoiceButton('Запросить счёт на выбранное')}

                  <Button
                    onClick={() => setViewMode('audit-results')}
                    variant="outline"
                    size="lg"
                  >
                    Вернуться к рекомендациям
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {startBlock && <div className="mt-2">{startBlock}</div>}
        </CardContent>
      </Card>

      <PaymentDialog
        url={url}
        taskId={taskId}
        optimizationCost={selectedTotalCost}
        onPayment={handleInvoiceRequested}
        isDialogOpen={isPaymentDialogOpen}
        setIsDialogOpen={setIsPaymentDialogOpen}
      />
    </section>
  );
};

export default InteractiveOptimizationPanel;
