
import type { Proxy, PingResult, ProxySources } from './types';
import { ProxyCollector } from './proxyCollector';
import { ProxyValidator } from './proxyValidator';
import { ProxyStorage } from './proxyStorage';
import { PingManager } from './pingManager';
import { CaptchaManager } from './captchaManager';
import { defaultProxySources } from './proxySourcesConfig';

/**
 * Класс для управления прокси
 */
export class ProxyManager {
  private proxyCollector: ProxyCollector;
  private proxyValidator: ProxyValidator;
  private proxyStorage: ProxyStorage;
  private captchaManager: CaptchaManager;
  private pingManager: PingManager;

  constructor(captchaApiKey?: string, botableApiKey?: string) {
    this.proxyStorage = new ProxyStorage();
    this.proxyCollector = new ProxyCollector();
    this.proxyValidator = new ProxyValidator();
    this.captchaManager = new CaptchaManager(captchaApiKey, botableApiKey);
    this.pingManager = new PingManager(this.proxyStorage);
  }

  // Сбор прокси из всех активных источников
  async collectProxies(
    onProgress?: (source: string, count: number) => void,
    clearBeforeCollect: boolean = false
  ): Promise<Proxy[]> {
    // Очищаем список перед сбором, если требуется
    if (clearBeforeCollect) {
      console.log('Очистка всех прокси перед новым сбором');
      this.proxyStorage.clearAllProxies();
    }

    try {
      // Запускаем сбор прокси
      const newProxies = await this.proxyCollector.collectProxies(onProgress);
      
      // Обновляем существующие или добавляем новые прокси
      for (const proxy of newProxies) {
        if (!this.proxyStorage.getProxy(proxy.id)) {
          this.proxyStorage.addProxy(proxy);
        }
      }

      // Явно логируем количество собранных прокси
      console.log(`Всего собрано ${newProxies.length} прокси из всех источников`);
      
      return newProxies;
    } catch (error) {
      console.error("Ошибка при сборе прокси:", error);
      throw error;
    }
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
    onProgress?: (url: string, status: number, proxy?: string, errorDetails?: string) => void
  ): Promise<{url: string, status: number, error?: string, errorDetails?: string, proxy?: string}[]> {
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

  // Методы для работы с капчей - делегируем CaptchaManager
  setCaptchaApiKey(apiKey: string): void {
    this.captchaManager.setCaptchaApiKey(apiKey);
  }
  
  setBotableApiKey(apiKey: string): void {
    this.captchaManager.setBotableApiKey(apiKey);
  }
  
  getCaptchaApiKey(): string {
    return this.captchaManager.getCaptchaApiKey();
  }
  
  getBotableApiKey(): string {
    return this.captchaManager.getBotableApiKey();
  }
  
  // Решение капчи через API - делегируем CaptchaManager
  async solveCaptcha(
    imageOrSiteKey: string, 
    type: 'image' | 'recaptcha' | 'hcaptcha' = 'image', 
    websiteUrl?: string
  ): Promise<string> {
    return this.captchaManager.solveCaptcha(imageOrSiteKey, type, websiteUrl);
  }

  get defaultProxySources() {
    return defaultProxySources;
  }
  
  // Метод для использования прокси из Python-скрипта
  async importProxySourcesFromPython(sources: string[]): Promise<number> {
    return this.proxyCollector.importProxySourcesFromPython(sources);
  }
  
  // Метод для пинга URL-ов через XML-RPC - делегируем PingManager
  async pingUrlsWithRpc(
    urls: string[], 
    siteTitle: string, 
    feedUrl: string, 
    rpcEndpoints: string[],
    batchSize: number = 10,
    concurrency: number = 5
  ): Promise<PingResult[]> {
    return this.pingManager.pingUrlsWithRpc(
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

// Correctly export types
export type { 
  Proxy, 
  ProxySources, 
  PingResult 
} from './types';
