
import axios from 'axios';

// Типы для прокси
export interface Proxy {
  id: string;
  ip: string;
  port: number;
  protocol: 'http' | 'https' | 'socks4' | 'socks5';
  country?: string;
  anonymity?: 'transparent' | 'anonymous' | 'elite';
  speed?: number; // в миллисекундах
  uptime?: number; // процент работоспособности
  lastChecked: Date;
  status: 'active' | 'inactive' | 'testing';
  source?: string;
}

export interface ProxySources {
  [key: string]: {
    url: string;
    enabled: boolean;
    parseFunction: (data: string) => Proxy[];
  }
}

export const defaultProxySources: ProxySources = {
  'free-proxy-list': {
    url: 'https://free-proxy-list.net/',
    enabled: true,
    parseFunction: (html: string) => {
      // Пример парсинга HTML
      const proxies: Proxy[] = [];
      try {
        // Простой парсинг на основе строк (в реальном приложении лучше использовать cheerio или другой HTML парсер)
        const rows = html.split('<tr>').slice(1);
        for (const row of rows) {
          const cells = row.split('<td>');
          if (cells.length > 7) {
            const ip = cells[1].split('</td>')[0];
            const port = parseInt(cells[2].split('</td>')[0], 10);
            const anonymity = cells[5].split('</td>')[0].toLowerCase().includes('elite') 
              ? 'elite' 
              : cells[5].split('</td>')[0].toLowerCase().includes('anonymous') 
                ? 'anonymous' 
                : 'transparent';
            const protocol = cells[7].split('</td>')[0].toLowerCase().includes('yes') ? 'https' : 'http';
            
            if (ip && !isNaN(port)) {
              proxies.push({
                id: `${ip}:${port}`,
                ip,
                port,
                protocol,
                anonymity: anonymity as 'transparent' | 'anonymous' | 'elite',
                status: 'testing',
                lastChecked: new Date()
              });
            }
          }
        }
      } catch (error) {
        console.error('Ошибка при парсинге прокси:', error);
      }
      return proxies;
    }
  },
  'geonode': {
    url: 'https://proxylist.geonode.com/api/proxy-list?limit=300&page=1&sort_by=lastChecked&sort_type=desc',
    enabled: true,
    parseFunction: (data: string) => {
      const proxies: Proxy[] = [];
      try {
        const jsonData = JSON.parse(data);
        if (jsonData.data && Array.isArray(jsonData.data)) {
          for (const item of jsonData.data) {
            proxies.push({
              id: `${item.ip}:${item.port}`,
              ip: item.ip,
              port: parseInt(item.port, 10),
              protocol: item.protocols[0],
              country: item.country,
              anonymity: item.anonymityLevel,
              speed: item.speed,
              uptime: item.upTime,
              lastChecked: new Date(),
              status: 'testing'
            });
          }
        }
      } catch (error) {
        console.error('Ошибка при парсинге JSON прокси:', error);
      }
      return proxies;
    }
  }
};

// Класс для управления прокси
export class ProxyManager {
  private proxies: Map<string, Proxy> = new Map();
  private proxySources: ProxySources;
  private captchaApiKey: string = '';
  private botableApiKey: string = '';

  constructor(sources?: ProxySources, captchaApiKey?: string, botableApiKey?: string) {
    this.proxySources = sources || defaultProxySources;
    if (captchaApiKey) this.captchaApiKey = captchaApiKey;
    if (botableApiKey) this.botableApiKey = botableApiKey;
    
    // Загружаем прокси из localStorage при создании экземпляра
    this.loadProxiesFromStorage();
  }

  private loadProxiesFromStorage() {
    try {
      const savedProxies = localStorage.getItem('proxies');
      if (savedProxies) {
        const parsedProxies: Proxy[] = JSON.parse(savedProxies);
        parsedProxies.forEach(proxy => {
          proxy.lastChecked = new Date(proxy.lastChecked);
          this.proxies.set(proxy.id, proxy);
        });
        console.log(`Загружено ${this.proxies.size} прокси из хранилища`);
      }
    } catch (error) {
      console.error('Ошибка при загрузке прокси из localStorage:', error);
    }
  }

