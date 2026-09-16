
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import CostSummary from './optimization/CostSummary';
import CostDetailsTable from './optimization/CostDetailsTable';
import OptimizationActions from './optimization/OptimizationActions';
import OptimizationLoadingStatus from './OptimizationLoadingStatus';
import { Progress } from "@/components/ui/progress";
import {
  runOptimization,
  type OptimizationOutcome,
  type OptimizationProgress,
} from '@/services/optimization/runOptimization';

interface AuditOptimizationSectionProps {
  url: string;
  /** Задача аудита: по ней сервер находит страницы для переписывания. */
  taskId?: string | null;
  optimizationCost?: number;
  pageCount: number;
  optimizationItems?: any[];
  isOptimized?: boolean;
  showPrompt?: boolean;
  onTogglePrompt?: () => void;
  onOptimize?: () => void;
  /** Посчитать смету: без неё запускать оптимизацию не из чего. */
  onCalculateCost?: () => void;
  onDownloadOptimizedSite?: () => void;
  onGeneratePdfReport?: () => void;
  contentPrompt?: string;
  setContentOptimizationPrompt?: (prompt: string) => void;
  loadingStatus?: string;
  retryAttempt?: number;
}

const AuditOptimizationSection: React.FC<AuditOptimizationSectionProps> = ({
  url,
  taskId,
  optimizationCost = 0,
  pageCount,
  optimizationItems = [],
  isOptimized = false,
  showPrompt = false,
  onTogglePrompt,
  onOptimize,
  onCalculateCost,
  onDownloadOptimizedSite,
  onGeneratePdfReport,
  contentPrompt = "",
  setContentOptimizationPrompt,
  loadingStatus = "",
  retryAttempt = 0
}) => {
  const { toast } = useToast();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isInvoiceRequested, setIsInvoiceRequested] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [localIsOptimized, setLocalIsOptimized] = useState(isOptimized);

  const [liveProgress, setLiveProgress] = useState<OptimizationProgress | null>(null);
  const [outcome, setOutcome] = useState<OptimizationOutcome | null>(null);
  const [runError, setRunError] = useState<string | null>(null);

  /**
   * Запуск настоящей оптимизации.
   *
   * Прежде здесь полоса двигалась случайными числами, а результат был вписан в
   * код — «было 65 → стало 92» для любого сайта; на сервер не уходило ничего.
   * Теперь страницы переписывает языковая модель, и мы показываем, что она
   * сделала на самом деле.
   */
  const startOptimization = async () => {
    if (!taskId) {
      toast({
        title: 'Нечего оптимизировать',
        description: 'Не найден аудит, по которому можно переписать страницы',
        variant: 'destructive',
      });
      return;
    }

    setIsOptimizing(true);
    setRunError(null);
    setOutcome(null);
    setLiveProgress({ status: 'queued', processed: 0, total: pageCount });

    try {
      const result = await runOptimization(
        taskId,
        {
          fixMetaTags: true,
          improveContent: true,
          language: 'ru',
          // Пожелания из поля «инструкции» раньше на сервер не уходили.
          instructions: contentPrompt,
        },
        (progress) => setLiveProgress(progress),
      );
      setOutcome(result);
      setLocalIsOptimized(result.status !== 'failed');

      if (result.status === 'failed') {
        setRunError(result.error ?? 'Оптимизация не удалась');
      } else {
        toast({
          title: result.status === 'partial' ? 'Оптимизация завершена частично' : 'Оптимизация завершена',
          description: `Переписано страниц: ${result.pages.length}`,
        });
      }
    } catch (error) {
      setRunError(error instanceof Error ? error.message : 'Оптимизация не удалась');
    } finally {
      setIsOptimizing(false);
    }
  };

  /**
   * Заявка на счёт принята.
   *
   * Раньше отсюда сразу запускалась оптимизация, а окно закрывалось: человек
   * просил прислать счёт, а модель уже переписывала страницы — без счёта и без
   * оплаты, и экран «Заявка принята» никто не видел. Теперь заявка остаётся
   * заявкой: окно показывает подтверждение, запуск — отдельной кнопкой.
   */
  const handleInvoiceRequested = () => {
    setIsInvoiceRequested(true);
  };

  const handleSelectPrompt = (prompt: string) => {
    if (!setContentOptimizationPrompt) return;
    setContentOptimizationPrompt(prompt);

    // Здесь было «Параметры оптимизации установлены», хотя шаблон никуда не
    // уходил. Говорим только то, что действительно произошло: текст лёг в
    // пожелания, которые уйдут на сервер вместе с запуском.
    toast({
      title: "Шаблон выбран",
      description: "Текст шаблона добавлен в пожелания к оптимизации"
    });
  };

  if (!optimizationCost && !isOptimized && !showPrompt) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Оптимизация сайта</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            {onCalculateCost
              ? 'Посчитаем, во что обойдётся исправление найденных замечаний, и перепишем тексты страниц'
              : 'Заказать оптимизацию сайта для улучшения его показателей в поисковых системах'}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            {/*
              Прежде здесь был тупик: пока смета не посчитана, показывались
              только демо и отчёт, а запустить оптимизацию было неоткуда —
              расчёт срабатывал лишь в момент завершения аудита. Даём явный шаг.
            */}
            {onCalculateCost && (
              <Button onClick={onCalculateCost}>Рассчитать стоимость оптимизации</Button>
            )}
            <Link to="/optimization-demo">
              <Button variant="outline">Посмотреть демо-версию</Button>
            </Link>
            {onGeneratePdfReport && (
              <Button onClick={onGeneratePdfReport} variant="outline">
                Скачать PDF отчёт
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Оптимизация сайта</CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {loadingStatus && (
            <OptimizationLoadingStatus 
              status={loadingStatus}
              attempt={retryAttempt}
              className="mb-4"
            />
          )}
        </AnimatePresence>

        {showPrompt && setContentOptimizationPrompt && (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <textarea
              value={contentPrompt}
              onChange={(e) => setContentOptimizationPrompt(e.target.value)}
              className="w-full h-32 p-3 border rounded-md mb-3"
              placeholder="Пожелания к оптимизации: например, не трогать цены, писать для B2B"
            />
          </motion.div>
        )}

        <CostSummary
          pageCount={pageCount}
          optimizationCost={optimizationCost}
        />
        
        <div className="my-4">
          <CostDetailsTable items={optimizationItems} />
        </div>
        
        {/* Ход работы — по данным сервера, а не по таймеру. */}
        {isOptimizing && liveProgress && (
          <div className="my-4 space-y-2 rounded-lg border p-4">
            <div className="flex justify-between text-sm">
              <span>
                {liveProgress.status === 'queued' ? 'Ставим в очередь…' : 'Переписываем страницы…'}
              </span>
              <span className="text-muted-foreground">
                {liveProgress.total > 0 ? `${liveProgress.processed} из ${liveProgress.total}` : ''}
              </span>
            </div>
            <Progress
              value={liveProgress.total > 0 ? (liveProgress.processed / liveProgress.total) * 100 : 5}
            />
          </div>
        )}

        {runError && (
          <div className="my-4 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
            {runError}
          </div>
        )}

        {outcome && outcome.pages.length > 0 && (
          <div className="my-4 space-y-3">
            <div className="flex flex-wrap justify-between gap-2 text-sm">
              <span className="font-medium">Переписано страниц: {outcome.pages.length}</span>
              <span className="text-muted-foreground">
                токенов: {outcome.totalTokens.toLocaleString('ru-RU')}
                {outcome.failures.length > 0 && ` · не удалось: ${outcome.failures.length}`}
              </span>
            </div>
            {outcome.pages.map((page) => (
              <details key={page.url} className="rounded-lg border p-3">
                <summary className="cursor-pointer text-sm font-medium break-all">{page.url}</summary>
                {page.originalTitle && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Было: {page.originalTitle}
                  </p>
                )}
                <div className="mt-2 whitespace-pre-wrap text-sm">{page.recommendations}</div>
              </details>
            ))}
          </div>
        )}
        
        <div className="flex justify-end mt-4">
          <OptimizationActions
            url={url}
            taskId={taskId}
            optimizationCost={optimizationCost}
            isOptimized={localIsOptimized || isOptimized}
            isInvoiceRequested={isInvoiceRequested}
            isOptimizing={isOptimizing}
            onDownloadOptimized={onDownloadOptimizedSite}
            onGeneratePdfReport={onGeneratePdfReport}
            onStartOptimization={() => void startOptimization()}
            onInvoiceRequested={handleInvoiceRequested}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            onSelectPrompt={handleSelectPrompt}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditOptimizationSection;
