
/**
 * Link extraction and processing functionality
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

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
    // Directly fetch the sitemap and parse it manually since sitemap-parser has issues
    const response = await axios.get(sitemapUrl, { timeout: 10000 });
    const $ = cheerio.load(response.data, { xmlMode: true });
    
    const urls: string[] = [];
    $('url > loc').each((_, element) => {
      const url = $(element).text();
      if (url) urls.push(url);
    });
    
    return urls;
  } catch (error) {
    console.error(`Error parsing sitemap ${sitemapUrl}:`, error);
    return [];
  }
}

// Cache for discovered URLs to avoid duplicates
export const urlCache = new Set<string>();
