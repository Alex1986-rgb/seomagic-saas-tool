import { ProxyStorage } from './proxyStorage';
import { ProxyValidator } from './proxyValidator';
import { ProxySources } from './proxySources';
import { PingManager } from './pingManager';
import type { Proxy, ProxySources as ProxySourcesType } from './types';
import { UrlTestResult } from './url-testing/urlTester';

export class ProxyManager {
  private proxyStorage: ProxyStorage;
  private proxyValidator: ProxyValidator;
  private proxySources: ProxySources;
  private pingManager: PingManager;
  
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
      enabled: false,
      parseFunction: this.parseFreeProxyCZ
    },
    'proxylist.me': {
      url: 'https://proxylist.me/api/v1/getProxy?anon=2,3,4&country=any',
      enabled: false,
      parseFunction: this.parseProxylistMe
    },
    'proxyscan.io': {
      url: 'https://www.proxyscan.io/',
      enabled: false,
      parseFunction: this.parseProxyScanIO
    }
  };
  
  constructor() {
    this.proxyStorage = new ProxyStorage();
    this.proxyValidator = new ProxyValidator();
    this.proxySources = new ProxySources(this.defaultProxySources, this.proxyStorage);
    this.pingManager = new PingManager(this.proxyStorage);
    
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
    progressCallback?: (source: string, count: number) => void
  ): Promise<Proxy[]> {
    return this.proxySources.collectProxies(progressCallback);
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
