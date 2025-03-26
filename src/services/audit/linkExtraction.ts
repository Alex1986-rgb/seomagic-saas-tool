
/**
 * Link extraction and processing functionality
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { parseSitemap } from 'sitemap-parser';

/**
 * Extracts links from a webpage
 */
export async function extractLinks(url: string): Promise<string[]> {
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
export async function parseSitemapUrls(sitemapUrl: string): Promise<string[]> {
  try {
    const urls = await parseSitemap(sitemapUrl);
    return urls.map(item => item.url);
  } catch (error) {
    console.error(`Error parsing sitemap ${sitemapUrl}:`, error);
    return [];
  }
}

// Cache for discovered URLs to avoid duplicates
export const urlCache = new Set<string>();
