
import { PageData } from './types';

/**
 * Site analyzer class for analyzing crawled pages and generating insights
 */
export class SiteAnalyzer {
  private pages: PageData[] = [];
  
  /**
   * Add a page to the analyzer
   */
  addPage(page: PageData): void {
    this.pages.push(page);
  }
  
  /**
   * Generate basic stats for the site
   */
  generateStats(): any {
    if (this.pages.length === 0) {
      return {
        pageCount: 0,
        avgLoadTime: 0,
        avgContentLength: 0,
        internalLinks: 0,
        externalLinks: 0
      };
    }
    
    let totalLoadTime = 0;
    let totalContentLength = 0;
    let totalInternalLinks = 0;
    let totalExternalLinks = 0;
    
    this.pages.forEach(page => {
      if (page.loadTime) totalLoadTime += page.loadTime;
      if (page.contentLength) totalContentLength += page.contentLength;
      if (page.internalLinks) totalInternalLinks += page.internalLinks.length;
      if (page.externalLinks) totalExternalLinks += page.externalLinks.length;
    });
    
    return {
      pageCount: this.pages.length,
      avgLoadTime: totalLoadTime / this.pages.length,
      avgContentLength: totalContentLength / this.pages.length,
      internalLinks: totalInternalLinks,
      externalLinks: totalExternalLinks
    };
  }
  
  /**
   * Detect issues with the site
   */
  detectIssues(): any {
    const issues = {
      missingTitles: [],
      missingDescriptions: [],
      missingH1: [],
      duplicateTitles: {},
      duplicateDescriptions: {},
      brokenLinks: [],
      slowPages: []
    };
    
    // Process each page for issues
    this.pages.forEach(page => {
      if (!page.title || page.title.trim() === '') {
        issues.missingTitles.push(page.url);
      }
      
      if (!page.description || page.description.trim() === '') {
        issues.missingDescriptions.push(page.url);
      }
      
      if (!page.h1 || page.h1.length === 0) {
        issues.missingH1.push(page.url);
      }
      
      if (page.loadTime && page.loadTime > 2.0) { // Slow if > 2 seconds
        issues.slowPages.push({
          url: page.url,
          loadTime: page.loadTime
        });
      }
      
      // Check for duplicate titles
      if (page.title) {
        const title = page.title.trim();
        if (!issues.duplicateTitles[title]) {
          issues.duplicateTitles[title] = [];
        }
        issues.duplicateTitles[title].push(page.url);
      }
      
      // Check for duplicate descriptions
      if (page.description) {
        const description = page.description.trim();
        if (!issues.duplicateDescriptions[description]) {
          issues.duplicateDescriptions[description] = [];
        }
        issues.duplicateDescriptions[description].push(page.url);
      }
    });
    
    // Filter out unique titles and descriptions
    Object.keys(issues.duplicateTitles).forEach(title => {
      if (issues.duplicateTitles[title].length <= 1) {
        delete issues.duplicateTitles[title];
      }
    });
    
    Object.keys(issues.duplicateDescriptions).forEach(description => {
      if (issues.duplicateDescriptions[description].length <= 1) {
        delete issues.duplicateDescriptions[description];
      }
    });
    
    return issues;
  }
  
  /**
   * Get content analysis for the site
   */
  getContentAnalysis(): any {
    // Implementation would analyze content patterns, keyword usage, etc.
    return {
      // Placeholder for content analysis
    };
  }
}
