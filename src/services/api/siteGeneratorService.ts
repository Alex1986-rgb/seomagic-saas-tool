import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { PageData } from './crawlerService';

class SiteGeneratorService {
  /**
   * Generate an optimized copy of a website
   */
  async generateOptimizedSite(
    domain: string,
    pages: Map<string, PageData>,
    optimizedPages: Map<string, any>
  ): Promise<Blob> {
    const zip = new JSZip();
    
    // Create folders for the site structure
    const rootFolder = zip.folder(domain) as JSZip;
    
    // Keep track of created folders to avoid duplicates
    const createdFolders = new Set<string>();
    
    // Process each page
    for (const [url, pageData] of pages.entries()) {
      try {
        // Get the optimized version of the page
        const optimized = optimizedPages.get(url);
        const html = optimized?.optimizedHtml || pageData.html;
        
        if (!html) continue;
        
        // Parse the URL path
        const urlObj = new URL(url);
        let path = urlObj.pathname;
        
        // Handle root path
        if (path === '/') {
          rootFolder.file('index.html', html);
          continue;
        }
        
        // Remove leading slash
        path = path.startsWith('/') ? path.substring(1) : path;
        
        // Handle paths with trailing slash
        if (path.endsWith('/')) {
          path = path + 'index.html';
        } else if (!path.includes('.')) {
          path = path + '/index.html';
        } else if (!path.endsWith('.html')) {
          // Ensure non-HTML files have proper extensions
          if (!path.includes('.')) {
            path = path + '.html';
          }
        }
        
        // Create folders if needed
        if (path.includes('/')) {
          const dirPath = path.substring(0, path.lastIndexOf('/'));
          
          if (!createdFolders.has(dirPath)) {
            rootFolder.folder(dirPath);
            createdFolders.add(dirPath);
          }
        }
        
        // Add the file to the zip
        rootFolder.file(path, html);
      } catch (error) {
        console.error(`Error processing ${url}:`, error);
      }
    }
    
    // Generate sitemap.xml
    const sitemap = this.generateSitemap(domain, pages);
    rootFolder.file('sitemap.xml', sitemap);
    
    // Generate robots.txt
    const robots = this.generateRobotsTxt(domain);
    rootFolder.file('robots.txt', robots);
    
    // Generate the zip file
    return zip.generateAsync({ type: 'blob' });
  }
  
  /**
   * Download the optimized site as a ZIP file
   */
  async downloadOptimizedSite(
    domain: string,
    pages: Map<string, PageData>,
    optimizedPages: Map<string, any>
  ): Promise<void> {
    const blob = await this.generateOptimizedSite(domain, pages, optimizedPages);
    saveAs(blob, `${domain}-optimized.zip`);
  }
  
  /**
   * Generate a sitemap for the site
   */
  private generateSitemap(domain: string, pages: Map<string, PageData>): string {
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const [url, _] of pages.entries()) {
      const lastmod = new Date().toISOString();
      
      sitemap += '  <url>\n';
      sitemap += `    <loc>${url}</loc>\n`;
      sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
      sitemap += '    <changefreq>monthly</changefreq>\n';
      sitemap += '    <priority>0.8</priority>\n';
      sitemap += '  </url>\n';
    }
    
    sitemap += '</urlset>';
    
    return sitemap;
  }
  
  /**
   * Generate a robots.txt file for the site
   */
  private generateRobotsTxt(domain: string): string {
    return `User-agent: *
Allow: /
Sitemap: https://${domain}/sitemap.xml
`;
  }
}

export const siteGeneratorService = new SiteGeneratorService();
