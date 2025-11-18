
/**
 * URL utilities for crawler operations
 */

/**
 * Normalizes a URL path by removing trailing slashes
 */
export function normalizePath(path: string): string {
  // Ensure path starts with a slash
  path = path.startsWith('/') ? path : `/${path}`;
  
  // Remove trailing slashes
  path = path.endsWith('/') ? path.slice(0, -1) : path;
  
  return path;
}

/**
 * Normalizes a full URL by handling trailing slashes, fragments, and query parameters
 */
export function normalizeUrl(url: string): string {
  try {
    // Ensure the URL has a protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    
    const urlObj = new URL(url);
    
    // Remove www. for consistency
    urlObj.hostname = urlObj.hostname.replace(/^www\./, '');
    
    // Remove trailing slash from pathname
    if (urlObj.pathname.endsWith('/') && urlObj.pathname.length > 1) {
      urlObj.pathname = urlObj.pathname.slice(0, -1);
    }
    
    // Remove fragment
    urlObj.hash = '';
    
    // Sort query parameters for consistency
    const params = Array.from(urlObj.searchParams.entries())
      .sort(([a], [b]) => a.localeCompare(b));
    urlObj.search = '';
    params.forEach(([key, value]) => urlObj.searchParams.append(key, value));
    
    return urlObj.toString();
  } catch (error) {
    // Return the original URL if it can't be parsed
    return url;
  }
}

/**
 * Blocked query parameters that should be filtered out
 */
const BLOCKED_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 
  'fbclid', 'gclid', 'replytocom', 'share', '_ga', '_gid'];

/**
 * Filters out blocked query parameters from URL
 */
export function filterQueryParams(url: string): string {
  try {
    const urlObj = new URL(url);
    BLOCKED_PARAMS.forEach(param => {
      urlObj.searchParams.delete(param);
    });
    return urlObj.toString();
  } catch (error) {
    return url;
  }
}

/**
 * Detects page type based on URL path
 */
export function detectPageType(url: string): string {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname.toLowerCase();
    
    // Home page
    if (path === '/' || path === '') return 'home';
    
    // Category/collection pages
    if (path.includes('/category') || path.includes('/collection') || 
        path.includes('/catalog') || path.includes('/products')) {
      return 'category';
    }
    
    // Product pages
    if (path.includes('/product') || path.includes('/item') || 
        path.includes('/shop/')) {
      return 'product';
    }
    
    // Blog/article pages
    if (path.includes('/blog') || path.includes('/article') || 
        path.includes('/post') || path.includes('/news')) {
      return 'article';
    }
    
    return 'other';
  } catch (error) {
    return 'other';
  }
}

/**
 * Calculates priority for URL based on depth, page type, and characteristics
 */
export function calculateUrlPriority(url: string, depth: number, isFromSitemap: boolean = false): number {
  let priority = 100;
  
  // Depth penalty (each level reduces priority)
  priority -= depth * 10;
  
  // Sitemap bonus
  if (isFromSitemap) priority += 20;
  
  // Page type bonus
  const pageType = detectPageType(url);
  if (pageType === 'home') priority += 50;
  if (pageType === 'category') priority += 15;
  if (pageType === 'product') priority += 5;
  if (pageType === 'article') priority += 5;
  
  // URL without query params gets bonus
  try {
    const urlObj = new URL(url);
    if (!urlObj.search) priority += 2;
  } catch (error) {
    // Invalid URL gets low priority
    priority -= 50;
  }
  
  return Math.max(0, priority); // Ensure non-negative
}

/**
 * Checks if a URL belongs to the same domain as the base domain
 */
export function isUrlFromSameDomain(url: string, baseDomain: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === baseDomain || 
           urlObj.hostname === `www.${baseDomain}` || 
           `www.${urlObj.hostname}` === baseDomain;
  } catch (error) {
    return false;
  }
}

/**
 * Checks if a URL is external based on the base domain
 */
export function isExternalUrl(url: string, baseDomain: string): boolean {
  return !isUrlFromSameDomain(url, baseDomain);
}

/**
 * Extracts the domain from a URL
 */
export function getDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch (error) {
    return '';
  }
}

/**
 * Gets the path part of a URL without query parameters
 */
export function getPathFromUrl(url: string): string {
  try {
    return new URL(url).pathname;
  } catch (error) {
    return '';
  }
}

/**
 * Checks if a URL is a valid HTTP/HTTPS URL
 */
export function isValidHttpUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

/**
 * Calculates dynamic estimated_pages based on sitemap size
 */
export function calculateEstimatedPages(sitemapUrlsCount: number, maxPages: number = 100): number {
  if (sitemapUrlsCount === 0) return maxPages;
  
  if (sitemapUrlsCount < 200) {
    // Small sites: scan 100%
    return Math.min(sitemapUrlsCount, maxPages);
  } else if (sitemapUrlsCount < 1000) {
    // Medium sites: scan 30%
    return Math.min(Math.ceil(sitemapUrlsCount * 0.3), 300);
  } else {
    // Large sites: cap at 300
    return 300;
  }
}

/**
 * Create a safe URL object with error handling
 */
export function createUrlObject(url: string): URL | null {
  try {
    // Ensure URL has a protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    return new URL(url);
  } catch (error) {
    return null;
  }
}
