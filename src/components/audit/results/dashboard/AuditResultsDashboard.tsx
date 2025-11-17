import React, { useState, useMemo } from 'react';
import { AuditData } from '@/types/audit';
import { DashboardMetrics, IssueItem, PageAnalysisRow } from './types';
import AuditDashboardHeader from './AuditDashboardHeader';
import ScoreGaugeCard from './ScoreGaugeCard';
import IssuesBreakdownChart from './IssuesBreakdownChart';
import TopIssuesPanel from './TopIssuesPanel';
import PageAnalysisInteractiveTable from './PageAnalysisInteractiveTable';
import PageDetailView from './PageDetailView';

interface AuditResultsDashboardProps {
  auditData: AuditData;
  onExportPDF: () => void;
  onExportJSON: () => void;
  onShare: () => void;
}

const AuditResultsDashboard: React.FC<AuditResultsDashboardProps> = ({
  auditData,
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
      totalScore: score,
      seoScore: details?.seo?.score || 0,
      technicalScore: details?.technical?.score || 0,
      performanceScore: details?.performance?.score || 0,
      contentScore: details?.content?.score || 0,
      mobileScore: details?.mobile?.score || 0,
      usabilityScore: details?.usability?.score || 0,
      totalPages: pageCount || 0,
      totalIssues: (issues?.critical?.length || 0) + (issues?.important?.length || 0),
      criticalIssues: issues?.critical?.length || 0,
      warningIssues: issues?.important?.length || 0,
      passedChecks: passedChecks,
      scanDuration: scanTime
    };
  }, [auditData]);

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
    // Generate mock page analysis data based on audit results
    // In real implementation, this would come from the backend
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
  }, [auditData, allIssues]);

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

      {/* Score Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreGaugeCard
          title="SEO"
          score={metrics.seoScore}
          previousScore={auditData.details?.seo?.previousScore}
          index={0}
        />
        <ScoreGaugeCard
          title="Технические"
          score={metrics.technicalScore}
          previousScore={auditData.details?.technical?.previousScore}
          index={1}
        />
        <ScoreGaugeCard
          title="Производительность"
          score={metrics.performanceScore}
          previousScore={auditData.details?.performance?.previousScore}
          index={2}
        />
        <ScoreGaugeCard
          title="Контент"
          score={metrics.contentScore}
          previousScore={auditData.details?.content?.previousScore}
          index={3}
        />
      </div>

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
