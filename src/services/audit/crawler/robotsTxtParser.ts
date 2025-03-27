
/**
 * Robots.txt parser for respecting crawl rules
 */

import axios from 'axios';

export class RobotsTxtParser {
  private excludePatterns: RegExp[] = [];
  private robotsTxtRules: Map<string, boolean> = new Map();
  private hasReadRobotsTxt: boolean = false;
  
  constructor(
    private baseUrl: string,
    private userAgent: string,
    initialExcludePatterns: RegExp[] = []
  ) {
    this.excludePatterns = [...initialExcludePatterns];
  }
  
  async readRobotsTxt(): Promise<RegExp[]> {
    if (this.hasReadRobotsTxt) return this.excludePatterns;
    
    try {
      const robotsUrl = new URL('/robots.txt', this.baseUrl).toString();
      console.log(`Reading robots.txt from ${robotsUrl}`);
      
      const response = await axios.get(robotsUrl, { timeout: 5000 });
      const lines = response.data.split('\n');
      
      let currentUserAgent: string | null = null;
      let isRelevantForUs = false;
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Skip comments and empty lines
        if (!trimmedLine || trimmedLine.startsWith('#')) continue;
        
        // Check for User-agent
        if (trimmedLine.toLowerCase().startsWith('user-agent:')) {
          const agent = trimmedLine.substring(11).trim();
          currentUserAgent = agent;
          
          // Check if this section applies to us
          isRelevantForUs = agent === '*' || this.userAgent.includes(agent);
        }
        
        // Process disallow rules if relevant for our user agent
        if (isRelevantForUs && trimmedLine.toLowerCase().startsWith('disallow:')) {
          const path = trimmedLine.substring(9).trim();
          if (path) {
            // Convert simple pattern to regex and store
            const escapedPath = path
              .replace(/\//g, '\\/')
              .replace(/\./g, '\\.')
              .replace(/\*/g, '.*');
            
            const pathPattern = new RegExp(`^${escapedPath}`);
            this.excludePatterns.push(pathPattern);
            this.robotsTxtRules.set(path, true);
          }
        }
      }
      
      this.hasReadRobotsTxt = true;
      console.log(`Processed robots.txt, added ${this.robotsTxtRules.size} exclusion rules`);
      
    } catch (error) {
      console.warn('Could not read robots.txt:', error);
      this.hasReadRobotsTxt = true; // Mark as read anyway to avoid retries
    }
    
    return this.excludePatterns;
  }
  
  getExcludePatterns(): RegExp[] {
    return this.excludePatterns;
  }
  
  getRuleCount(): number {
    return this.robotsTxtRules.size;
  }
}
