
/**
 * Types and utilities for site analysis functionality
 */

export interface BrokenLink {
  url: string;
  sourceUrl: string;
  statusCode: number;
  anchor: string;
}

export interface Redirect {
  sourceUrl: string;
  destinationUrl: string;
  statusCode: number;
}

export interface DuplicatePage {
  url: string;
  duplicateUrls: string[];
  similarity: number;
  contentHash: string;
}

export interface DuplicateMetaTag {
  type: 'title' | 'description' | 'keywords';
  content: string;
  urls: string[];
}

export interface SiteStructureNode {
  url: string;
  title: string;
  level: number;
  children: SiteStructureNode[];
}

export interface SiteStructure {
  nodes: SiteStructureNode[];
  depth: number;
  rootUrl: string;
}

export interface ContentAnalysisResult {
  overallUniqueness: number;
  uniquePages: number;
  duplicateGroups: {
    urls: string[];
    similarity: number;
  }[];
  pageUniqueness: {
    url: string;
    uniqueness: number;
  }[];
}

/**
 * Detect broken links on a website
 */
export const detectBrokenLinks = async (
  domain: string,
  urls: string[],
  onProgress?: (current: number, total: number) => void
): Promise<{ brokenLinks: BrokenLink[]; redirects: Redirect[] }> => {
  // Simulate analysis with mock data
  const brokenLinks: BrokenLink[] = [];
  const redirects: Redirect[] = [];
  
  // Process each URL with progress reporting
  for (let i = 0; i < urls.length; i++) {
    // Report progress
    if (onProgress) {
      onProgress(i, urls.length);
    }
    
    // For demo purposes, let's add some mock broken links and redirects
    if (i % 10 === 0) {
      brokenLinks.push({
        url: `${domain}/broken-page-${i}`,
        sourceUrl: urls[i],
        statusCode: 404,
        anchor: `Link ${i}`
      });
    }
    
    if (i % 15 === 0) {
      redirects.push({
        sourceUrl: `${domain}/old-page-${i}`,
        destinationUrl: `${domain}/new-page-${i}`,
        statusCode: 301
      });
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  // Final progress update
  if (onProgress) {
    onProgress(urls.length, urls.length);
  }
  
  return { brokenLinks, redirects };
};

/**
 * Detect duplicate pages on a website
 */
export const detectDuplicates = async (
  urls: string[],
  onProgress?: (current: number, total: number) => void
): Promise<{ duplicatePages: DuplicatePage[]; duplicateMeta: DuplicateMetaTag[] }> => {
  // Simulate analysis with mock data
  const duplicatePages: DuplicatePage[] = [];
  const duplicateMeta: DuplicateMetaTag[] = [];
  
  // Process URLs
  for (let i = 0; i < urls.length; i++) {
    // Report progress
    if (onProgress) {
      onProgress(i, urls.length);
    }
    
    // For demo purposes, add some mock duplicates
    if (i % 20 === 0 && i > 0) {
      duplicatePages.push({
        url: urls[i],
        duplicateUrls: [urls[i - 1]],
        similarity: 0.95,
        contentHash: `hash-${i}`
      });
    }
    
    // Add some duplicate meta tags
    if (i % 25 === 0 && i > 0) {
      duplicateMeta.push({
        type: 'title',
        content: `Duplicate Title ${i}`,
        urls: [urls[i], urls[i - 1]]
      });
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  // Final progress update
  if (onProgress) {
    onProgress(urls.length, urls.length);
  }
  
  return { duplicatePages, duplicateMeta };
};

/**
 * Analyze site structure
 */
export const analyzeSiteStructure = async (
  domain: string,
  urls: string[],
  onProgress?: (current: number, total: number) => void
): Promise<SiteStructure> => {
  // Create structure with mock data
  const rootNode: SiteStructureNode = {
    url: domain,
    title: 'Home',
    level: 0,
    children: []
  };
  
  const nodes: SiteStructureNode[] = [rootNode];
  let maxDepth = 0;
  
  // Process URLs
  for (let i = 0; i < urls.length; i++) {
    // Report progress
    if (onProgress) {
      onProgress(i, urls.length);
    }
    
    const url = urls[i];
    const path = url.replace(domain, '').split('/').filter(Boolean);
    const level = path.length;
    
    if (level > maxDepth) {
      maxDepth = level;
    }
    
    // Create a node for this URL
    const node: SiteStructureNode = {
      url,
      title: path[path.length - 1] || 'Page ' + i,
      level,
      children: []
    };
    
    nodes.push(node);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 5));
  }
  
  // Final progress update
  if (onProgress) {
    onProgress(urls.length, urls.length);
  }
  
  return {
    nodes,
    depth: maxDepth,
    rootUrl: domain
  };
};

/**
 * Analyze content uniqueness
 */
export const analyzeContentUniqueness = async (
  urls: string[],
  onProgress?: (current: number, total: number) => void
): Promise<ContentAnalysisResult> => {
  // Simulate uniqueness analysis
  const uniquePages = Math.round(urls.length * 0.8); // 80% unique
  const overallUniqueness = 85 + Math.random() * 10; // 85-95% uniqueness
  
  const duplicateGroups: { urls: string[]; similarity: number }[] = [];
  const pageUniqueness: { url: string; uniqueness: number }[] = [];
  
  // Process URLs
  for (let i = 0; i < urls.length; i++) {
    // Report progress
    if (onProgress) {
      onProgress(i, urls.length);
    }
    
    const url = urls[i];
    
    // Add uniqueness score for each page
    const uniqueness = 70 + Math.random() * 30; // 70-100% uniqueness
    pageUniqueness.push({
      url,
      uniqueness
    });
    
    // Create some duplicate groups
    if (i % 25 === 0 && i > 0 && i < urls.length - 3) {
      duplicateGroups.push({
        urls: [url, urls[i + 1], urls[i + 2]],
        similarity: 85 + Math.random() * 10
      });
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  // Final progress update
  if (onProgress) {
    onProgress(urls.length, urls.length);
  }
  
  return {
    overallUniqueness,
    uniquePages,
    duplicateGroups,
    pageUniqueness
  };
};
