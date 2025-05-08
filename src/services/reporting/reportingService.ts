
import { AuditData } from '@/types/audit';

export class ReportingService {
  async generatePdfReport(auditData: AuditData): Promise<Blob> {
    // Implementation for PDF report generation
    // This would normally call an API or use a library to generate a PDF
    
    // For now, we'll mock this functionality
    const mockPdfContent = JSON.stringify(auditData, null, 2);
    
    // Create a Blob that represents a PDF file
    return new Blob([mockPdfContent], { type: 'application/pdf' });
  }
  
  async exportJsonReport(auditData: AuditData, filename: string = 'audit-report'): Promise<void> {
    try {
      // Convert audit data to a JSON string with pretty formatting
      const jsonData = JSON.stringify(auditData, null, 2);
      
      // Create a Blob from the JSON string
      const blob = new Blob([jsonData], { type: 'application/json' });
      
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create an anchor element for downloading
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename.replace(/[^a-z0-9]/gi, '-')}-${new Date().toISOString().split('T')[0]}.json`;
      
      // Append the anchor to the document, click it, and remove it
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Release the URL object
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting JSON report:', error);
      throw error;
    }
  }

  // Generate sitemap XML from an array of URLs
  generateSitemapXml(domain: string, urls: string[]): string {
    // Simple XML sitemap generation
    const urlEntries = urls.map(url => 
      `<url><loc>${this.encodeUrl(url)}</loc><lastmod>${new Date().toISOString()}</lastmod></url>`
    ).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}</urlset>`;
  }

  // Helper method to properly encode URLs
  private encodeUrl(url: string): string {
    try {
      return encodeURIComponent(url);
    } catch (e) {
      return url;
    }
  }

  // Export sitemap XML as a downloadable file
  async exportSitemapXml(sitemap: string, filename: string = 'sitemap'): Promise<void> {
    try {
      // Create a Blob from the XML string
      const blob = new Blob([sitemap], { type: 'application/xml' });
      
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create an anchor element for downloading
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.xml`;
      
      // Append the anchor to the document, click it, and remove it
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Release the URL object
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting sitemap XML:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const reportingService = new ReportingService();
