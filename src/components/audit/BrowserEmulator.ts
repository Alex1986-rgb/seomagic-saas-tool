
/**
 * Emulates browser functionality for position tracking
 */
export class BrowserEmulator {
  private userAgents: string[] = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  ];
  
  private searchEngineUrls: Record<string, string> = {
    'google': 'https://www.google.com/search?q={query}&gl={region}',
    'yandex': 'https://yandex.ru/search/?text={query}&lr={region}',
    'mailru': 'https://go.mail.ru/search?q={query}&frm=main&country={region}'
  };
  
  /**
   * Returns a random user agent
   */
  getRandomUserAgent(): string {
    const randomIndex = Math.floor(Math.random() * this.userAgents.length);
    return this.userAgents[randomIndex];
  }
  
  /**
   * Builds a search URL for the specified search engine
   */
  getSearchUrl(searchEngine: string, query: string, region?: string): string {
    let url = this.searchEngineUrls[searchEngine] || this.searchEngineUrls.google;
    
    // Normalize search engine name
    searchEngine = searchEngine.toLowerCase();
    
    // Encode query
    const encodedQuery = encodeURIComponent(query);
    
    // Handle region
    let regionCode = '';
    if (region) {
      regionCode = this.getRegionCode(searchEngine, region) || '';
    } else {
      // Default regions
      if (searchEngine === 'yandex') regionCode = '213'; // Moscow
      else if (searchEngine === 'google') regionCode = 'ru';
      else regionCode = 'ru';
    }
    
    // Build URL
    url = url.replace('{query}', encodedQuery).replace('{region}', regionCode);
    
    return url;
  }
  
  /**
   * Simulates scrolling behavior
   */
  simulateScrolling(): { scrollCount: number; totalScrollHeight: number } {
    // Simulate a random number of scrolls
    const scrollCount = 5 + Math.floor(Math.random() * 10);
    const scrollHeight = 800; // Average scroll height per action
    const totalHeight = scrollCount * scrollHeight;
    
    return {
      scrollCount,
      totalScrollHeight: totalHeight
    };
  }
  
  /**
   * Simulates a random delay between actions
   */
  async randomDelay(): Promise<void> {
    // Random delay between 500ms and 3000ms
    const delay = 500 + Math.floor(Math.random() * 2500);
    return new Promise(resolve => setTimeout(resolve, delay));
  }
  
  /**
   * Gets the region code for the specified search engine
   */
  private getRegionCode(searchEngine: string, region: string): string | undefined {
    // Check if region is a direct code
    if (/^\d+$/.test(region) && searchEngine === 'yandex') {
      return region; // Return as is for Yandex numeric codes
    }
    
    // Lowercase the region for comparison
    const lowerRegion = region.toLowerCase();
    
    // Check if region exists in mappings
    if (lowerRegion in regionMappings) {
      return regionMappings[lowerRegion][searchEngine];
    }
    
    // Default region codes
    const defaults = {
      'google': 'ru',
      'yandex': '213', // Moscow
      'mailru': 'ru'
    };
    
    return defaults[searchEngine];
  }
}

// Define region mappings
const regionMappings: Record<string, Record<string, string>> = {
  'ru': {
    'google': 'ru',
    'yandex': '213', // Moscow
    'mailru': 'ru'
  },
  'msk': {
    'google': 'ru',
    'yandex': '213', // Moscow
    'mailru': 'ru'
  },
  'spb': {
    'google': 'ru',
    'yandex': '2', // Saint Petersburg
    'mailru': 'ru'
  },
  'us': {
    'google': 'us',
    'yandex': '84', // USA
    'mailru': 'us'
  },
  'uk': {
    'google': 'uk',
    'yandex': '10371', // UK
    'mailru': 'gb'
  },
  'de': {
    'google': 'de',
    'yandex': '96', // Germany
    'mailru': 'de'
  }
};
