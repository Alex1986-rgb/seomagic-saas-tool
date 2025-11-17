import { PageData } from '@/types/audit/crawler';
import { SEOAnalyzer, TechnicalAnalyzer } from './analyzers';
import { AuditData } from '@/types/audit';

export class AuditService {
  /**
   * Process audit results from crawled pages
   */
  static async processAuditData(
    url: string,
    pages: PageData[]
  ): Promise<Partial<AuditData>> {
    // Initialize analyzers
    const seoAnalyzer = new SEOAnalyzer();
    const technicalAnalyzer = new TechnicalAnalyzer();

    // Add pages to analyzers
    pages.forEach(page => {
      seoAnalyzer.addPage(page);
      technicalAnalyzer.addPage(page);
    });

    // Perform analysis
    const seoResults = seoAnalyzer.analyze();
    const technicalResults = technicalAnalyzer.analyze();

    // Calculate overall score (weighted average)
    const overallScore = Math.round(
      seoResults.score * 0.25 +           // SEO: 25%
      technicalResults.score * 0.20 +     // Technical: 20%
      75 * 0.20 +                         // Content: 20% (placeholder)
      75 * 0.20 +                         // Performance: 20% (placeholder)
      75 * 0.10 +                         // Mobile: 10% (placeholder)
      75 * 0.05                           // Usability: 5% (placeholder)
    );

    // Collect all issues
    const criticalIssues = [
      ...seoResults.items.filter(i => i.status === 'error' && i.impact === 'high'),
      ...technicalResults.items.filter(i => i.status === 'error' && i.impact === 'high')
    ];

    const importantIssues = [
      ...seoResults.items.filter(i => i.status === 'error' && i.impact !== 'high'),
      ...technicalResults.items.filter(i => i.status === 'warning' && i.impact === 'high')
    ];

    const opportunities = [
      ...seoResults.items.filter(i => i.status === 'warning' && i.impact !== 'high')
    ];

    return {
      url,
      score: overallScore,
      pageCount: pages.length,
      crawledPages: pages.length,
      date: new Date().toISOString(),
      status: 'completed',
      issues: {
        critical: criticalIssues.map(i => i.description),
        important: importantIssues.map(i => i.description),
        opportunities: opportunities.map(i => i.description),
        minor: 0,
        passed: seoResults.passed + technicalResults.passed
      },
      details: {
        seo: {
          score: seoResults.score,
          passed: seoResults.passed,
          warning: seoResults.warning,
          failed: seoResults.failed,
          items: seoResults.items,
          name: 'SEO',
          description: 'Анализ SEO-факторов'
        },
        technical: {
          score: technicalResults.score,
          passed: technicalResults.passed,
          warning: technicalResults.warning,
          failed: technicalResults.failed,
          items: technicalResults.items,
          name: 'Технический',
          description: 'Технический анализ сайта'
        },
        content: {
          score: 75,
          passed: 5,
          warning: 2,
          failed: 1,
          items: [],
          name: 'Контент',
          description: 'Анализ контента (в разработке)'
        },
        performance: {
          score: 75,
          passed: 4,
          warning: 3,
          failed: 1,
          items: [],
          name: 'Производительность',
          description: 'Анализ производительности (в разработке)'
        },
        mobile: {
          score: 75,
          passed: 3,
          warning: 1,
          failed: 0,
          items: [],
          name: 'Мобильная версия',
          description: 'Анализ мобильной версии (в разработке)'
        },
        usability: {
          score: 75,
          passed: 4,
          warning: 1,
          failed: 0,
          items: [],
          name: 'Юзабилити',
          description: 'Анализ удобства использования (в разработке)'
        }
      }
    };
  }

  /**
   * Get detailed analysis insights
   */
  static getAnalysisInsights(seoResults: any, technicalResults: any) {
    return {
      topIssues: [
        ...seoResults.items.filter((i: any) => i.status === 'error').slice(0, 5),
        ...technicalResults.items.filter((i: any) => i.status === 'error').slice(0, 5)
      ].sort((a, b) => {
        const impactWeight = { high: 3, medium: 2, low: 1 };
        return impactWeight[b.impact] - impactWeight[a.impact];
      }),
      quickWins: [
        ...seoResults.items.filter((i: any) => i.status === 'warning' && i.impact === 'high'),
        ...technicalResults.items.filter((i: any) => i.status === 'warning' && i.impact === 'high')
      ],
      positives: [
        ...seoResults.items.filter((i: any) => i.status === 'good'),
        ...technicalResults.items.filter((i: any) => i.status === 'good')
      ]
    };
  }
}
