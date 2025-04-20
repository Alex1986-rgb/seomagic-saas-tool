
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface PageContent {
  url: string;
  title: string;
  meta: {
    description: string | null;
    keywords: string | null;
  };
  content: string;
  images: {
    url: string;
    alt: string | null;
  }[];
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  wordCount: number;
  optimized?: {
    content: string;
    meta?: {
      description?: string;
      keywords?: string;
    };
    score?: number;
  };
}

// Functions for content optimization
export const optimizePageContent = (content: string): string => {
  // Simplified content optimization (would be more complex in a real implementation)
  return content;
};

export const improveSeoDescription = (description: string): string => {
  // Simplified description improvement
  return description;
};

export const generateSeoDescription = (title: string, content: string): string => {
  // Simplified description generation
  return `Description for ${title}`;
};

export const generateKeywords = (title: string, content: string): string => {
  // Simplified keywords generation
  return title.toLowerCase().split(' ').join(', ');
};

export const collectPagesContent = async (
  urls: string[], 
  maxPages: number = 100, 
  onProgress?: (current: number, total: number) => void
): Promise<PageContent[]> => {
  const result: PageContent[] = [];
  const pages = urls.slice(0, maxPages);
  
  for (let i = 0; i < pages.length; i++) {
    try {
      const url = pages[i];
      const response = await axios.get(url, { timeout: 10000 });
      const $ = cheerio.load(response.data);
      
      // Extract content
      const pageContent: PageContent = {
        url,
        title: $('title').text().trim() || '',
        meta: {
          description: $('meta[name="description"]').attr('content') || null,
          keywords: $('meta[name="keywords"]').attr('content') || null,
        },
        content: $('body').text().replace(/\s+/g, ' ').trim(),
        images: [],
        headings: {
          h1: [],
          h2: [],
          h3: []
        },
        wordCount: 0,
      };
      
      // Extract images
      $('img').each((_, element) => {
        const src = $(element).attr('src');
        if (src) {
          pageContent.images.push({
            url: src,
            alt: $(element).attr('alt') || null
          });
        }
      });
      
      // Extract headings
      $('h1').each((_, element) => { pageContent.headings.h1.push($(element).text().trim()); return true; });
      $('h2').each((_, element) => { pageContent.headings.h2.push($(element).text().trim()); return true; });
      $('h3').each((_, element) => { pageContent.headings.h3.push($(element).text().trim()); return true; });
      
      // Calculate word count
      pageContent.wordCount = pageContent.content.split(/\s+/).filter(Boolean).length;
      
      result.push(pageContent);
      
      if (onProgress) {
        onProgress(i + 1, pages.length);
      }
    } catch (error) {
      console.error(`Error processing URL ${pages[i]}:`, error);
    }
  }
  
  return result;
};
