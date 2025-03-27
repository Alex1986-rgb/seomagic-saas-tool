
/**
 * Site structure analyzer for evaluating website architecture
 */

import { SiteStructureAnalysis } from './types';

export class SiteAnalyzer {
  // Enhanced site structure analysis
  static analyzeSiteStructure(visited: Set<string>, domain: string): SiteStructureAnalysis {
    const levels: Record<number, number> = {};
    const pathCounts: Record<string, number> = {};
    
    for (const url of visited) {
      try {
        const urlObj = new URL(url);
        
        // Skip external URLs
        if (urlObj.hostname !== domain) continue;
        
        // Calculate level (depth) based on path segments
        const pathSegments = urlObj.pathname.split('/').filter(s => s);
        const level = pathSegments.length;
        
        levels[level] = (levels[level] || 0) + 1;
        
        // Count URLs by first directory
        if (pathSegments.length > 0) {
          const firstDir = pathSegments[0];
          pathCounts[firstDir] = (pathCounts[firstDir] || 0) + 1;
        } else {
          // Root pages
          pathCounts['root'] = (pathCounts['root'] || 0) + 1;
        }
      } catch (e) {
        // Skip invalid URLs
      }
    }
    
    return {
      levels,
      pathCounts
    };
  }
}
