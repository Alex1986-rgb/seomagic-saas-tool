
import { saveAs } from 'file-saver';
import { CrawlSummary } from '../audit/crawler/types';

/**
 * Service for generating and exporting reports
 */
export class ReportingService {
  /**
   * Generate sitemap XML
   * @param domain Domain name
   * @param urls Array of URLs
   * @returns Sitemap XML content
   */
  generateSitemapXml(domain: string, urls: string[]): string {
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add URLs to sitemap
    urls.forEach(url => {
      try {
        const urlObj = new URL(url);
        // Check if URL belongs to the domain
        if (urlObj.hostname === domain || urlObj.hostname === 'www.' + domain) {
          sitemap += '  <url>\n';
          sitemap += `    <loc>${url}</loc>\n`;
          sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
          sitemap += '  </url>\n';
        }
      } catch (e) {
        console.warn("Invalid URL skipped in sitemap:", url);
      }
    });

    sitemap += '</urlset>';
    return sitemap;
  }

  /**
   * Export sitemap XML as a file
   * @param sitemapXml Sitemap XML content
   * @param domain Domain name
   */
  exportSitemapXml(sitemapXml: string, domain: string): void {
    const blob = new Blob([sitemapXml], { type: 'application/xml;charset=utf-8' });
    saveAs(blob, `sitemap-${domain}-${new Date().toISOString().slice(0, 10)}.xml`);
  }

  /**
   * Generate PDF report
   * @param data Report data
   * @returns PDF blob
   */
  async generatePdfReport(data: any): Promise<Blob> {
    // Mock implementation
    console.log('Generating PDF report with data:', data);
    return new Blob(['PDF report content'], { type: 'application/pdf' });
  }

  /**
   * Export report as PDF
   * @param data Report data
   * @param filename File name
   */
  async exportPdfReport(data: any, filename: string): Promise<void> {
    const pdfBlob = await this.generatePdfReport(data);
    saveAs(pdfBlob, filename);
  }
  
  /**
   * Export JSON report
   * @param data Report data
   * @param domain Domain name
   */
  async exportJsonReport(data: any, domain: string): Promise<void> {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    saveAs(blob, `report-${domain}-${new Date().toISOString().slice(0, 10)}.json`);
  }
}

export const reportingService = new ReportingService();
