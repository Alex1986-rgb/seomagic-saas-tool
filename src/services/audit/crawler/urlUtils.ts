
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
 * Normalizes a full URL by handling trailing slashes and query parameters consistently
 */
export function normalizeUrl(url: string): string {
  try {
    // Ensure the URL has a protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    
    const urlObj = new URL(url);
    
    // Remove trailing slash from pathname
    if (urlObj.pathname.endsWith('/') && urlObj.pathname.length > 1) {
      urlObj.pathname = urlObj.pathname.slice(0, -1);
    }
    
    return urlObj.toString();
  } catch (error) {
    // Return the original URL if it can't be parsed
    return url;
  }
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
 * Prioritizes a URL based on various factors
 * Higher score means higher priority
 */
export function getUrlPriority(url: string): number {
  try {
    const urlObj = new URL(url);
    let priority = 0;
    
    // URLs with fewer path segments have higher priority
    const pathSegments = urlObj.pathname.split('/').filter(Boolean).length;
    priority -= pathSegments;
    
    // URLs without query parameters have higher priority
    if (!urlObj.search) priority += 2;
    
    // Product and category pages have higher priority
    if (urlObj.pathname.includes('product') || urlObj.pathname.includes('item')) priority += 3;
    if (urlObj.pathname.includes('category') || urlObj.pathname.includes('catalog')) priority += 2;
    
    return priority;
  } catch (error) {
    return -999; // Very low priority for invalid URLs
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
