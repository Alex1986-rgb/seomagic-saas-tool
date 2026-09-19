import React, { useState, useMemo, useEffect } from 'react';
import { AuditData } from '@/types/audit';
import { DashboardMetrics, IssueItem, PageAnalysisRow } from './types';
import AuditDashboardHeader from './AuditDashboardHeader';
import CategoryScoresGrid from './CategoryScoresGrid';
import IssueMetricsCard from './IssueMetricsCard';
import PerformanceMetricsCard from './PerformanceMetricsCard';
import IssuesBreakdownChart from './IssuesBreakdownChart';
import TopIssuesPanel from './TopIssuesPanel';
import PageAnalysisInteractiveTable from './PageAnalysisInteractiveTable';
import PageDetailView from './PageDetailView';
import HistoricalTrendsChart from './HistoricalTrendsChart';
import ComparisonCard from './ComparisonCard';
import { getHistoricalTrends, compareWithPrevious, HistoricalTrend, ComparisonData } from '@/services/audit/historyService';

interface AuditResultsDashboardProps {
  auditData: AuditData;
  auditResults?: any;
  taskMetrics?: any;
  pageAnalysis?: any[];
  taskId?: string;
  onExportPDF: () => void;
  onExportJSON: () => void;
  onShare: () => void;
}

/**
 * Замечания по одной странице — по тем же полям `page_analysis`, по которым
 * считается число проблем в таблице.
 *
 * Раньше таблица показывала «Проблемы: 4», а в карточке страницы список был
 * всегда пустым (`issues: []`) и крупно писалось «Проблем не обнаружено!».
 * Теперь число и список берутся из одной функции и не могут разойтись.
 * Флаг, который краулер не записал (null у canonical, noindex, «мало текста»),
 * считаем «не измерено», а не проблемой: придумывать замечание нельзя.
 */
const collectPageIssues = (page: any): IssueItem[] => {
  const issues: IssueItem[] = [];
  const add = (
    key: string,
    severity: IssueItem['severity'],
    category: string,
    title: string,
    description: string,
    solution?: string,
  ) => {
    issues.push({
      id: `${page.url}-${key}`,
      title,
      description,
      severity,
      category,
      affectedPages: [page.url],
      solution,
    });
  };

  const statusCode = Number(page.status_code ?? 0);
  if (statusCode >= 400) {
    add('status', 'error', 'technical', `Страница отвечает ошибкой ${statusCode}`,
      'Поисковик не сможет проиндексировать страницу, которая отвечает ошибкой.',
      'Исправьте страницу или настройте редирект на рабочий адрес.');
  }
  if (!page.title) {
    add('title', 'error', 'seo', 'Нет заголовка title',
      'Title — главный текст сниппета в поиске.',
      'Добавьте уникальный title длиной 50–60 символов.');
  }
  if (page.h1_count === 0) {
    add('h1', 'warning', 'seo', 'Нет заголовка H1',
      'На странице не найден ни один заголовок первого уровня.',
      'Добавьте один H1, описывающий содержание страницы.');
  }
  if (!page.meta_description) {
    add('description', 'warning', 'seo', 'Нет meta description',
      'Без описания поисковик сам соберёт сниппет из текста страницы.',
      'Добавьте описание длиной 150–160 символов.');
  }
  if (page.has_canonical === false) {
    add('canonical', 'warning', 'technical', 'Нет canonical',
      'Не указан канонический адрес страницы.',
      'Добавьте <link rel="canonical"> с основным адресом страницы.');
  }
  if (page.is_indexable === false) {
    add('noindex', 'error', 'technical', 'Страница закрыта от индексации',
      'В meta robots стоит noindex — страница не попадёт в поиск.',
      'Уберите noindex, если страница должна быть в поиске.');
  }
  if (page.has_thin_content === true) {
    add('thin', 'warning', 'content', 'Мало текста',
      'На странице меньше 150 слов.',
      'Расширьте текст полезным содержанием.');
  }
  // load_time хранится в секундах.
  if (Number(page.load_time ?? 0) > 3) {
    add('slow', 'warning', 'performance', 'Медленная загрузка',
      `Страница загружалась ${Number(page.load_time).toFixed(2)} с.`,
      'Сократите вес страницы и время ответа сервера.');
  }
  if (Number(page.redirect_chain_length ?? 0) > 0) {
    add('redirects', 'warning', 'technical', 'Страница открывается через редирект',
      `Редиректов по пути: ${page.redirect_chain_length}.`,
      'Ведите ссылки сразу на конечный адрес.');
  }
  if (Number(page.missing_alt_images_count ?? 0) > 0) {
    add('alt', 'warning', 'content', 'Картинки без alt',
      `Изображений без атрибута alt: ${page.missing_alt_images_count}.`,
      'Добавьте картинкам осмысленный alt.');
  }

  return issues;
};

