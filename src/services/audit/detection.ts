
/**
 * Platform detection functionality
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Detects site platform (e.g., WordPress, Shopify, etc.)
 */
export async function detectPlatform(url: string): Promise<string> {
  try {
    const response = await axios.get(url, { timeout: 8000 });
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
    
    // 1C-Bitrix detection (common in Russian e-commerce)
    if (response.data.includes('bitrix/js') || response.data.includes('BX.') || $('script[src*="/bitrix/"]').length) {
      return 'Bitrix';
    }
    
    // MODX detection
    if (response.data.includes('MODX') || response.data.includes('modx')) {
      return 'MODX';
    }
    
    // Custom Russian platforms detection
    if (
      response.data.includes('myarredo') || 
      response.data.includes('arredo') || 
      url.includes('myarredo') || 
      url.includes('arredo')
    ) {
      return 'CustomFurniture';
    }
    
    return 'Unknown';
  } catch (error) {
    console.error('Error detecting platform:', error);
    return 'Unknown';
  }
}

/**
 * Fetches robots.txt to check crawling rules and find sitemap
 */
export async function fetchRobotsTxt(domain: string): Promise<{robotsTxt: string | null, sitemapUrls: string[]}> {
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
