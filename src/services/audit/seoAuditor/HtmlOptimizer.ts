import * as cheerio from 'cheerio';
import { PageContent } from '../crawler/WebCrawler';

export class HtmlOptimizer {
  optimizePage(page: PageContent): string {
    try {
      const $ = cheerio.load(page.html);
      
      // Fix title if missing
      if (!page.title) {
        $('head').append(`<title>${this.generateTitle(page.url)}</title>`);
      } else if (page.title.length < 10 || page.title.length > 70) {
        const optimizedTitle = this.optimizeTitle(page.title, page.url);
        $('title').text(optimizedTitle);
      }
      
      // Fix meta description if missing
      if (!page.meta.description) {
        const description = this.generateDescription(page);
        $('head').append(`<meta name="description" content="${description}">`);
      } else if (page.meta.description.length < 50 || page.meta.description.length > 160) {
        const optimizedDescription = this.optimizeDescription(page.meta.description, page);
        $('meta[name="description"]').attr('content', optimizedDescription);
      }
      
      // Fix meta keywords if missing
      if (!page.meta.keywords) {
        const keywords = this.generateKeywords(page);
        $('head').append(`<meta name="keywords" content="${keywords}">`);
      }
      
      // Fix canonical if missing
      if (!page.meta.canonical) {
        $('head').append(`<link rel="canonical" href="${page.url}">`);
      }
      
      // Fix H1 if missing
      if (page.headings.h1.length === 0) {
        const h1Content = page.title || this.generateTitle(page.url);
        $('body').prepend(`<h1>${h1Content}</h1>`);
      } else if (page.headings.h1.length > 1) {
        // Keep only the first H1 and convert others to H2
        let first = true;
        $('h1').each((_, el) => {
          if (!first) {
            $(el).replaceWith(`<h2>${$(el).html()}</h2>`);
          }
          first = false;
        });
      }
      
      // Fix images without alt text
      $('img:not([alt])').each((_, el) => {
        const src = $(el).attr('src') || '';
        const alt = this.generateAltText(src);
        $(el).attr('alt', alt);
      });
      
      // Add Open Graph tags if missing
      if (!$('meta[property="og:title"]').length) {
        $('head').append(`<meta property="og:title" content="${$('title').text()}">`);
      }
      
      if (!$('meta[property="og:description"]').length) {
        $('head').append(`<meta property="og:description" content="${$('meta[name="description"]').attr('content')}">`);
      }
      
      if (!$('meta[property="og:url"]').length) {
        $('head').append(`<meta property="og:url" content="${page.url}">`);
      }
      
      if (!$('meta[property="og:type"]').length) {
        $('head').append(`<meta property="og:type" content="website">`);
      }
      
      // Add schema.org structured data for Article if it's a content page
      if (page.wordCount > 300 && !page.html.includes('schema.org')) {
        const title = $('title').text();
        const description = $('meta[name="description"]').attr('content') || '';
        
        const structuredData = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": title,
          "description": description,
          "url": page.url
        };
        
        $('head').append(`<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`);
      }
      
      return $.html();
    } catch (error) {
      console.error('Error optimizing page:', error);
      return page.html;
    }
  }
  
  private generateTitle(url: string): string {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      
      if (path === '/' || path === '') {
        return `${this.formatDomain(urlObj.hostname)} - Official Website`;
      }
      
      const segments = path.split('/').filter(Boolean);
      const lastSegment = segments[segments.length - 1];
      
      if (!lastSegment) return this.formatDomain(urlObj.hostname);
      
      const formatted = lastSegment
        .replace(/[-_]/g, ' ')
        .replace(/\.html?$/, '')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return `${formatted} - ${this.formatDomain(urlObj.hostname)}`;
    } catch (error) {
      return url;
    }
  }
  
  private optimizeTitle(title: string, url: string): string {
    if (title.length < 10) {
      return `${title} - ${this.extractDomainFromUrl(url)}`;
    }
    
    if (title.length > 70) {
      return title.substring(0, 67) + '...';
    }
    
    return title;
  }
  
  private generateDescription(page: PageContent): string {
    if (page.headings.h1.length > 0) {
      const mainHeading = page.headings.h1[0];
      
      if (page.headings.h2.length > 0) {
        return `${mainHeading}. Learn about ${page.headings.h2.slice(0, 3).join(', ')} and more.`;
      }
      
      return `${mainHeading}. Find information about ${this.extractDomainFromUrl(page.url)}.`;
    }
    
    // Extract some text from the content
    const firstParagraphs = this.extractTextContent(page.html);
    if (firstParagraphs && firstParagraphs.length > 50) {
      return firstParagraphs.substring(0, 157) + '...';
    }
    
    return `Learn more about ${this.extractDomainFromUrl(page.url)} and our products and services.`;
  }
  
  private optimizeDescription(description: string, page: PageContent): string {
    if (description.length < 50) {
      return description + ' ' + this.extractTextContent(page.html).substring(0, 150 - description.length);
    }
    
    if (description.length > 160) {
      return description.substring(0, 157) + '...';
    }
    
    return description;
  }
  
  private generateKeywords(page: PageContent): string {
    const keywords: string[] = [];
    
    // Use title words
    if (page.title) {
      const titleWords = page.title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(' ')
        .filter(word => word.length > 3);
      
      keywords.push(...titleWords);
    }
    
    // Use headings
    if (page.headings.h1.length > 0) {
      const h1Words = page.headings.h1[0]
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(' ')
        .filter(word => word.length > 3);
      
      keywords.push(...h1Words);
    }
    
    // Use domain name
    keywords.push(this.extractDomainFromUrl(page.url).replace(/\..+$/, ''));
    
    // Remove duplicates and join
    return [...new Set(keywords)].slice(0, 10).join(', ');
  }
  
  private generateAltText(src: string): string {
    try {
      const filename = src.split('/').pop() || src;
      return filename
        .replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')
        .replace(/[-_]/g, ' ')
        .replace(/\d+/g, '')
        .trim() || 'Image';
    } catch (error) {
      return 'Image';
    }
  }
  
  private extractDomainFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (error) {
      return url;
    }
  }
  
  private formatDomain(domain: string): string {
    return domain
      .replace(/^www\./, '')
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
      .replace(/\.\w+$/, '');
  }
  
  private extractTextContent(html: string): string {
    try {
      const $ = cheerio.load(html);
      
      // Get text from paragraphs
      const paragraphs = $('p').map((_, el) => $(el).text().trim()).get();
      
      if (paragraphs.length > 0) {
        return paragraphs.join(' ').substring(0, 300);
      }
      
      // If no paragraphs, get text from body
      return $('body').text().trim().substring(0, 300);
    } catch (error) {
      return '';
    }
  }
}
