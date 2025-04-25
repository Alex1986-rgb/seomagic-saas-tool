import { Proxy, PingResult, ProxySources } from './types';
import { ProxyCollector } from './proxyCollector';
import { ProxyValidator } from './proxyValidator';
import { ProxyStorage } from './proxyStorage';
import { CaptchaService } from './captchaService';
import { PingService } from './pingService';
import { defaultProxySources } from './proxySourcesConfig';

// Класс для управления прокси
export class ProxyManager {
  private proxyCollector: ProxyCollector;
  private proxyValidator: ProxyValidator;
  private proxyStorage: ProxyStorage;
  private captchaService: CaptchaService;
  private pingService: PingService;

  constructor(captchaApiKey?: string, botableApiKey?: string) {
    this.proxyStorage = new ProxyStorage();
    this.proxyCollector = new ProxyCollector();
    this.proxyValidator = new ProxyValidator();
    this.captchaService = new CaptchaService(captchaApiKey, botableApiKey);
    this.pingService = new PingService(this.proxyStorage);
  }

  // Сбор прокси из всех активных источников
  async collectProxies(onProgress?: (source: string, count: number) => void): Promise<Proxy[]> {
    const newProxies = await this.proxyCollector.collectProxies(onProgress);
    
    // Обновляем существующие или добавляем новые прокси
    for (const proxy of newProxies) {
      if (!this.proxyStorage.getProxy(proxy.id)) {
        this.proxyStorage.addProxy(proxy);
      }
    }
    
    return newProxies;
  }

  // Проверка прокси
  async checkProxy(proxy: Proxy, testUrl: string = 'https://api.ipify.org/'): Promise<Proxy> {
    const updatedProxy = await this.proxyValidator.checkProxy(proxy, testUrl);
    this.proxyStorage.updateProxy(updatedProxy);
    return updatedProxy;
  }

  // Тестирование списка URL через прокси
  async testUrls(
    urls: string[], 
    useProxies: boolean = true, 
    onProgress?: (url: string, status: number, proxy?: string) => void
  ): Promise<{url: string, status: number, error?: string, proxy?: string}[]> {
    const activeProxies = this.proxyStorage.getActiveProxies();
    if (useProxies && activeProxies.length === 0) {
      throw new Error('Нет активных прокси для использования');
    }
    
    return this.proxyValidator.testUrls(urls, activeProxies, useProxies, onProgress);
  }

  // Получение списка всех прокси
  getAllProxies(): Proxy[] {
    return this.proxyStorage.getAllProxies();
  }

  // Получение списка активных прокси
  getActiveProxies(): Proxy[] {
    return this.proxyStorage.getActiveProxies();
  }

  // Удаление прокси по ID
  removeProxy(id: string): boolean {
    return this.proxyStorage.removeProxy(id);
  }

  // Очистка всех прокси
  clearAllProxies(): void {
    this.proxyStorage.clearAllProxies();
  }

  // Импорт списка прокси
  importProxies(proxyList: string): Proxy[] {
    return this.proxyStorage.importProxies(proxyList);
  }

  // Проверка группы прокси
  async checkProxies(
    proxyList: Proxy[], 
    testUrl: string = 'https://api.ipify.org/', 
    onProgress?: (proxy: Proxy) => void
  ): Promise<Proxy[]> {
    const results = await this.proxyValidator.checkProxies(proxyList, testUrl, onProgress);
    this.proxyStorage.addProxies(results);
    return results;
  }

  // Методы для работы с капчей
  setCaptchaApiKey(apiKey: string): void {
    this.captchaService.setCaptchaApiKey(apiKey);
  }
  
  setBotableApiKey(apiKey: string): void {
    this.captchaService.setBotableApiKey(apiKey);
  }
  
  getCaptchaApiKey(): string {
    return this.captchaService.getCaptchaApiKey();
  }
  
  getBotableApiKey(): string {
    return this.captchaService.getBotableApiKey();
  }
  
  // Реализация решения капчи через API
  async solveCaptcha(
    imageOrSiteKey: string, 
    type: 'image' | 'recaptcha' | 'hcaptcha' = 'image', 
    websiteUrl?: string
  ): Promise<string> {
    return this.captchaService.solveCaptcha(imageOrSiteKey, type, websiteUrl);
  }

  get defaultProxySources() {
    return defaultProxySources;
  }
  
  // Метод для использования прокси из Python-скрипта
  async importProxySourcesFromPython(sources: string[]): Promise<number> {
    return this.proxyCollector.importProxySourcesFromPython(sources);
  }
  
  // Метод для пинга URL-ов через XML-RPC
  async pingUrlsWithRpc(
    urls: string[], 
    siteTitle: string, 
    feedUrl: string, 
    rpcEndpoints: string[],
    batchSize: number = 10,
    concurrency: number = 5
  ): Promise<PingResult[]> {
    return this.pingService.pingUrlsWithRpc(
      urls, 
      siteTitle, 
      feedUrl, 
      rpcEndpoints,
      batchSize,
      concurrency
    );
  }
}

// Создаем экземпляр для использования в приложении
export const proxyManager = new ProxyManager();

// Export the types for use in other files
export { Proxy, ProxySources, PingResult } from './types';
