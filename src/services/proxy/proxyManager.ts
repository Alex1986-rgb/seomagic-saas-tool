
import { ProxyStorage } from './proxyStorage';
import { ProxyValidator } from './proxyValidator';
import { ProxySources } from './proxySources';
import { PingManager } from './pingManager';
import type { Proxy, ProxySources as ProxySourcesType } from './types';
import { UrlTestResult } from './url-testing/urlTester';
import { ProxyCollector } from './proxyCollector';

export class ProxyManager {
  private proxyStorage: ProxyStorage;
  private proxyValidator: ProxyValidator;
  private proxySources: ProxySources;
  private pingManager: PingManager;
  private proxyCollector: ProxyCollector;
  
  public defaultProxySources: ProxySourcesType = {
    'freeproxylists': {
      url: 'https://www.freeproxylists.net/',
      enabled: true,
      parseFunction: this.parseFreeProxyLists
    },
    'sslproxies': {
      url: 'https://sslproxies.net/',
      enabled: true,
      parseFunction: this.parseSSLProxies
    },
    'free-proxy.cz': {
      url: 'http://free-proxy.cz/en/proxylist/country/all/http/ping/all',
      enabled: true, // Now enabled by default
      parseFunction: this.parseFreeProxyCZ
    },
    'proxylist.me': {
      url: 'https://proxylist.me/api/v1/getProxy?anon=2,3,4&country=any',
      enabled: true, // Now enabled by default
      parseFunction: this.parseProxylistMe
    },
    'proxyscan.io': {
      url: 'https://www.proxyscan.io/',
      enabled: true, // Now enabled by default
      parseFunction: this.parseProxyScanIO
    },
    // Add new sources that weren't in the original file
    'geonode-free-proxy': {
      url: 'https://proxylist.geonode.com/api/proxy-list?limit=500&page=1&sort_by=lastChecked&sort_type=desc',
      enabled: true,
      parseFunction: this.parseGeoNode
    },
    'proxy-list-download': {
      url: 'https://www.proxy-list.download/api/v1/get?type=http',
      enabled: true,
      parseFunction: this.parseProxyListDownload
    },
    'pubproxy': {
      url: 'http://pubproxy.com/api/proxy?limit=200&format=txt',
      enabled: true,
      parseFunction: this.parsePublicProxy
    }
  };
  
  constructor() {
    this.proxyStorage = new ProxyStorage();
    this.proxyValidator = new ProxyValidator();
    this.proxySources = new ProxySources(this.defaultProxySources, this.proxyStorage);
    this.pingManager = new PingManager(this.proxyStorage);
    this.proxyCollector = new ProxyCollector(this.defaultProxySources);
    
    // Load proxy sources from localStorage
    const storedSources = localStorage.getItem('proxySources');
    if (storedSources) {
      try {
        this.defaultProxySources = JSON.parse(storedSources);
        this.proxySources.proxySources = this.defaultProxySources;
      } catch (error) {
        console.error('Ошибка при загрузке источников прокси из localStorage:', error);
      }
    }
  }
  
  /**
   * Get all proxies
   */
  getProxies(): Proxy[] {
    return this.proxyStorage.getAll();
  }

  /**
   * Get all proxies
   */
  getAllProxies(): Proxy[] {
    return this.proxyStorage.getAll();
  }
  
  /**
   * Get active proxies
   */
  getActiveProxies(): Proxy[] {
    return this.proxyStorage.getAll().filter(proxy => proxy.status === 'active');
  }
  
  /**
   * Collect proxies from sources
   */
  async collectProxies(
    progressCallback?: (source: string, count: number) => void,
    clearExisting: boolean = true
  ): Promise<Proxy[]> {
    const proxies = await this.proxySources.collectProxies(progressCallback);
    console.log(`Collected ${proxies.length} proxies from primary sources`);
    return proxies;
  }
  
  /**
   * Collect additional proxies from secondary sources
   * This is a new method to collect more proxies from secondary sources
   */
  async collectAdditionalProxies(
    progressCallback?: (source: string, count: number) => void,
    clearExisting: boolean = false
  ): Promise<Proxy[]> {
    // Import additional sources from a predefined list
    const additionalSources = [
      'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
      'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt',
      'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt',
      'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-http.txt',
      'https://raw.githubusercontent.com/mertguvencli/http-proxy-list/main/proxy-list/data.txt',
      'https://www.proxy-list.download/api/v1/get?type=http&anon=elite',
      'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all',
      'https://openproxylist.xyz/http.txt',
      'https://proxyspace.pro/http.txt',
      'https://raw.githubusercontent.com/sunny9577/proxy-scraper/master/proxies.txt',
      'https://raw.githubusercontent.com/roosterkid/openproxylist/master/HTTPS_RAW.txt'
    ];
    
    // Import these sources
    this.proxyCollector.importProxySourcesFromPython(additionalSources);
    
    // Collect from these additional sources
    const additionalProxies = await this.proxyCollector.collectProxies(progressCallback, clearExisting);
    console.log(`Collected ${additionalProxies.length} additional proxies from secondary sources`);
    
    return additionalProxies;
  }
  
  /**
   * Check a list of proxies
   */
  async checkProxies(
    proxyList: Proxy[],
    testUrl: string = 'https://api.ipify.org/',
    onProgress?: (proxy: Proxy) => void
  ): Promise<Proxy[]> {
    return this.proxyValidator.checkProxies(proxyList, testUrl, onProgress);
  }
  
  /**
   * Remove a proxy
   */
  removeProxy(id: string): boolean {
    return this.proxyStorage.remove(id);
  }
  
