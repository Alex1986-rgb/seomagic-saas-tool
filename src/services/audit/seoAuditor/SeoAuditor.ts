
import { PageContent } from '../crawler/WebCrawler';
import { HtmlOptimizer } from './HtmlOptimizer';

export interface SeoAuditResult {
  url: string;
  score: number;
  issues: {
    critical: SeoIssue[];
    important: SeoIssue[];
    opportunities: SeoIssue[];
    minor: SeoIssue[];
    passed: SeoIssue[];
  };
  recommendations: string[];
  optimizedPages: Map<string, string>;
  summary: {
    totalPages: number;
    pagesWithIssues: number;
    criticalIssues: number;
    importantIssues: number;
    totalIssues: number;
    averageScore: number;
  };
}

export interface SeoIssue {
  title: string;
  description: string;
  impact: 'critical' | 'important' | 'moderate' | 'minor' | 'passed';
  affectedUrls: string[];
  recommendations: string[];
}

export class SeoAuditor {
  private htmlOptimizer: HtmlOptimizer;
  
  constructor() {
    this.htmlOptimizer = new HtmlOptimizer();
  }
  
  async auditWebsite(domain: string, pages: Map<string, PageContent>): Promise<SeoAuditResult> {
    console.log(`Starting SEO audit for ${domain} with ${pages.size} pages`);
    
    // Initialize audit result
    const auditResult: SeoAuditResult = {
      url: domain,
      score: 0,
      issues: {
        critical: [],
        important: [],
        opportunities: [],
        minor: [],
        passed: []
      },
      recommendations: [],
      optimizedPages: new Map<string, string>(),
      summary: {
        totalPages: pages.size,
        pagesWithIssues: 0,
        criticalIssues: 0,
        importantIssues: 0,
        totalIssues: 0,
        averageScore: 0
      }
    };
    
    // Audit each page and collect issues
    let totalScore = 0;
    let pagesWithIssues = 0;
    
    // Store issues by type
    const missingTitle: string[] = [];
    const missingMetaDescription: string[] = [];
    const missingMetaKeywords: string[] = [];
    const missingH1: string[] = [];
    const multipleH1: string[] = [];
    const missingAltText: string[] = [];
    const poorHeadingStructure: string[] = [];
    const tooShortContent: string[] = [];
    const poorInternalLinking: string[] = [];
    
    // Check each page
    pages.forEach((page, url) => {
      let pageScore = 100;
      let hasIssues = false;
      
      // Check title
      if (!page.title) {
        pageScore -= 15;
        missingTitle.push(url);
        hasIssues = true;
      } else if (page.title.length < 10 || page.title.length > 70) {
        pageScore -= 5;
        hasIssues = true;
      }
      
      // Check meta description
      if (!page.meta.description) {
        pageScore -= 10;
        missingMetaDescription.push(url);
        hasIssues = true;
      } else if (page.meta.description.length < 50 || page.meta.description.length > 160) {
        pageScore -= 5;
        hasIssues = true;
      }
      
      // Check meta keywords
      if (!page.meta.keywords) {
        pageScore -= 5;
        missingMetaKeywords.push(url);
        hasIssues = true;
      }
      
      // Check H1
      if (page.headings.h1.length === 0) {
        pageScore -= 10;
        missingH1.push(url);
        hasIssues = true;
      } else if (page.headings.h1.length > 1) {
        pageScore -= 5;
        multipleH1.push(url);
        hasIssues = true;
      }
      
      // Check heading structure
      const hasHeadingStructureIssue = this.checkHeadingStructure(page.headings);
      if (hasHeadingStructureIssue) {
        pageScore -= 5;
        poorHeadingStructure.push(url);
        hasIssues = true;
      }
      
      // Check alt text for images
      const missingAltImages = page.images.filter(img => !img.alt);
      if (missingAltImages.length > 0) {
        pageScore -= Math.min(10, missingAltImages.length * 2);
        missingAltText.push(url);
        hasIssues = true;
      }
      
      // Check content length
      if (page.wordCount < 300) {
        pageScore -= 10;
        tooShortContent.push(url);
        hasIssues = true;
      }
      
      // Check internal linking
      if (page.links.internal.length < 3) {
        pageScore -= 5;
        poorInternalLinking.push(url);
        hasIssues = true;
      }
      
      // Ensure score is between 0 and 100
      pageScore = Math.max(0, Math.min(100, pageScore));
      
      // Add to total
      totalScore += pageScore;
      if (hasIssues) {
        pagesWithIssues++;
      }
      
      // Create optimized version of the page
      const optimizedHtml = this.htmlOptimizer.optimizePage(page);
      auditResult.optimizedPages.set(url, optimizedHtml);
    });
    
    // Calculate average score
    auditResult.score = Math.round(totalScore / pages.size);
    auditResult.summary.averageScore = auditResult.score;
    auditResult.summary.pagesWithIssues = pagesWithIssues;
    
    // Add issues to result
    if (missingTitle.length > 0) {
      auditResult.issues.critical.push({
        title: 'Missing title tags',
        description: `${missingTitle.length} pages are missing title tags`,
        impact: 'critical',
        affectedUrls: missingTitle,
        recommendations: ['Add descriptive and unique title tags to all pages']
      });
      auditResult.summary.criticalIssues += 1;
    }
    
    if (missingMetaDescription.length > 0) {
      auditResult.issues.important.push({
        title: 'Missing meta descriptions',
        description: `${missingMetaDescription.length} pages are missing meta descriptions`,
        impact: 'important',
        affectedUrls: missingMetaDescription,
        recommendations: ['Add compelling meta descriptions to improve click-through rates']
      });
      auditResult.summary.importantIssues += 1;
    }
    
    if (missingH1.length > 0) {
      auditResult.issues.important.push({
        title: 'Missing H1 headings',
        description: `${missingH1.length} pages are missing H1 headings`,
        impact: 'important',
        affectedUrls: missingH1,
        recommendations: ['Add descriptive H1 headings to all pages']
      });
      auditResult.summary.importantIssues += 1;
    }
    
    if (multipleH1.length > 0) {
      auditResult.issues.important.push({
        title: 'Multiple H1 headings',
        description: `${multipleH1.length} pages have multiple H1 headings`,
        impact: 'important',
        affectedUrls: multipleH1,
        recommendations: ['Use only one H1 heading per page']
      });
      auditResult.summary.importantIssues += 1;
    }
    
    if (missingAltText.length > 0) {
      auditResult.issues.important.push({
        title: 'Images missing alt text',
        description: `${missingAltText.length} pages have images without alt text`,
        impact: 'important',
        affectedUrls: missingAltText,
        recommendations: ['Add descriptive alt text to all images']
      });
      auditResult.summary.importantIssues += 1;
    }
    
    if (poorHeadingStructure.length > 0) {
      auditResult.issues.opportunities.push({
        title: 'Poor heading structure',
        description: `${poorHeadingStructure.length} pages have poor heading structure`,
        impact: 'moderate',
        affectedUrls: poorHeadingStructure,
        recommendations: ['Use a logical heading structure (H1 > H2 > H3)']
      });
    }
    
    if (tooShortContent.length > 0) {
      auditResult.issues.opportunities.push({
        title: 'Thin content',
        description: `${tooShortContent.length} pages have fewer than 300 words`,
        impact: 'moderate',
        affectedUrls: tooShortContent,
        recommendations: ['Expand thin content with valuable information']
      });
    }
    
    if (missingMetaKeywords.length > 0) {
      auditResult.issues.minor.push({
        title: 'Missing meta keywords',
        description: `${missingMetaKeywords.length} pages are missing meta keywords`,
        impact: 'minor',
        affectedUrls: missingMetaKeywords,
        recommendations: ['Add relevant keywords to meta keywords tag']
      });
    }
    
    if (poorInternalLinking.length > 0) {
      auditResult.issues.opportunities.push({
        title: 'Poor internal linking',
        description: `${poorInternalLinking.length} pages have fewer than 3 internal links`,
        impact: 'moderate',
        affectedUrls: poorInternalLinking,
        recommendations: ['Improve internal linking to help search engines discover and understand your pages']
      });
    }
    
    // Generate recommendations
    auditResult.recommendations = this.generateRecommendations(auditResult.issues);
    
    // Calculate total issues
    auditResult.summary.totalIssues = 
      auditResult.issues.critical.length + 
      auditResult.issues.important.length + 
      auditResult.issues.opportunities.length + 
      auditResult.issues.minor.length;
    
    return auditResult;
  }
  
