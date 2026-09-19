import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuditStatus from './AuditStatus';
import AuditResultHeader from './AuditResultHeader';
import AuditRecommendationsSection from './AuditRecommendationsSection';
import AuditPageAnalysisSection from './AuditPageAnalysisSection';
import AuditOptimizationSection from './AuditOptimizationSection';
import AuditResultsViewSwitcher from '../dashboard/AuditResultsViewSwitcher';
import { AuditHistoryData } from '@/types/audit';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useScanContext } from '@/contexts/ScanContext';
import { auditService } from '@/modules/audit/services/auditService';
import { absoluteAuditPageUrl, auditPagePath } from '@/modules/audit/utils/auditLinks';

/**
 * Сколько страниц обходить при «глубоком сканировании» с экрана результатов.
 * Это значение, которое audit-start сам берёт для глубокого аудита, если
 * число страниц не передано; меньше, чем в текущей проверке, не берём.
 */
const DEEP_SCAN_PAGES = 100;

interface AuditContentProps {
  url: string;
  isLoading: boolean;
  loadingProgress: number;
  isScanning: boolean;
  isRefreshing: boolean;
  auditError: string | null;
  scanDetails: {
    pages_scanned: number;
    estimated_pages: number;
    current_url: string;
    stage?: string;
    progress?: number;
    status?: string;
    audit_data?: any;
  };
  auditData: any;
  recommendations: any;
  historyData: AuditHistoryData;
  optimizationCost: any;
  optimizationItems: any[];
  isOptimized: boolean;
  contentPrompt: string;
  taskId: string | null;
  showPrompt: boolean;
  loadingStatus?: string;
  retryAttempt?: number;
  onTogglePrompt: () => void;
  onRetry: () => void;
  onDownloadSitemap?: () => void;
  loadAuditData: (refresh?: boolean, deepScan?: boolean) => Promise<void>;
  // Выбор аудита из истории обрабатывается здесь же (переход на его задачу).
  // Обработчика «Скачать оптимизированный сайт» нет: сборка исправленной копии
  // сайта на сервере не реализована, кнопка ничего не скачивала.
  downloadSitemap?: () => void;
  exportJSONData: () => void;
  generatePdfReportFile: () => void;
  optimizeSiteContent: () => Promise<void>;
  /** Расчёт сметы: до него кнопки запуска оптимизации не существует. */
  loadOptimizationCost?: (taskId: string) => Promise<void>;
  setContentOptimizationPrompt: (prompt: string) => void;
  auditResults?: any;
  taskMetrics?: any;
  pageAnalysis?: any[];
}

