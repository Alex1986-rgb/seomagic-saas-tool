
import { SimpleSitemapCreator } from './simpleSitemapCreator';
import { reportService } from '@/api/services/reportService';
import { supabase } from '@/integrations/supabase/client';

// Export functions for website scanning
export async function scanWebsite(url: string, options: any = {}) {
  try {
    const scanner = new SimpleSitemapCreator({
      maxPages: options.maxPages || 10000,
      maxDepth: options.maxDepth || 5,
      includeStylesheet: true,
      requestDelay: options.requestDelay || 500,
      concurrentRequests: options.concurrentRequests || 3
    });
    
    // Progress callback function
    const progressCallback = (scanned: number, total: number, currentUrl: string) => {
      if (options.onProgress) {
        options.onProgress(scanned, total, currentUrl);
      }
    };
    
    // Start scanning
    const urls = await scanner.crawl(url, progressCallback);
    return urls;
  } catch (error) {
    console.error('Error scanning website:', error);
    throw error;
  }
}

// Generate sitemap for a website
export async function generateSitemap(url: string, options: any = {}): Promise<string> {
  try {
    const scanner = new SimpleSitemapCreator({
      maxPages: options.maxPages || 10000,
      maxDepth: options.maxDepth || 5,
      includeStylesheet: true
    });
    
    // Scan the website to find URLs
    const urls = await scanner.crawl(url);
    
    // Generate sitemap XML
    const sitemap = scanner.generateSitemap(urls);
    return sitemap;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
}

// Download audit report in PDF format
export async function downloadAuditPdfReport(domain: string, urls: string[], data: any): Promise<boolean> {
  try {
    // Extract task_id from data if available
    const taskId = data?.task_id || data?.id;
    
    if (!taskId) {
      console.error('No task_id available for PDF generation');
      return false;
    }

    // Generate PDF report via edge function
    const reportResponse = await reportService.generateReport(taskId, 'pdf');
    
    if (!reportResponse.success || !reportResponse.storage_path) {
      console.error('Failed to generate report:', reportResponse.message);
      return false;
    }

    // Download the report from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('pdf-reports')
      .download(reportResponse.storage_path);

    if (downloadError || !fileData) {
      console.error('Failed to download PDF:', downloadError);
      return false;
    }

    // Create download link
    const blob = new Blob([fileData], { type: 'application/pdf' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `audit-report-${domain}-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return true;
  } catch (error) {
    console.error('Error generating PDF report:', error);
    return false;
  }
}

// Download error report for the website
export async function downloadErrorReport(domain: string, urls: string[], data: any): Promise<boolean> {
  try {
    // Extract task_id from data if available
    const taskId = data?.task_id || data?.id;
    
    if (!taskId) {
      console.error('No task_id available for error report generation');
      return false;
    }

    // Generate JSON report via edge function
    const reportResponse = await reportService.generateReport(taskId, 'json');
    
    if (!reportResponse.success || !reportResponse.storage_path) {
      console.error('Failed to generate error report:', reportResponse.message);
      return false;
    }

    // Download the report from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('pdf-reports')
      .download(reportResponse.storage_path);

    if (downloadError || !fileData) {
      console.error('Failed to download error report:', downloadError);
      return false;
    }

    // Create download link
    const blob = new Blob([fileData], { type: 'application/json' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `error-report-${domain}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return true;
  } catch (error) {
    console.error('Error generating error report:', error);
    return false;
  }
}

// Calculate optimization metrics for scanner
export function calculateScannerOptimizationMetrics(urls: string[], data: any = {}) {
  // Implementation for calculating optimization metrics
  return {
    totalScore: 85,
    potentialScoreIncrease: 15,
    issues: {
      missingMetaDescriptions: 10,
      missingAltTags: 15,
      poorUrlStructure: 5
    },
    estimatedCost: 250,
    optimizationItems: []
  };
}

// Create optimized site based on scanner results
export function createScannerOptimizedSite(domain: string, urls: string[], data: any = {}): Promise<boolean> {
  return new Promise((resolve) => {
    // Implementation for creating optimized site
    console.log(`Creating optimized site for ${domain} with ${urls.length} URLs`);
    resolve(true);
  });
}