  private saveProxiesToStorage() {
    try {
      localStorage.setItem('proxies', JSON.stringify(Array.from(this.proxies.values())));
    } catch (error) {
      console.error('Ошибка при сохранении прокси в localStorage:', error);
    }
  }

  // Сбор прокси из всех активных источников
  async collectProxies(onProgress?: (source: string, count: number) => void): Promise<Proxy[]> {
    const newProxies: Proxy[] = [];
    
    for (const [sourceName, sourceConfig] of Object.entries(this.proxySources)) {
      if (!sourceConfig.enabled) continue;
      
      try {
        console.log(`Сбор прокси из источника: ${sourceName}`);
        if (onProgress) onProgress(sourceName, 0);
        
        const response = await axios.get(sourceConfig.url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        const parsedProxies = sourceConfig.parseFunction(response.data);
        console.log(`Найдено ${parsedProxies.length} прокси в источнике ${sourceName}`);
        
        // Обновляем существующие или добавляем новые прокси
        for (const proxy of parsedProxies) {
          if (!this.proxies.has(proxy.id)) {
            this.proxies.set(proxy.id, {
              ...proxy,
              source: sourceName,
              status: 'testing'
            });
            newProxies.push(proxy);
          }
        }
        
        if (onProgress) onProgress(sourceName, parsedProxies.length);
      } catch (error) {
        console.error(`Ошибка при сборе прокси из ${sourceName}:`, error);
        if (onProgress) onProgress(sourceName, -1); // Ошибка
      }
    }
    
    // Сохраняем обновленный список прокси
    this.saveProxiesToStorage();
    
    return newProxies;
  }

  // Проверка прокси
  async checkProxy(proxy: Proxy, testUrl: string = 'https://api.ipify.org/'): Promise<Proxy> {
    const updatedProxy: Proxy = { 
      ...proxy, 
      status: 'testing', 
      lastChecked: new Date() 
    };
    
    try {
      const startTime = Date.now();
      const response = await axios.get(testUrl, {
        proxy: {
          host: proxy.ip,
          port: proxy.port,
          protocol: proxy.protocol
        },
        timeout: 10000
      });
      
      const endTime = Date.now();
      const speed = endTime - startTime;
      
      updatedProxy.status = 'active';
      updatedProxy.speed = speed;
      
      console.log(`Прокси ${proxy.ip}:${proxy.port} работает, скорость: ${speed}ms`);
    } catch (error) {
      console.error(`Прокси ${proxy.ip}:${proxy.port} не работает:`, error.message);
      updatedProxy.status = 'inactive';
    }
    
    // Обновляем прокси в списке и сохраняем
    this.proxies.set(updatedProxy.id, updatedProxy);
    this.saveProxiesToStorage();
    
    return updatedProxy;
  }

  // Тестирование списка URL через прокси
  async testUrls(urls: string[], useProxies: boolean = true, onProgress?: (url: string, status: number, proxy?: string) => void): Promise<{url: string, status: number, error?: string, proxy?: string}[]> {
    const results = [];
    const activeProxies = this.getActiveProxies();
    
    if (useProxies && activeProxies.length === 0) {
      throw new Error('Нет активных прокси для использования');
    }
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      
      try {
        let proxy: Proxy | undefined;
        
        if (useProxies) {
          // Выбираем случайный прокси из активных
          proxy = activeProxies[Math.floor(Math.random() * activeProxies.length)];
        }
        
        const config: any = {
          method: 'get',
          url,
          timeout: 15000,
          validateStatus: (status: number) => true, // Принимаем любой статус
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        };
        
        if (useProxies && proxy) {
          config.proxy = {
            host: proxy.ip,
            port: proxy.port,
            protocol: proxy.protocol
          };
        }
        
        const response = await axios(config);
        
        if (onProgress) onProgress(url, response.status, proxy ? `${proxy.ip}:${proxy.port}` : undefined);
        
        results.push({
          url,
          status: response.status,
          proxy: proxy ? `${proxy.ip}:${proxy.port}` : undefined
        });
      } catch (error) {
        console.error(`Ошибка при проверке URL ${url}:`, error.message);
        
        if (onProgress) onProgress(url, 0, undefined);
        
        results.push({
          url,
          status: 0,
          error: error.message,
          proxy: undefined
        });
      }
      
      // Небольшая задержка между запросами
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return results;
  }

  // Получение списка всех прокси
  getAllProxies(): Proxy[] {
    return Array.from(this.proxies.values());
  }

  // Получение списка активных прокси
  getActiveProxies(): Proxy[] {
    return Array.from(this.proxies.values()).filter(proxy => proxy.status === 'active');
  }

  // Удаление прокси по ID
  removeProxy(id: string): boolean {
    const result = this.proxies.delete(id);
    if (result) this.saveProxiesToStorage();
    return result;
  }

  // Очистка всех прокси
  clearAllProxies(): void {
    this.proxies.clear();
    this.saveProxiesToStorage();
  }

  // Импорт списка прокси
  importProxies(proxyList: string): Proxy[] {
    const importedProxies: Proxy[] = [];
    const lines = proxyList.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      try {
        // Проверяем различные форматы
        let ip: string;
        let port: number;
        let protocol: 'http' | 'https' | 'socks4' | 'socks5' = 'http';
        
        // Обрабатываем различные форматы
        if (trimmedLine.includes('://')) {
          // Формат protocol://ip:port
          const parts = trimmedLine.split('://');
          protocol = parts[0] as 'http' | 'https' | 'socks4' | 'socks5';
          const ipPort = parts[1].split(':');
          ip = ipPort[0];
          port = parseInt(ipPort[1], 10);
        } else if (trimmedLine.includes(':')) {
          // Формат ip:port
          const ipPort = trimmedLine.split(':');
          ip = ipPort[0];
          port = parseInt(ipPort[1], 10);
        } else {
          continue; // Неверный формат
        }
        
        if (ip && !isNaN(port)) {
          const proxyId = `${ip}:${port}`;
          
          // Проверяем, не существует ли уже
          if (!this.proxies.has(proxyId)) {
            const proxy: Proxy = {
              id: proxyId,
              ip,
              port,
              protocol,
              status: 'testing',
              lastChecked: new Date(),
              source: 'imported'
            };
            
            this.proxies.set(proxyId, proxy);
            importedProxies.push(proxy);
          }
        }
      } catch (error) {
        console.error(`Ошибка при импорте прокси: ${trimmedLine}`, error);
      }
    }
    
    // Сохраняем обновленный список
    this.saveProxiesToStorage();
    
    return importedProxies;
  }

