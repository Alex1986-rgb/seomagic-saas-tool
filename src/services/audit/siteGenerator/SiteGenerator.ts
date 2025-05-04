
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { PageContent } from '../crawler/WebCrawler';

export class SiteGenerator {
  /**
   * Generates a ZIP archive with an optimized copy of the website
   */
  async generateOptimizedSite(
    domain: string,
    pages: Map<string, PageContent>,
    optimizedHtml: Map<string, string>
  ): Promise<Blob> {
    try {
      console.log(`Generating optimized site for ${domain} with ${pages.size} pages`);
      
      const zip = new JSZip();
      const rootFolder = zip.folder(domain);
      
      if (!rootFolder) {
        throw new Error('Could not create root folder in ZIP archive');
      }
      
      // Track created folders to avoid duplicates
      const createdFolders = new Set<string>();
      
      // Add optimized pages to ZIP
      for (const [url, html] of optimizedHtml.entries()) {
        try {
          // Parse URL to get path
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
            path += 'index.html';
          } else if (!path.includes('.')) {
            path += '/index.html';
          } else if (!path.endsWith('.html') && !path.endsWith('.htm')) {
            // Non-HTML files
            const contentType = this.determineContentType(path);
            if (contentType !== 'text/html') {
              // Skip non-HTML files for now (would be added in a real implementation)
              continue;
            }
            
            path += '.html';
          }
          
          // Create parent directories if needed
          if (path.includes('/')) {
            const dirPath = path.substring(0, path.lastIndexOf('/'));
            
            if (!createdFolders.has(dirPath)) {
              rootFolder.folder(dirPath);
              createdFolders.add(dirPath);
            }
          }
          
          // Add file to ZIP
          rootFolder.file(path, html);
        } catch (error) {
          console.error(`Error adding ${url} to ZIP:`, error);
        }
      }
      
      // Add robots.txt
      const robotsTxt = this.generateRobotsTxt(domain);
      rootFolder.file('robots.txt', robotsTxt);
      
      // Add sitemap.xml
      const sitemap = this.generateSitemapXml(domain, Array.from(pages.keys()));
      rootFolder.file('sitemap.xml', sitemap);
      
      // Add README with instructions
      const readme = this.generateReadme(domain);
      rootFolder.file('README.txt', readme);
      
      // Generate ZIP file
      return await zip.generateAsync({ type: 'blob' });
    } catch (error) {
      console.error('Error generating optimized site:', error);
      throw error;
    }
  }
  
  /**
   * Downloads the ZIP archive
   */
  async downloadOptimizedSite(
    domain: string,
    pages: Map<string, PageContent>,
    optimizedHtml: Map<string, string>
  ): Promise<void> {
    try {
      const zip = await this.generateOptimizedSite(domain, pages, optimizedHtml);
      saveAs(zip, `${domain}-optimized.zip`);
    } catch (error) {
      console.error('Error downloading optimized site:', error);
      throw error;
    }
  }
  
  private generateSitemapXml(domain: string, urls: string[]): string {
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const url of urls) {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${url}</loc>\n`;
      sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      sitemap += '    <changefreq>monthly</changefreq>\n';
      sitemap += '    <priority>0.8</priority>\n';
      sitemap += '  </url>\n';
    }
    
    sitemap += '</urlset>';
    return sitemap;
  }
  
  private generateRobotsTxt(domain: string): string {
    return `User-agent: *
Allow: /

Sitemap: https://${domain}/sitemap.xml

# Optimized by SEO Audit Tool
# Generated on: ${new Date().toISOString()}
`;
  }
  
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
- Schema.org structured data for better search engine understanding
- Open Graph tags for social media sharing

## Need Help?

If you need assistance deploying these files or have questions about the optimizations,
please refer to the documentation.

Generated on: ${new Date().toISOString()}
`;
  }
  
  private determineContentType(path: string): string {
    const extension = path.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'html':
      case 'htm':
        return 'text/html';
      case 'css':
        return 'text/css';
      case 'js':
        return 'application/javascript';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'svg':
        return 'image/svg+xml';
      case 'pdf':
        return 'application/pdf';
      default:
        return 'application/octet-stream';
    }
  }
}
