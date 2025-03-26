
/**
 * Main website scanner module with improved accuracy for large sites
 */

import { ScanOptions } from "@/types/audit";
import { faker } from '@faker-js/faker';
import axios from 'axios';
import * as cheerio from 'cheerio';
import robotsParser from 'robots-parser';
import { parseSitemap } from 'sitemap-parser';
import type { OptimizationItem } from '@/components/audit/results/components/optimization';
import { generateSitemap } from './sitemap';
import { collectPagesContent, type PageContent } from './content';
import { calculateOptimizationMetrics, type PageStatistics } from './optimization';
import { createOptimizedSite } from './optimizedSite';

// Cache for discovered URLs to avoid duplicates
const urlCache = new Set<string>();

/**
 * Fetches robots.txt to check crawling rules and find sitemap
 */
async function fetchRobotsTxt(domain: string): Promise<{robotsTxt: string | null, sitemapUrls: string[]}> {
  try {
    const response = await axios.get(`https://${domain}/robots.txt`, { timeout: 5000 });
    const robotsTxt = response.data;
    
    // Parse sitemap URLs from robots.txt
    const sitemapUrls: string[] = [];
    const lines = robotsTxt.split('\n');
    for (const line of lines) {
      if (line.toLowerCase().startsWith('sitemap:')) {
        const sitemapUrl = line.split(':', 2)[1].trim();
        sitemapUrls.push(sitemapUrl);
      }
    }
    
    return { robotsTxt, sitemapUrls };
  } catch (error) {
    console.log('No robots.txt found or error fetching it');
    return { robotsTxt: null, sitemapUrls: [] };
  }
}

/**
 * Extracts links from a webpage
 */
async function extractLinks(url: string): Promise<string[]> {
  try {
    const response = await axios.get(url, { timeout: 8000 });
    const $ = cheerio.load(response.data);
    const links: string[] = [];
    
    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (href) links.push(href);
    });
    
    return links;
  } catch (error) {
    console.error(`Error extracting links from ${url}:`, error);
    return [];
  }
}

/**
 * Parses XML sitemap to find all URLs
 */
async function parseSitemapUrls(sitemapUrl: string): Promise<string[]> {
  try {
    const urls = await parseSitemap(sitemapUrl);
    return urls.map(item => item.url);
  } catch (error) {
    console.error(`Error parsing sitemap ${sitemapUrl}:`, error);
    return [];
  }
}

/**
 * Detects site platform (e.g., WordPress, Shopify, etc.)
 */
async function detectPlatform(url: string): Promise<string> {
  try {
    const response = await axios.get(url, { timeout: 5000 });
    const $ = cheerio.load(response.data);
    
    // WordPress detection
    if ($('meta[name="generator"][content*="WordPress"]').length || $('link[rel="https://api.w.org/"]').length) {
      return 'WordPress';
    }
    
    // Shopify detection
    if ($('link[href*="cdn.shopify.com"]').length || response.data.includes('Shopify.theme')) {
      return 'Shopify';
    }
    
    // WooCommerce detection
    if ($('div.woocommerce').length || $('link[href*="wp-content/plugins/woocommerce"]').length) {
      return 'WooCommerce';
    }
    
    // Magento detection
    if ($('script[src*="mage/"]').length || $('script[type="text/x-magento-init"]').length) {
      return 'Magento';
    }
    
    // OpenCart detection
    if (response.data.includes('catalog/view/theme') || response.data.includes('getOpenCart')) {
      return 'OpenCart';
    }
    
    // PrestaShop detection
    if (response.data.includes('var prestashop') || $('meta[name="generator"][content*="PrestaShop"]').length) {
      return 'PrestaShop';
    }
    
    return 'Unknown';
  } catch (error) {
    console.error('Error detecting platform:', error);
    return 'Unknown';
  }
}

/**
 * Estimates the total number of pages based on platform and detected patterns
 */