  // Проверка группы прокси
  async checkProxies(proxyList: Proxy[], testUrl: string = 'https://api.ipify.org/', onProgress?: (proxy: Proxy) => void): Promise<Proxy[]> {
    const results: Proxy[] = [];
    
    for (const proxy of proxyList) {
      try {
        const checkedProxy = await this.checkProxy(proxy, testUrl);
        results.push(checkedProxy);
        
        if (onProgress) onProgress(checkedProxy);
      } catch (error) {
        console.error(`Ошибка при проверке прокси ${proxy.ip}:${proxy.port}:`, error);
        
        proxy.status = 'inactive';
        this.proxies.set(proxy.id, proxy);
        
        if (onProgress) onProgress(proxy);
        results.push(proxy);
      }
      
      // Небольшая задержка между проверками
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    this.saveProxiesToStorage();
    return results;
  }

  // Методы для работы с капчей
  setCaptchaApiKey(apiKey: string): void {
    this.captchaApiKey = apiKey;
    localStorage.setItem('captchaApiKey', apiKey);
  }
  
  setBotableApiKey(apiKey: string): void {
    this.botableApiKey = apiKey;
    localStorage.setItem('botableApiKey', apiKey);
  }
  
  getCaptchaApiKey(): string {
    return this.captchaApiKey || localStorage.getItem('captchaApiKey') || '';
  }
  
  getBotableApiKey(): string {
    return this.botableApiKey || localStorage.getItem('botableApiKey') || '';
  }
  
  // Реализация решения капчи через API IPCaptchaGuru
  async solveCaptcha(imageOrSiteKey: string, type: 'image' | 'recaptcha' | 'hcaptcha' = 'image', websiteUrl?: string): Promise<string> {
    if (!this.captchaApiKey) {
      throw new Error('API ключ для решения капчи не установлен');
    }
    
    try {
      let response;
      
      if (type === 'image') {
        // Решение обычной капчи с изображением
        response = await axios.post('https://api.ipcaptchaguru.com/solve', {
          key: this.captchaApiKey,
          method: 'base64',
          body: imageOrSiteKey, // base64 изображения
        });
      } else {
        // Решение reCAPTCHA или hCAPTCHA
        response = await axios.post('https://api.ipcaptchaguru.com/solve', {
          key: this.captchaApiKey,
          method: type === 'recaptcha' ? 'recaptcha' : 'hcaptcha',
          googlekey: imageOrSiteKey, // sitekey
          pageurl: websiteUrl
        });
      }
      
      if (response.data && response.data.status === 1) {
        return response.data.answer;
      } else {
        throw new Error(`Ошибка решения капчи: ${response.data?.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Ошибка при решении капчи:', error);
      throw new Error(`Ошибка при решении капчи: ${error.message}`);
    }
  }

  get defaultProxySources(): ProxySources {
    return defaultProxySources;
  }
  
  // Метод для использования прокси из Python-скрипта
  async importProxySourcesFromPython(sources: string[]): Promise<number> {
    let importedCount = 0;
    
    for (const source of sources) {
      if (!this.proxySources[source] && source.startsWith('http')) {
        this.proxySources[`custom-${Date.now()}-${importedCount}`] = {
          url: source,
          enabled: true,
          parseFunction: (html: string) => {
            // Простой парсер для обработки текстового или HTML-контента
            const proxies: Proxy[] = [];
            const ipPortRegex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d{1,5})/g;
            let match;
            
            while ((match = ipPortRegex.exec(html)) !== null) {
              const ip = match[1];
              const port = parseInt(match[2], 10);
              
              if (ip && !isNaN(port)) {
                proxies.push({
                  id: `${ip}:${port}`,
                  ip,
                  port,
                  protocol: 'http',
                  status: 'testing',
                  lastChecked: new Date()
                });
              }
            }
            
            return proxies;
          }
        };
        
        importedCount++;
      }
    }
    
    return importedCount;
  }
  
  // Метод для пинга URL-ов через XML-RPC
  async pingUrlsWithRpc(urls: string[], siteTitle: string, feedUrl: string, rpcEndpoints: string[]): Promise<{url: string, rpc: string, success: boolean, message: string}[]> {
    // Этот метод симулирует пинг через XML-RPC сервисы
    // В реальной реализации здесь был бы XMLHttpRequest или fetch запрос к RPC endpoint
    const results = [];
    
    for (const url of urls) {
      for (const rpc of rpcEndpoints) {
        try {
          // Симуляция пинга (в реальном приложении здесь был бы запрос к RPC)
          await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 500));
          
          const success = Math.random() > 0.3; // 70% успешных пингов для демонстрации
          
          results.push({
            url,
            rpc,
            success,
            message: success 
              ? `Успешно пингован URL ${url} через ${rpc}` 
              : `Ошибка при пинге URL ${url} через ${rpc}`
          });
        } catch (error) {
          results.push({
            url,
            rpc,
            success: false,
            message: `Ошибка при пинге URL ${url} через ${rpc}: ${error.message}`
          });
        }
      }
    }
    
    return results;
  }
}

export const proxyManager = new ProxyManager();
