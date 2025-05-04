
export interface SeoIssue {
  title: string;
  description: string;
  affectedUrls: string[];
}

export interface SeoIssues {
  critical: SeoIssue[];
  important: SeoIssue[];
  opportunities: SeoIssue[];
  minor: SeoIssue[];
  passed: SeoIssue[];
}

export interface SeoAuditSummary {
  totalPages: number;
  uniquePages: number;
  duplicatePages: number;
  brokenLinks: number;
  missingTitles: number;
  missingDescriptions: number;
  totalIssues: number;
}

export interface SeoAuditResult {
  url: string;
  score: number;
  summary: SeoAuditSummary;
  recommendations: string[];
  issues: SeoIssues;
  optimizedPages: Map<string, string>;
}

export class SeoAuditor {
  async auditSite(url: string): Promise<SeoAuditResult> {
    // Simplified implementation for demo purposes
    return {
      url,
      score: 75,
      summary: {
        totalPages: 35,
        uniquePages: 33,
        duplicatePages: 2,
        brokenLinks: 4,
        missingTitles: 2,
        missingDescriptions: 6,
        totalIssues: 22
      },
      recommendations: [
        "Add meta descriptions to pages that are missing them",
        "Fix broken links on the site",
        "Optimize image alt tags on key pages"
      ],
      issues: {
        critical: [],
        important: [],
        opportunities: [],
        minor: [],
        passed: []
      },
      optimizedPages: new Map<string, string>()
    };
  }
}
