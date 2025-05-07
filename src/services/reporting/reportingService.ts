
import { saveAs } from 'file-saver';
import { PageData } from '../audit/crawler/types';
import { validationService } from '../validation/validationService';

/**
 * Service for generating and exporting reports
 */
export class ReportingService {
  /**
   * Generate basic HTML report from crawl results
   * 
   * @param url Base URL
   * @param pagesData Array of page data
   * @returns HTML string
   */
  generateHtmlReport(url: string, pagesData: PageData[]): string {
    const domain = validationService.extractDomain(url);
    const timestamp = new Date().toISOString();
    const pageCount = pagesData.length;
    
    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SEO Audit Report for ${domain}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; color: #333; }
          h1, h2, h3 { color: #2C3E50; }
          .container { max-width: 1200px; margin: 0 auto; }
          .summary { background-color: #F8F9FA; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .warning { color: #E74C3C; }
          .success { color: #27AE60; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #F8F9FA; }
          tr:hover { background-color: #f5f5f5; }
          .meta { color: #7F8C8D; font-size: 0.9em; margin-bottom: 5px; }
          .issue { margin-bottom: 10px; padding: 10px; background-color: #FFF3CD; border-radius: 4px; }
          .critical { border-left: 4px solid #E74C3C; }
          .important { border-left: 4px solid #F39C12; }
          .opportunity { border-left: 4px solid #3498DB; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>SEO Audit Report</h1>
          <div class="meta">Generated on: ${new Date(timestamp).toLocaleString()}</div>
          <div class="meta">Domain: ${domain}</div>
          
          <div class="summary">
            <h2>Summary</h2>
            <p>Total Pages Scanned: ${pageCount}</p>
            <p>Pages with Issues: ${pagesData.filter(page => page.issues.length > 0).length}</p>
          </div>
    `;
    
    // Add page details
    html += `<h2>Page Analysis</h2>`;
    
    // Pages table
    html += `
      <table>
        <thead>
          <tr>
            <th>URL</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Issues</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    pagesData.forEach(page => {
      const issuesCount = page.issues.length;
      const statusClass = issuesCount > 0 ? 'warning' : 'success';
      
      html += `
        <tr>
          <td><a href="${page.url}" target="_blank">${page.url.substring(0, 50)}${page.url.length > 50 ? '...' : ''}</a></td>
          <td>${page.title || '<em>Missing</em>'}</td>
          <td>${page.description ? page.description.substring(0, 100) + '...' : '<em>Missing</em>'}</td>
          <td class="${statusClass}">${page.statusCode} ${page.statusCode === 200 ? '✓' : '⚠️'}</td>
          <td>${issuesCount > 0 ? `${issuesCount} issues` : 'None'}</td>
        </tr>
      `;
    });
    
    html += `
        </tbody>
      </table>
    `;
    
    // Issues summary
    const criticalIssues = pagesData.flatMap(page => 
      page.issues.filter(issue => issue.severity === 'critical')
    );
    
    const importantIssues = pagesData.flatMap(page => 
      page.issues.filter(issue => issue.severity === 'important')
    );
    
    html += `
      <h2>Issues Summary</h2>
      
      <h3>Critical Issues (${criticalIssues.length})</h3>
      ${criticalIssues.length > 0 
        ? criticalIssues.map(issue => 
            `<div class="issue critical">
              <strong>${issue.type}</strong>: ${issue.description}
            </div>`
          ).join('') 
        : '<p>No critical issues found.</p>'
      }
      
      <h3>Important Issues (${importantIssues.length})</h3>
      ${importantIssues.length > 0 
        ? importantIssues.map(issue => 
            `<div class="issue important">
              <strong>${issue.type}</strong>: ${issue.description}
            </div>`
          ).join('') 
        : '<p>No important issues found.</p>'
      }
    `;
    
    // Close HTML
    html += `
        </div>
      </body>
      </html>
    `;
    
    return html;
  }

  /**
   * Generate sitemap XML from crawled URLs
   * 
   * @param domain Domain name
   * @param urls Array of URLs
   * @returns XML string
   */
  generateSitemapXml(domain: string, urls: string[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Filter URLs from the same domain
    urls.forEach(url => {
      try {
        const urlObj = new URL(url);
        if (urlObj.hostname === domain || urlObj.hostname === 'www.' + domain) {
          xml += '  <url>\n';
          xml += `    <loc>${url}</loc>\n`;
          xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
          xml += '  </url>\n';
        }
      } catch (e) {
        // Skip invalid URLs
      }
    });
    
    xml += '</urlset>';
    return xml;
  }

  /**
   * Export HTML report as a file
   * 
   * @param html HTML content
   * @param domain Domain name for filename
   */
  exportHtmlReport(html: string, domain: string): void {
    const blob = new Blob([html], { type: 'text/html' });
    saveAs(blob, `audit-report-${domain}-${new Date().toISOString().slice(0, 10)}.html`);
  }

  /**
   * Export sitemap as XML file
   * 
   * @param xml XML content
   * @param domain Domain name for filename
   */
  exportSitemapXml(xml: string, domain: string): void {
    const blob = new Blob([xml], { type: 'application/xml' });
    saveAs(blob, `sitemap-${domain}.xml`);
  }

  /**
   * Export report data as JSON
   * 
   * @param data Report data
   * @param domain Domain name for filename
   */
  exportJsonReport(data: any, domain: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, `seo-data-${domain}-${new Date().toISOString().slice(0, 10)}.json`);
  }
}

export const reportingService = new ReportingService();
