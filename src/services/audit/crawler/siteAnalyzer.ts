
/**
 * Site structure analyzer
 */

import { SiteStructureAnalysis } from './types';

export class SiteAnalyzer {
  static analyzeSiteStructure(visited: Set<string>, domain: string): SiteStructureAnalysis {
    const sections: { [key: string]: number } = {};
    const orphanedPages: string[] = [];
    let maxDepth = 0;
    
    // Analyze pages by section
    for (const url of visited) {
      try {
        const urlObj = new URL(url);
        const path = urlObj.pathname;
        
        // Skip non-domain URLs
        if (urlObj.hostname !== domain) continue;
        
        // Calculate depth
        const pathSegments = path.split('/').filter(Boolean);
        maxDepth = Math.max(maxDepth, pathSegments.length);
        
        // Categorize by section
        if (pathSegments.length > 0) {
          const section = pathSegments[0] || 'root';
          sections[section] = (sections[section] || 0) + 1;
        } else {
          sections['root'] = (sections['root'] || 0) + 1;
        }
      } catch (e) {
        // Skip invalid URLs
      }
    }
    
    return {
      pages: visited.size,
      depth: maxDepth,
      breadth: Object.keys(sections).length,
      sections,
      orphanedPages
    };
  }
}