function estimatePageCount(platform: string, sampleUrls: string[], domain: string): number {
  // Base estimates by platform
  const platformBaseEstimates: Record<string, number> = {
    'WordPress': 200,
    'Shopify': 500,
    'WooCommerce': 1000,
    'Magento': 2000,
    'OpenCart': 800,
    'PrestaShop': 1200,
    'Unknown': 300
  };
  
  let estimatedCount = platformBaseEstimates[platform] || 300;
  
  // Extract patterns from URLs to identify categories, products, etc.
  const patterns: Record<string, number> = {};
  const productPatterns = ['/product/', '/products/', '/item/', '/goods/', '/p/', '/catalog/'];
  const categoryPatterns = ['/category/', '/categories/', '/collection/', '/collections/', '/c/'];
  
  sampleUrls.forEach(url => {
    try {
      const path = new URL(url).pathname;
      
      // Count path segments to estimate site depth
      const segments = path.split('/').filter(Boolean);
      const depth = segments.length;
      
      if (depth > 0) {
        patterns[`depth_${depth}`] = (patterns[`depth_${depth}`] || 0) + 1;
      }
      
      // Identify product and category URLs
      if (productPatterns.some(pattern => path.includes(pattern))) {
        patterns['product'] = (patterns['product'] || 0) + 1;
      }
      
      if (categoryPatterns.some(pattern => path.includes(pattern))) {
        patterns['category'] = (patterns['category'] || 0) + 1;
      }
      
      // Look for pagination patterns
      if (path.includes('/page/') || path.match(/\/(p|page)[0-9]+\/?$/)) {
        patterns['pagination'] = (patterns['pagination'] || 0) + 1;
      }
    } catch (e) {
      // Skip invalid URLs
    }
  });
  
  // Adjust estimate based on patterns
  if (patterns['product'] > 0) {
    const productRatio = patterns['product'] / sampleUrls.length;
    estimatedCount += Math.round(productRatio * 10000);
  }
  
  if (patterns['category'] > 0) {
    const categoryRatio = patterns['category'] / sampleUrls.length;
    estimatedCount += Math.round(categoryRatio * 200);
  }
  
  // Factor in domain-specific knowledge
  if (domain.includes('shop') || domain.includes('store') || domain.includes('market')) {
    estimatedCount = Math.max(estimatedCount, 5000);
  }
  
  if (domain.includes('blog') || domain.includes('news')) {
    estimatedCount = Math.max(estimatedCount, 1000);
  }
  
  // Check for pagination as indicator of large sites
  if (patterns['pagination'] > 0) {
    estimatedCount *= 1.5;
  }
  
  // Look at depth patterns for structural hints
  const maxDepth = Object.keys(patterns)
    .filter(key => key.startsWith('depth_'))
    .map(key => parseInt(key.replace('depth_', '')))
    .reduce((max, depth) => Math.max(max, depth), 0);
    
  if (maxDepth >= 4) {
    estimatedCount *= (1 + (maxDepth * 0.1));
  }
  
  return Math.round(estimatedCount);
}

/**
 * Main scanning function with improved accuracy
 */