// Оценка страницы — от числа найденных замечаний.
const calculatePageScore = (issues: IssueItem[]): number => {
  return Math.max(0, 100 - issues.length * 10);
};

const AuditResultsDashboard: React.FC<AuditResultsDashboardProps> = ({
  auditData,
  auditResults,
  taskMetrics,
  pageAnalysis: pageAnalysisData = [],
  taskId,
  onExportPDF,
  onExportJSON,
  onShare
}) => {
  const [selectedPage, setSelectedPage] = useState<PageAnalysisRow | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [historicalTrends, setHistoricalTrends] = useState<HistoricalTrend[]>([]);
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Load historical data and comparison
  useEffect(() => {
    const loadHistoricalData = async () => {
      if (!auditData.url) return;
      
      setLoadingHistory(true);
      
      // Load historical trends
      const trends = await getHistoricalTrends(auditData.url, 10);
      setHistoricalTrends(trends);
      
      // Load comparison if we have taskId
      if (taskId) {
        const comparisonData = await compareWithPrevious(taskId);
        setComparison(comparisonData);
      }
      
      setLoadingHistory(false);
    };

    loadHistoricalData();
  }, [auditData.url, taskId]);

  const metrics: DashboardMetrics = useMemo(() => {
    const { score, details, issues, pageCount, scanTime } = auditData;
    
    const passedValue = issues?.passed;
    const passedChecks = Array.isArray(passedValue) ? passedValue.length : (passedValue || 0);
    
    return {
      totalScore: auditResults?.global_score || score,
      seoScore: auditResults?.seo_score || details?.seo?.score || 0,
      technicalScore: auditResults?.technical_score || details?.technical?.score || 0,
      performanceScore: auditResults?.performance_score || details?.performance?.score || 0,
      contentScore: auditResults?.content_score || details?.content?.score || 0,
      mobileScore: details?.mobile?.score || 0,
      usabilityScore: details?.usability?.score || 0,
      totalPages: auditResults?.page_count || pageCount || 0,
      totalIssues: (issues?.critical?.length || 0) + (issues?.important?.length || 0),
      criticalIssues: issues?.critical?.length || 0,
      warningIssues: issues?.important?.length || 0,
      passedChecks: passedChecks,
      scanDuration: scanTime
    };
  }, [auditData, auditResults]);

  const allIssues: IssueItem[] = useMemo(() => {
    const issues: IssueItem[] = [];
    
    // Extract issues from all categories
    if (auditData.details) {
      Object.entries(auditData.details).forEach(([category, categoryData]) => {
        if (categoryData?.items) {
          categoryData.items.forEach((item) => {
            issues.push({
              id: `${category}-${item.id}`,
              title: item.title,
              description: item.description,
              severity: item.status,
              category: category,
              affectedPages: item.affectedUrls || [],
              solution: item.solution
            });
          });
        }
      });
    }
    
    return issues;
  }, [auditData]);

  const pageAnalysis: PageAnalysisRow[] = useMemo(() => {
    // Use real page analysis data if available
    if (pageAnalysisData && pageAnalysisData.length > 0) {
      return pageAnalysisData.map(page => {
        const issues = collectPageIssues(page);
        return {
          url: page.url,
          title: page.title || 'Без заголовка',
          statusCode: page.status_code || 0,
          loadTime: page.load_time || 0,
          wordCount: page.word_count || 0,
          imageCount: page.image_count || 0,
          h1Count: page.h1_count || 0,
          issuesCount: issues.length,
          issues,
          score: calculatePageScore(issues)
        };
      });
    }
    
    // Разбора страниц нет — показываем пустую таблицу с объяснением.
    //
    // Раньше здесь подставлялись придуманные страницы: адреса вида /page-1,
    // заголовки «Страница 1», случайное время загрузки, случайное число
    // картинок и случайно выбранные замечания. От настоящих данных они в
    // таблице ничем не отличались.
    return [];
  }, [pageAnalysisData]);

  const handlePageClick = (page: PageAnalysisRow) => {
    setSelectedPage(page);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header with metrics */}
      <AuditDashboardHeader
        metrics={metrics}
        onExportPDF={onExportPDF}
        onExportJSON={onExportJSON}
        onShare={onShare}
      />

      {/* Category Score Gauges */}
      <CategoryScoresGrid
        seoScore={metrics.seoScore}
        technicalScore={metrics.technicalScore}
        contentScore={metrics.contentScore}
        performanceScore={metrics.performanceScore}
        previousScores={{
          seo: auditData.details?.seo?.previousScore,
          technical: auditData.details?.technical?.previousScore,
          content: auditData.details?.content?.previousScore,
          performance: auditData.details?.performance?.previousScore
        }}
      />

      {/* Issue Metrics Card */}
      {auditResults && (
        <IssueMetricsCard
          pctMissingTitle={auditResults.pct_missing_title}
          pctMissingH1={auditResults.pct_missing_h1}
          pctMissingDescription={auditResults.pct_missing_description}
          pctMissingCanonical={auditResults.pct_missing_canonical}
          pctNotIndexable={auditResults.pct_not_indexable}
          pctThinContent={auditResults.pct_thin_content}
          pctSlowPages={auditResults.pct_slow_pages}
          pctPagesWithRedirects={auditResults.pct_pages_with_redirects}
          pctLongRedirectChains={auditResults.pct_long_redirect_chains}
        />
      )}

      {/* Performance Metrics Card */}
      {taskMetrics && (
        <PerformanceMetricsCard
          avgLoadTimeMs={taskMetrics.avg_load_time_ms}
          successRate={taskMetrics.success_rate}
          redirectPagesCount={taskMetrics.redirect_pages_count}
          errorPagesCount={taskMetrics.error_pages_count}
          totalPages={metrics.totalPages}
        />
      )}

      {/* Historical Trends */}
      {!loadingHistory && historicalTrends.length > 0 && (
        <HistoricalTrendsChart data={historicalTrends} />
      )}

      {/* Comparison with Previous Audit */}
      {!loadingHistory && comparison && (
        <ComparisonCard comparison={comparison} />
      )}

      {/* Charts */}
      <IssuesBreakdownChart
        criticalCount={metrics.criticalIssues}
        warningCount={metrics.warningIssues}
        passedCount={metrics.passedChecks}
      />

      {/* Top Issues */}
      <TopIssuesPanel issues={allIssues} />

      {/* Page Analysis Table */}
      {pageAnalysis.length > 0 ? (
        <PageAnalysisInteractiveTable
          pages={pageAnalysis}
          onPageClick={handlePageClick}
        />
      ) : (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          Разбор по страницам ещё не собран. Он появится, когда аудит пройдёт до конца.
        </div>
      )}

      {/* Page Detail Drawer */}
      <PageDetailView
        page={selectedPage}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
};

export default AuditResultsDashboard;