  /**
   * Clear all proxies
   */
  clearAllProxies(): void {
    this.proxyStorage.clear();
  }
  
  /**
   * Import proxies from a text
   */
  importProxies(proxyText: string): Proxy[] {
    const importedProxies = this.proxySources.parseProxiesFromText(proxyText);
    importedProxies.forEach(proxy => {
      if (!this.proxyStorage.exists(proxy.ip, proxy.port)) {
        this.proxyStorage.add(proxy);
      }
    });
    return importedProxies;
  }
  
  /**
   * Get captcha API key
   */
  getCaptchaApiKey(): string {
    return localStorage.getItem('captchaApiKey') || '';
  }

  /**
   * Set Botable API key
   */
  setBotableApiKey(apiKey: string): void {
    localStorage.setItem('botableApiKey', apiKey);
  }
  
  /**
   * Set captcha API key
   */
  setCaptchaApiKey(apiKey: string): void {
    localStorage.setItem('captchaApiKey', apiKey);
  }

  /**
   * Get Botable API key
   */
  getBotableApiKey(): string {
    return localStorage.getItem('botableApiKey') || '';
  }
  
  /**
   * Ping URLs with XML-RPC
   */
  async pingUrlsWithRpc(
    urls: string[], 
    siteTitle: string, 
    feedUrl: string, 
    rpcEndpoints: string[],
    batchSize: number = 10,
    concurrency: number = 5,
    useProxies: boolean = true
  ): Promise<any> {
    return this.pingManager.pingUrlsWithRpc(
      urls, 
      siteTitle, 
      feedUrl, 
      rpcEndpoints,
      batchSize,
      concurrency,
      useProxies
    );
  }
  
  /**
   * Parse proxies from FreeProxyLists
   */
  parseFreeProxyLists(data: string): any[] {
    return this.proxySources.parseFreeProxyLists(data);
  }
  
  /**
   * Parse proxies from SSLProxies
   */
  parseSSLProxies(data: string): any[] {
    return this.proxySources.parseSSLProxies(data);
  }
  
  /**
   * Parse proxies from Free-Proxy.cz
   */
  parseFreeProxyCZ(data: string): any[] {
    return this.proxySources.parseFreeProxyCZ(data);
  }
  
  /**
   * Parse proxies from Proxylist.me
   */
  parseProxylistMe(data: string): any[] {
    return this.proxySources.parseProxylistMe(data);
  }
  
  /**
   * Parse proxies from Proxyscan.io
   */
  parseProxyScanIO(data: string): any[] {
    return this.proxySources.parseProxyScanIO(data);
  }

  /**
   * Parse proxies from GeoNode
   * New method to parse proxies from GeoNode
   */
  parseGeoNode(data: string): any[] {
    try {
      const proxies = [];
      let jsonData;
      
      try {
        jsonData = JSON.parse(data);
      } catch (e) {
        return [];
      }
      
      if (jsonData && jsonData.data && Array.isArray(jsonData.data)) {
        for (const item of jsonData.data) {
          if (item.ip && item.port) {
            proxies.push({
              id: `${item.ip}:${item.port}`,
              ip: item.ip,
              port: parseInt(item.port, 10),
              protocol: 'http',
              status: 'testing',
              lastChecked: new Date(),
              source: 'geonode'
            });
          }
        }
      }
      
      return proxies;
    } catch (e) {
      console.error('Error parsing GeoNode proxies:', e);
      return [];
    }
  }

  /**
   * Parse proxies from Proxy-list.download
   * New method to parse proxies from Proxy-list.download
   */
  parseProxyListDownload(data: string): any[] {
    try {
      const proxies = [];
      
      const lines = data.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        
        const [ip, port] = trimmed.split(':');
        
        if (ip && port) {
          proxies.push({
            id: `${ip}:${port}`,
            ip,
            port: parseInt(port, 10),
            protocol: 'http',
            status: 'testing',
            lastChecked: new Date(),
            source: 'proxy-list-download'
          });
        }
      }
      
      return proxies;
    } catch (e) {
      console.error('Error parsing Proxy-list.download proxies:', e);
      return [];
    }
  }

  /**
   * Parse proxies from PubProxy
   * New method to parse proxies from PubProxy
   */
  parsePublicProxy(data: string): any[] {
    try {
      const proxies = [];
      
      const lines = data.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        
        const [ip, port] = trimmed.split(':');
        
        if (ip && port) {
          proxies.push({
            id: `${ip}:${port}`,
            ip,
            port: parseInt(port, 10),
            protocol: 'http',
            status: 'testing',
            lastChecked: new Date(),
            source: 'pubproxy'
          });
        }
      }
      
      return proxies;
    } catch (e) {
      console.error('Error parsing PubProxy proxies:', e);
      return [];
    }
  }

  /**
   * Проверка списка URL с прокси
   */
  async testUrls(
    urls: string[], 
    useProxies: boolean = true, 
    onProgress?: (url: string, status: number, proxy?: string, errorDetails?: string) => void,
    forceDirect: boolean = false
  ): Promise<UrlTestResult[]> {
    const proxiesList = this.getProxies();
    const config = {
      forceDirect,
      failoverToDirect: true, // Always allow fallback to direct connections
      timeout: 20000, // Increased timeout for better chances
      retries: 2
    };
    
    return this.proxyValidator.testUrls(urls, proxiesList, useProxies && !forceDirect, onProgress, config);
  }
}

// Create a singleton instance and export it
export const proxyManager = new ProxyManager();