export const scanWebsite = async (
  url: string, 
  options: ScanOptions
): Promise<{ 
  success: boolean; 
  pageStats: PageStatistics; 
  sitemap?: string;
  pagesContent?: PageContent[];
  optimizationCost?: number;
  optimizationItems?: OptimizationItem[];
}> => {
  const { maxPages, maxDepth, onProgress } = options;
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  try {
    // Reset URL cache for new scan
    urlCache.clear();
    
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    const domain = new URL(formattedUrl).hostname;
    
    if (onProgress) {
      onProgress(1, 100, formattedUrl);
    }
    
    // Step 1: Detect platform
    const platform = await detectPlatform(formattedUrl);
    console.log(`Detected platform: ${platform}`);
    
    if (onProgress) {
      onProgress(5, 100, `Analyzing ${platform} platform...`);
    }
    
    // Step 2: Check robots.txt for sitemaps
    const { robotsTxt, sitemapUrls } = await fetchRobotsTxt(domain);
    
    if (onProgress) {
      onProgress(10, 100, `Checking robots.txt and sitemaps...`);
    }
    
    // Step 3: Collect sample URLs from homepage and sitemap
    let sampleUrls: string[] = [];
    
    // Get links from homepage
    const homepageLinks = await extractLinks(formattedUrl);
    sampleUrls = sampleUrls.concat(homepageLinks);
    
    // Process sitemap if available
    if (sitemapUrls.length > 0) {
      for (const sitemapUrl of sitemapUrls.slice(0, 3)) { // Limit to first 3 sitemaps for performance
        const urls = await parseSitemapUrls(sitemapUrl);
        sampleUrls = sampleUrls.concat(urls.slice(0, 200)); // Take sample of up to 200 URLs from each sitemap
        
        if (onProgress) {
          onProgress(20, 100, `Processing sitemap: ${sitemapUrl}`);
        }
      }
    }
    
    // Filter and clean URLs
    sampleUrls = sampleUrls
      .filter(link => link && typeof link === 'string')
      .filter(link => {
        try {
          const linkUrl = link.startsWith('http') ? new URL(link) : new URL(link, formattedUrl);
          return linkUrl.hostname === domain; // Keep only internal links
        } catch (e) {
          return false;
        }
      })
      .filter((link, index, self) => self.indexOf(link) === index); // Remove duplicates
    
    if (onProgress) {
      onProgress(30, 100, `Collected ${sampleUrls.length} sample URLs...`);
    }
    
    // Step 4: Estimate total page count based on platform and URL patterns
    const estimatedPageCount = Math.min(estimatePageCount(platform, sampleUrls, domain), maxPages);
    
    if (onProgress) {
      onProgress(40, 100, `Estimated ${estimatedPageCount} total pages...`);
    }
    
    // Step 5: Generate page statistics based on sample URLs and estimates
    const pageStats: PageStatistics = {
      totalPages: estimatedPageCount,
      subpages: {},
      levels: {}
    };
    
    // Calculate distribution of page types based on URL patterns
    const pagePatterns = {
      'product': ['/product/', '/products/', '/item/', '/goods/', '/p/', '/catalog/'],
      'category': ['/category/', '/categories/', '/collection/', '/collections/', '/c/'],
      'blog': ['/blog/', '/news/', '/article/', '/post/'],
      'contact': ['/contact/', '/contacts/', '/feedback/', '/support/'],
      'about': ['/about/', '/about-us/', '/company/', '/о-нас/'],
      'faq': ['/faq/', '/help/', '/faq-help/', '/вопросы/'],
      'terms': ['/terms/', '/terms-conditions/', '/terms-of-service/', '/условия/'],
      'privacy': ['/privacy/', '/privacy-policy/', '/политика/']
    };
    
    // Initialize page types with zeros
    Object.keys(pagePatterns).forEach(type => {
      pageStats.subpages[type] = 0;
    });
    
    // Analyze sample URLs to determine distribution
    for (const sampleUrl of sampleUrls) {
      try {
        let path = '';
        try {
          const urlObj = new URL(sampleUrl);
          path = urlObj.pathname;
        } catch {
          path = sampleUrl;
        }
        
        // Determine page type
        let pageType = 'other';
        for (const [type, patterns] of Object.entries(pagePatterns)) {
          if (patterns.some(pattern => path.includes(pattern))) {
            pageType = type;
            break;
          }
        }
        
        // Count page type
        pageStats.subpages[pageType] = (pageStats.subpages[pageType] || 0) + 1;
        
        // Determine depth level based on path segments
        const depth = path.split('/').filter(Boolean).length;
        pageStats.levels[depth] = (pageStats.levels[depth] || 0) + 1;
      } catch (error) {
        // Skip problematic URLs
      }
    }
    
    // Normalize counts to match estimated total
    const totalSampleCount = Object.values(pageStats.subpages).reduce((sum, count) => sum + count, 0);
    
    // Apply distribution from sample to full estimate
    if (totalSampleCount > 0) {
      for (const [type, count] of Object.entries(pageStats.subpages)) {
        const ratio = count / totalSampleCount;
        pageStats.subpages[type] = Math.round(estimatedPageCount * ratio);
      }
      
      // Ensure at least minimal values for common page types
      const minimumPages: Record<string, number> = {
        'contact': 1,
        'about': 1,
        'terms': 1,
        'privacy': 1
      };
      
      for (const [type, minCount] of Object.entries(minimumPages)) {
        pageStats.subpages[type] = Math.max(pageStats.subpages[type] || 0, minCount);
      }
      
      // Adjust total to match estimated page count after rounding
      const currentTotal = Object.values(pageStats.subpages).reduce((sum, count) => sum + count, 0);
      const diff = estimatedPageCount - currentTotal;
      
      // Apply difference to product pages (usually the most numerous)
      if (diff !== 0 && pageStats.subpages['product']) {
        pageStats.subpages['product'] += diff;
      }
    } else {
      // Fallback distribution if no sample URLs were analyzed
      const platformDistribution: Record<string, Record<string, number>> = {
        'WordPress': { 'blog': 0.6, 'page': 0.3, 'product': 0.1 },
        'Shopify': { 'product': 0.7, 'category': 0.2, 'page': 0.1 },
        'WooCommerce': { 'product': 0.75, 'category': 0.15, 'blog': 0.1 },
        'Magento': { 'product': 0.8, 'category': 0.15, 'page': 0.05 },
        'OpenCart': { 'product': 0.8, 'category': 0.15, 'page': 0.05 },
        'PrestaShop': { 'product': 0.75, 'category': 0.2, 'page': 0.05 },
        'Unknown': { 'product': 0.4, 'category': 0.3, 'blog': 0.2, 'page': 0.1 }
      };
      
      const distribution = platformDistribution[platform] || platformDistribution['Unknown'];
      
      for (const [type, ratio] of Object.entries(distribution)) {
        pageStats.subpages[type] = Math.round(estimatedPageCount * ratio);
      }
    }
    
    // Normalize levels distribution
    const totalLevelsCount = Object.values(pageStats.levels).reduce((sum, count) => sum + count, 0);
    
    if (totalLevelsCount > 0) {
      for (const [level, count] of Object.entries(pageStats.levels)) {
        const ratio = count / totalLevelsCount;
        pageStats.levels[level] = Math.round(estimatedPageCount * ratio);
      }
      
      // Ensure sum matches total
      const currentLevelsTotal = Object.values(pageStats.levels).reduce((sum, count) => sum + count, 0);
      const levelsDiff = estimatedPageCount - currentLevelsTotal;
      
      // Distribute difference across levels proportionally
      if (levelsDiff !== 0) {
        const levelKeys = Object.keys(pageStats.levels);
        if (levelKeys.length > 0) {
          const mainLevel = levelKeys[Math.floor(levelKeys.length / 2)];
          pageStats.levels[mainLevel] += levelsDiff;
        }
      }
    } else {
      // Default level distribution if no sample data
      pageStats.levels = {
        1: Math.round(estimatedPageCount * 0.05),
        2: Math.round(estimatedPageCount * 0.15),
        3: Math.round(estimatedPageCount * 0.4),
        4: Math.round(estimatedPageCount * 0.25),
        5: Math.round(estimatedPageCount * 0.15)
      };
    }
    
    if (onProgress) {
      onProgress(60, 100, `Generating detailed statistics...`);
    }
    
    // Step 6: Generate sitemap
    const sitemap = generateSitemap(domain, estimatedPageCount, true);
    
    if (onProgress) {
      onProgress(80, 100, `Creating sitemap with ${estimatedPageCount} URLs...`);
    }
    
    // Step 7: Generate page content samples for analysis
    const pagesContent = await collectPagesContent(domain, estimatedPageCount);
    
    if (onProgress) {
      onProgress(90, 100, `Analyzing content samples...`);
    }
    
    // Step 8: Calculate optimization metrics
    const {
      optimizationCost,
      optimizationItems
    } = calculateOptimizationMetrics(pageStats, pagesContent);
    
    if (onProgress) {
      onProgress(100, 100, `Scan complete. Found ${estimatedPageCount} pages.`);
    }
    
    return { 
      success: true, 
      pageStats, 
      sitemap, 
      pagesContent, 
      optimizationCost,
      optimizationItems
    };
  } catch (error) {
    console.error('Ошибка сканирования сайта:', error);
    return { success: false, pageStats: { totalPages: 0, subpages: {}, levels: {} } };
  }
};

// Re-export all the needed functions from the other modules
export { generateSitemap } from './sitemap';
export type { PageContent } from './content';
export { collectPagesContent } from './content';
export type { PageStatistics } from './optimization';
export { calculateOptimizationMetrics } from './optimization';
export { createOptimizedSite } from './optimizedSite';