  private checkHeadingStructure(headings: { h1: string[], h2: string[], h3: string[], h4: string[], h5: string[], h6: string[] }): boolean {
    // Check if H2 exists but no H1
    if (headings.h1.length === 0 && headings.h2.length > 0) {
      return true;
    }
    
    // Check if H3 exists but no H2
    if (headings.h2.length === 0 && headings.h3.length > 0) {
      return true;
    }
    
    // Check if H4 exists but no H3
    if (headings.h3.length === 0 && headings.h4.length > 0) {
      return true;
    }
    
    return false;
  }
  
  private generateRecommendations(issues: { 
    critical: SeoIssue[], 
    important: SeoIssue[], 
    opportunities: SeoIssue[], 
    minor: SeoIssue[] 
  }): string[] {
    const recommendations: string[] = [];
    
    // Add recommendations from issues
    issues.critical.forEach(issue => {
      recommendations.push(...issue.recommendations);
    });
    
    issues.important.forEach(issue => {
      recommendations.push(...issue.recommendations);
    });
    
    issues.opportunities.forEach(issue => {
      recommendations.push(...issue.recommendations);
    });
    
    // Add some generic recommendations if we have few specific ones
    if (recommendations.length < 5) {
      recommendations.push(
        'Create a comprehensive XML sitemap and submit it to search engines',
        'Optimize page loading speed for better user experience and SEO',
        'Make your website mobile-friendly',
        'Use descriptive URLs with keywords',
        'Regularly create high-quality content to improve search rankings'
      );
    }
    
    // Remove duplicates
    return [...new Set(recommendations)];
  }
}
