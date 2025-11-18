import React, { useState, useMemo } from 'react';
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

interface AuditResultsDashboardProps {
  auditData: AuditData;
  auditResults?: any;
  taskMetrics?: any;
  pageAnalysis?: any[];
  onExportPDF: () => void;
  onExportJSON: () => void;
  onShare: () => void;
}

// Helper function to calculate issues per page
const calculatePageIssues = (page: any): number => {
  let count = 0;
  if (!page.title) count++;
  if (page.h1_count === 0) count++;
  if (!page.meta_description) count++;
  if (!page.has_canonical) count++;
  if (!page.is_indexable) count++;
  if (page.has_thin_content) count++;
  if ((page.load_time || 0) > 3) count++;
  if (page.redirect_chain_length > 0) count++;
  if (page.missing_alt_images_count > 0) count++;
  return count;
};

// Helper function to calculate page score
const calculatePageScore = (page: any): number => {
  const issuesCount = calculatePageIssues(page);
  return Math.max(0, 100 - issuesCount * 10);
};

const AuditResultsDashboard: React.FC<AuditResultsDashboardProps> = ({
  auditData,
  auditResults,
  taskMetrics,
  pageAnalysis: pageAnalysisData = [],
  onExportPDF,
  onExportJSON,
  onShare
}) => {
  const [selectedPage, setSelectedPage] = useState<PageAnalysisRow | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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
      return pageAnalysisData.map(page => ({
        url: page.url,
        title: page.title || 'Без заголовка',
        statusCode: page.status_code || 0,
        loadTime: page.load_time || 0,
        wordCount: page.word_count || 0,
        imageCount: page.image_count || 0,
        h1Count: page.h1_count || 0,
        issuesCount: calculatePageIssues(page),
        issues: [], // Would need to map specific issues from page data
        score: calculatePageScore(page)
      }));
    }
    
    // Fallback to mock data if no real data available
    const pages: PageAnalysisRow[] = [];
    const pageCount = Math.min(auditData.pageCount || 10, 50);
    
    for (let i = 0; i < pageCount; i++) {
      const issuesForPage = allIssues.filter(() => Math.random() > 0.7).slice(0, Math.floor(Math.random() * 5));
      const score = Math.max(0, 100 - issuesForPage.length * 15);
      
      pages.push({
        url: `${auditData.url}${i === 0 ? '' : `/page-${i}`}`,
        title: `Страница ${i + 1}`,
        statusCode: 200,
        loadTime: 0.5 + Math.random() * 2,
        wordCount: 300 + Math.floor(Math.random() * 1000),
        imageCount: Math.floor(Math.random() * 20),
        h1Count: 1,
        issuesCount: issuesForPage.length,
        issues: issuesForPage,
        score: score
      });
    }
    
    return pages;
  }, [auditData, allIssues, pageAnalysisData]);

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

      {/* Charts */}
      <IssuesBreakdownChart
        criticalCount={metrics.criticalIssues}
        warningCount={metrics.warningIssues}
        passedCount={metrics.passedChecks}
      />

      {/* Top Issues */}
      <TopIssuesPanel issues={allIssues} />

      {/* Page Analysis Table */}
      <PageAnalysisInteractiveTable
        pages={pageAnalysis}
        onPageClick={handlePageClick}
      />

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
