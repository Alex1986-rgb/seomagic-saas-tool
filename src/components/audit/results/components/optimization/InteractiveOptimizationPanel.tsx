import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { OptimizationItem } from '@/features/audit/types/optimization-types';
import { AlertCircle, ExternalLink } from 'lucide-react';
import EstimateSelectors from './EstimateSelectors';
import CostSummary from './CostSummary';
import CostDetailsTable from './CostDetailsTable';
import PaymentDialog from './PaymentDialog';
import EstimateComparison from './EstimateComparison';
import OptimizationResults from './OptimizationResults';
import OptimizationProcessContainer from './process/OptimizationProcessContainer';
import {
  mapAuditItemsToSelectable,
  generateGroupsFromAuditData,
  generateKeyFromName,
  createSelectedItems,
  validateSelection,
  getPriorityStats,
} from './auditToInteractiveMapper';
import { Link } from 'react-router-dom';

interface InteractiveOptimizationPanelProps {
  url: string;
  optimizationCost?: number;
  optimizationItems?: OptimizationItem[];
  pageCount?: number;
  isOptimized?: boolean;
  onDownloadOptimizedSite?: () => void;
  onGeneratePdfReport?: () => void;
}

type ViewMode = 'audit-results' | 'edit-estimate';

const InteractiveOptimizationPanel: React.FC<InteractiveOptimizationPanelProps> = ({
  url,
  optimizationCost = 0,
  optimizationItems = [],
  pageCount = 0,
  isOptimized = false,
  onDownloadOptimizedSite,
  onGeneratePdfReport,
}) => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('audit-results');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [localIsOptimized, setLocalIsOptimized] = useState(isOptimized);

  // Fallback if no optimization items available
  if (!optimizationItems || optimizationItems.length === 0) {
    return (
      <Card className="p-6 bg-card/90 backdrop-blur-sm">
        <div className="text-center space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-warning" />
          <h3 className="text-xl font-semibold">
            Данные оптимизации недоступны
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Произошла ошибка при расчете сметы оптимизации. 
            Вы можете посмотреть демо-версию для понимания процесса.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/optimization-demo'}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Посмотреть демо
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Initialize selected keys with all high-priority items
  useEffect(() => {
    if (optimizationItems.length > 0 && selectedKeys.size === 0) {
      const initialKeys = new Set<string>();
      optimizationItems.forEach((item) => {
        if (item.priority === 'high') {
          initialKeys.add(generateKeyFromName(item.name));
        }
      });
      setSelectedKeys(initialKeys);
    }
  }, [optimizationItems]);

  // Calculate totals based on selection
  const selectedItems = useMemo(() => {
    return createSelectedItems(optimizationItems, selectedKeys);
  }, [optimizationItems, selectedKeys]);

  const selectedTotalCost = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [selectedItems]);

  const recommendedItems = useMemo(() => {
    return optimizationItems.filter(i => i.priority === 'high');
  }, [optimizationItems]);

  const recommendedTotalCost = useMemo(() => {
    return recommendedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [recommendedItems]);

  const removedHighPriority = useMemo(() => {
    return recommendedItems.filter(
      i => !selectedKeys.has(generateKeyFromName(i.name))
    ).length;
  }, [recommendedItems, selectedKeys]);

  const estimatedScoreChange = useMemo(() => {
    const maxScore = 100;
    const currentScore = 65; // можно получить из auditData
    const potentialGain = maxScore - currentScore;
    const efficiency = 1 - (removedHighPriority / Math.max(recommendedItems.length, 1)) * 0.4;
    return Math.round(potentialGain * efficiency);
  }, [removedHighPriority, recommendedItems]);

  // Generate groups for EstimateSelectors
  const groups = useMemo(() => {
    return generateGroupsFromAuditData(optimizationItems, selectedKeys);
  }, [optimizationItems, selectedKeys]);

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

  const handlePayment = () => {
    toast({
      title: 'Оплата успешно произведена',
      description: 'Теперь вы можете запустить процесс оптимизации',
    });
    setIsPaymentComplete(true);
    setIsPaymentDialogOpen(false);
  };

  const startOptimization = () => {
    const validation = validateSelection(optimizationItems, selectedKeys);
    
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

    setIsOptimizing(true);
    setOptimizationProgress(0);

    const interval = setInterval(() => {
      setOptimizationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLocalIsOptimized(true);

          setTimeout(() => {
            setOptimizationResult({
              beforeScore: 65,
              afterScore: 65 + estimatedScoreChange,
            });
          }, 1000);

          return 100;
        }
        return prev + Math.random() * 2;
      });
    }, 200);
  };

  const handleOpenPaymentDialog = () => {
    const validation = validateSelection(optimizationItems, selectedKeys);
    
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

  // Fallback if no items
  if (optimizationItems.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Оптимизация сайта</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            Данные оптимизации еще не сформированы. Попробуйте демо-версию.
          </p>
          <Link to="/optimization-demo">
            <Button>Посмотреть демо-версию</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

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
      <OptimizationProcessContainer
        url={url}
        progress={optimizationProgress}
        setOptimizationResult={setOptimizationResult}
        setLocalIsOptimized={setLocalIsOptimized}
      />
    );
  }

  const priorityStats = getPriorityStats(optimizationItems);

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
                  estimatedScoreChange={estimatedScoreChange}
                />

                <CostSummary
                  optimizationCost={selectedTotalCost}
                  pageCount={pageCount}
                  discount={0}
                />

                <CostDetailsTable items={selectedItems} />

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={handleOpenPaymentDialog}
                    disabled={selectedItems.length === 0}
                    size="lg"
                  >
                    Оплатить и оптимизировать ({selectedTotalCost.toLocaleString('ru-RU')} ₽)
                  </Button>
                  
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
                  estimatedScoreChange={estimatedScoreChange}
                />

                <CostSummary
                  optimizationCost={selectedTotalCost}
                  pageCount={pageCount}
                  discount={0}
                />

                <CostDetailsTable items={selectedItems} />

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={handleOpenPaymentDialog}
                    disabled={selectedItems.length === 0}
                    size="lg"
                  >
                    Оплатить выбранное ({selectedTotalCost.toLocaleString('ru-RU')} ₽)
                  </Button>
                  
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
        </CardContent>
      </Card>

      <PaymentDialog
        url={url}
        optimizationCost={selectedTotalCost}
        onPayment={handlePayment}
        isDialogOpen={isPaymentDialogOpen}
        setIsDialogOpen={setIsPaymentDialogOpen}
      />
    </section>
  );
};

export default InteractiveOptimizationPanel;
