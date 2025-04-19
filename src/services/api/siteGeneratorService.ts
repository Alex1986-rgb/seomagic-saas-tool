
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { PageData } from './crawlerService';

export interface OptimizedPage {
  optimizedHtml: string;
  optimizedTitle?: string;
  optimizedDescription?: string;
  optimizedHeadings?: Record<string, string[]>;
  originalHtml?: string;
}

class SiteGeneratorService {
  /**
   * Generate an optimized copy of a website
   */
  async generateOptimizedSite(
    domain: string,
    pages: Map<string, PageData>,
    optimizedPages: Map<string, OptimizedPage>
  ): Promise<Blob> {
    const zip = new JSZip();
    
    // Create folders for the site structure
    const rootFolder = zip.folder(domain) as JSZip;
    
    // Keep track of created folders to avoid duplicates
    const createdFolders = new Set<string>();
    
    // Add a manifest file with optimization details
    const manifest = {
      domain,
      optimizedAt: new Date().toISOString(),
      pagesCount: pages.size,
      optimizedCount: optimizedPages.size,
      version: '1.0.0'
    };
    rootFolder.file('seo-manifest.json', JSON.stringify(manifest, null, 2));
    
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
        
        // If this is a CSS or JS file referenced by HTML pages, include it
        this.processAssetFiles(url, pageData, rootFolder, createdFolders);
      } catch (error) {
        console.error(`Error processing ${url}:`, error);
      }
    }
    
    // Generate sitemap.xml
    const sitemap = this.generateSitemap(domain, pages, optimizedPages);
    rootFolder.file('sitemap.xml', sitemap);
    
    // Generate robots.txt
    const robots = this.generateRobotsTxt(domain);
    rootFolder.file('robots.txt', robots);
    
    // Add a readme file with instructions
    const readme = this.generateReadme(domain);
    rootFolder.file('README.txt', readme);
    
    // Generate the zip file
    return zip.generateAsync({ type: 'blob' });
  }
  
  /**
   * Process and include asset files like CSS and JS
   */
  private processAssetFiles(
    url: string,
    pageData: PageData,
    rootFolder: JSZip,
    createdFolders: Set<string>
  ): void {
    // This would be expanded to download and include referenced asset files
    // For now, we're just creating placeholders for demonstration
    
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      
      // If this is a CSS or JS file already, skip
      if (path.endsWith('.css') || path.endsWith('.js')) return;
      
      // For HTML pages, we would extract and process assets
      // This is a simplified version - a real implementation would
      // parse the HTML, find asset references, and include those files
      
      // Example: if the page has a custom CSS or JS mentioned in the header
      if (pageData.html?.includes('<link rel="stylesheet"') || 
          pageData.html?.includes('<script src=')) {
        
        // In a real implementation, we would download these assets
        // and include them in the zip
        console.log(`Page ${url} has external assets that should be included`);
      }
    } catch (error) {
      console.error(`Error processing assets for ${url}:`, error);
    }
  }
  
  /**
   * Download the optimized site as a ZIP file
   */
  async downloadOptimizedSite(
    domain: string,
    pages: Map<string, PageData>,
    optimizedPages: Map<string, OptimizedPage>
  ): Promise<void> {
    const blob = await this.generateOptimizedSite(domain, pages, optimizedPages);
    saveAs(blob, `${domain}-optimized.zip`);
  }
  
  /**
   * Generate a sitemap for the site
   */
  private generateSitemap(
    domain: string, 
    pages: Map<string, PageData>,
    optimizedPages: Map<string, OptimizedPage>
  ): string {
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const [url, pageData] of pages.entries()) {
      // Skip non-HTML pages and pages that shouldn't be indexed
      if (pageData.contentType && !pageData.contentType.includes('html')) continue;
      if (pageData.noIndex) continue;
      
      const lastmod = new Date().toISOString();
      const optimized = optimizedPages.get(url);
      
      // Determine priority based on page depth and optimization
      let priority = "0.8";
      if (url.endsWith(domain) || url.endsWith(domain + '/')) {
        priority = "1.0"; // Homepage gets highest priority
      } else if (url.split('/').length <= 4) {
        priority = "0.9"; // Top-level pages
      } else if (url.split('/').length <= 6) {
        priority = "0.7"; // Deeper pages
      } else {
        priority = "0.5"; // Very deep pages
      }
      
      // Optimized pages get a slight boost
      if (optimized) {
        priority = Math.min(1.0, parseFloat(priority) + 0.1).toFixed(1);
      }
      
      // Determine change frequency based on content type
      let changefreq = "monthly";
      if (url.includes("blog") || url.includes("news")) {
        changefreq = "weekly";
      } else if (url.includes("product")) {
        changefreq = "daily";
      }
      
      sitemap += '  <url>\n';
      sitemap += `    <loc>${url}</loc>\n`;
      sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
      sitemap += `    <changefreq>${changefreq}</changefreq>\n`;
      sitemap += `    <priority>${priority}</priority>\n`;
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

# Optimized by SEO Audit Tool
# Generated on: ${new Date().toISOString()}
`;
  }
  
  /**
   * Generate a README file with instructions
   */
  private generateReadme(domain: string): string {
    return `# SEO Optimized Website for ${domain}

This package contains an SEO-optimized version of your website.

## Installation Instructions

1. Upload all files to your web hosting server, maintaining the folder structure.
2. Ensure the sitemap.xml and robots.txt files are in the root directory.
3. After deployment, submit your sitemap to Google Search Console at:
   https://search.google.com/search-console

## What's Been Optimized

- Meta titles and descriptions for better click-through rates
- Heading structure for improved content hierarchy
- Image alt tags for accessibility and SEO
- Internal linking structure
- Page speed optimizations
- Mobile responsiveness

## Need Help?

If you need assistance deploying these files or have questions about the optimizations,
please contact our support team.

Generated on: ${new Date().toISOString()}
`;
  }
}

export const siteGeneratorService = new SiteGeneratorService();