const AuditContent: React.FC<AuditContentProps> = ({
  url,
  isLoading,
  loadingProgress,
  isScanning,
  isRefreshing,
  auditError,
  scanDetails,
  auditData,
  recommendations,
  historyData,
  optimizationCost,
  optimizationItems,
  isOptimized,
  contentPrompt,
  taskId,
  showPrompt,
  loadingStatus,
  retryAttempt,
  onTogglePrompt,
  onRetry,
  onDownloadSitemap,
  loadAuditData,
  downloadSitemap,
  exportJSONData,
  generatePdfReportFile,
  optimizeSiteContent,
  loadOptimizationCost,
  setContentOptimizationPrompt,
  auditResults,
  taskMetrics,
  pageAnalysis
}) => {
  const [viewMode, setViewMode] = useState<'dashboard' | 'classic'>('dashboard');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { startScan } = useScanContext();

  /**
   * «Поделиться» — ссылка на эти результаты в буфер обмена. Раньше обработчик
   * был пустым `() => {}`: пункт меню ничего не делал.
   */
  const handleShare = useCallback(async () => {
    if (!taskId) {
      toast({
        title: 'Ссылка пока недоступна',
        description: 'Дождитесь, пока аудит будет создан.',
      });
      return;
    }

    const link = absoluteAuditPageUrl(url, taskId);
    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: 'Ссылка скопирована',
        description: 'По ней откроются эти результаты. Проверку, запущенную из аккаунта, откроет только её владелец.',
      });
    } catch {
      toast({
        title: 'Не удалось скопировать ссылку',
        description: link,
      });
    }
  }, [taskId, url, toast]);

  /**
   * Кнопки дат в «Истории аудита». Раньше выбор уходил в console.log и ничего
   * не открывал. В истории лежат записи `audits`, а страница открывает задачу —
   * находим задачу аудита и переходим на неё.
   */
  const openHistoricalAudit = useCallback(async (auditId: string) => {
    const historicalTaskId = await auditService.getTaskIdForAudit(auditId);
    if (!historicalTaskId) {
      toast({
        title: 'Аудит не открывается',
        description: 'У этой записи не найдена задача с результатами.',
        variant: 'destructive',
      });
      return;
    }
    navigate(auditPagePath(url, historicalTaskId));
  }, [navigate, toast, url]);

  /**
   * «Запустить глубокое сканирование». Раньше вызывался refetch старых данных
   * (второй аргумент loadAuditData игнорировался) — новый обход не начинался,
   * а человек ждал результатов, которые не придут. Теперь запускаем настоящую
   * проверку; глубокий аудит, как и на вкладке запуска, — только после входа.
   */
  const handleDeepScan = useCallback(async () => {
    if (!user.isLoggedIn) {
      navigate(`/auth?redirect=${encodeURIComponent(auditPagePath(url, taskId))}`);
      return;
    }
    await startScan(true, Math.max(DEEP_SCAN_PAGES, scanDetails?.estimated_pages || 0));
  }, [user.isLoggedIn, navigate, url, taskId, startScan, scanDetails?.estimated_pages]);

  return (
    <>
      {/* Status component (loading, scanning, error) */}
      <AuditStatus 
        isLoading={isLoading}
        loadingProgress={loadingProgress}
        isScanning={isScanning}
        isRefreshing={isRefreshing}
        error={auditError}
        scanDetails={scanDetails}
        url={url}
        onRetry={onRetry}
        onDownloadSitemap={onDownloadSitemap}
      />
      
      {(!isLoading && !isScanning && !auditError && !auditData) && (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Результаты пока не готовы</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Аудит завершён, но данные ещё не записались. Обновите страницу через несколько секунд.
          </p>
          <Button variant="outline" onClick={onRetry}>Обновить</Button>
        </Card>
      )}

      {/*
        Результаты показываем, как только есть данные аудита. Раньше сюда же
        входило условие на рекомендации, а они были заглушкой `null` — поэтому
        после завершения аудита экран оставался пустым, хотя данные уже лежали
        в базе. Рекомендации, если их нет, просто не рисуют свой блок.
      */}
      {(!isLoading && !isScanning && !auditError && auditData) && (
        <>
          {/* Tabs for switching between views */}
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'dashboard' | 'classic')} className="mb-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Интерактивная панель
              </TabsTrigger>
              <TabsTrigger value="classic">
                <List className="mr-2 h-4 w-4" />
                Классический вид
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <AuditResultsViewSwitcher
                auditData={auditData}
                defaultMode="dashboard"
                auditResults={auditResults}
                taskMetrics={taskMetrics}
                pageAnalysis={pageAnalysis}
                taskId={taskId || undefined}
                onExportPDF={generatePdfReportFile}
                onExportJSON={exportJSONData}
                onShare={handleShare}
              />
            </TabsContent>

            <TabsContent value="classic" className="space-y-6">
              {/* Header and main audit data */}
              <AuditResultHeader 
                url={url}
                auditData={auditData}
                recommendations={recommendations}
                historyData={historyData}
                taskId={taskId || ""}
                onRefresh={() => loadAuditData(true)}
                onDeepScan={() => void handleDeepScan()}
                isRefreshing={isRefreshing}
                onDownloadSitemap={downloadSitemap}
                onTogglePrompt={onTogglePrompt}
                onExportJSON={exportJSONData}
                onSelectAudit={(auditId) => void openHistoricalAudit(auditId)}
                showPrompt={showPrompt}
              />
              
              {/* Recommendations section */}
              <AuditRecommendationsSection 
                recommendations={recommendations}
                auditData={auditData}
                optimizationCost={optimizationCost}
                optimizationItems={optimizationItems}
              />
              
              {/* Page analysis section */}
              <AuditPageAnalysisSection auditId={auditData.id} />
              
              {/* Optimization section */}
              <AuditOptimizationSection 
                taskId={taskId}
                optimizationCost={optimizationCost}
                optimizationItems={optimizationItems}
                isOptimized={isOptimized}
                contentPrompt={contentPrompt}
                url={url}
                pageCount={auditData.pageCount || 0}
                showPrompt={showPrompt}
                loadingStatus={loadingStatus}
                retryAttempt={retryAttempt}
                onTogglePrompt={onTogglePrompt}
                onOptimize={optimizeSiteContent}
                onCalculateCost={taskId && loadOptimizationCost ? () => loadOptimizationCost(taskId) : undefined}
                onGeneratePdfReport={generatePdfReportFile}
                setContentOptimizationPrompt={setContentOptimizationPrompt}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </>
  );
};

export default AuditContent;
