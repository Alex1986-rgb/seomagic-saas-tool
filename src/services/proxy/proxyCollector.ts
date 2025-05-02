
import axios from 'axios';
import { Proxy, ProxySources } from './types';
import { defaultProxySources } from './proxySourcesConfig';
import { setupAxiosInstance } from './utils/axiosConfig';

export class ProxyCollector {
  private proxySources: ProxySources;
  private collectedProxies: Map<string, Proxy> = new Map(); // Track all collected proxies
  
  constructor(sources?: ProxySources) {
    this.proxySources = sources || defaultProxySources;
  }
  
  async collectProxies(
    onProgress?: (source: string, count: number) => void,
    clearExisting: boolean = false
  ): Promise<Proxy[]> {
    // Reset the collection if clearExisting is true
    if (clearExisting) {
      this.collectedProxies = new Map();
    }

    const enabledSources = Object.entries(this.proxySources).filter(([_, config]) => config.enabled);
    
    if (enabledSources.length === 0) {
      console.log('Нет активных источников прокси для сбора');
      return [];
    }
    
    console.log(`Начинаем сбор прокси из ${enabledSources.length} источников`);
    
    // Improved concurrency with max parallelism of 10 (increased from 5)
    const sourcePromises = [];
    const sourceChunks = this.chunkArray(enabledSources, 10); // Увеличено до 10 параллельных источников

    for (const chunk of sourceChunks) {
      const chunkPromises = chunk.map(([sourceName, sourceConfig]) => 
        this.processSource(sourceName, sourceConfig, onProgress)
      );
      
      // Wait for current chunk to complete before moving to the next
      const results = await Promise.all(chunkPromises);
      sourcePromises.push(...results);
      
      // Brief pause between chunks to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500)); // Уменьшено с 1000 до 500
    }
    
    // Convert the Map to an array for return
    const allProxies = Array.from(this.collectedProxies.values());
    console.log(`Всего собрано ${allProxies.length} уникальных прокси из всех источников`);
    return allProxies;
  }

  private async processSource(
    sourceName: string, 
    sourceConfig: any, 
    onProgress?: (source: string, count: number) => void
  ): Promise<Proxy[]> {
    try {
      console.log(`Сбор прокси из источника: ${sourceName}, URL: ${sourceConfig.url}`);
      if (onProgress) onProgress(sourceName, 0);
      
      // Улучшенное получение данных с разными User-Agent и retry логикой
      let responseData: any = null;
      let retries = 0;
      const maxRetries = 3;
      
      while (retries < maxRetries && !responseData) {
        try {
          const response = await axios.get(sourceConfig.url, {
            timeout: 40000, // Increased timeout for slower sources (40 seconds)
            headers: {
              'User-Agent': this.getRandomUserAgent(),
              'Accept': 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Accept-Encoding': 'gzip, deflate, br',
              'Connection': 'keep-alive',
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            },
            validateStatus: status => (status >= 200 && status < 300) || status === 403 || status === 404,
            maxRedirects: 5
          });
          
          if (response.status >= 200 && response.status < 300) {
            responseData = response.data;
          } else {
            console.log(`Попытка ${retries + 1}: Источник ${sourceName} вернул статус ${response.status}`);
            retries++;
            
            // Exponential backoff for retries
            await new Promise(resolve => setTimeout(resolve, 1000 * (retries * retries)));
          }
        } catch (retryError) {
          console.error(`Попытка ${retries + 1}: Ошибка при обращении к ${sourceName}:`, retryError.message);
          retries++;
          
          if (retries < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (retries * retries)));
          }
        }
      }
      
      let parsedProxies: Proxy[] = [];
      
      if (responseData) {
        console.log(`Получены данные от ${sourceName}, размер: ${
          typeof responseData === 'string' ? responseData.length : 'объект'
        }`);
        
        try {
          parsedProxies = sourceConfig.parseFunction(responseData);
          console.log(`Найдено ${parsedProxies.length} прокси в источнике ${sourceName}`);
        } catch (parseError) {
          console.error(`Ошибка при парсинге прокси из ${sourceName}:`, parseError);
          parsedProxies = this.fallbackParse(responseData, sourceName);
          console.log(`Fallback парсер нашел ${parsedProxies.length} прокси`);
        }
      }
      
      // Проверка и фильтрация прокси перед добавлением
      const validProxies = parsedProxies.filter(proxy => this.isValidIpPort(proxy.ip, proxy.port));
      console.log(`${sourceName}: ${validProxies.length} из ${parsedProxies.length} прокси валидны`);
      
      // Add proxies to our collection map (automatically dedupes by ID)
      let newProxiesCount = 0;
      for (const proxy of validProxies) {
        if (!this.collectedProxies.has(proxy.id)) {
          this.collectedProxies.set(proxy.id, proxy);
          newProxiesCount++;
        }
      }
      
      console.log(`Добавлено ${newProxiesCount} новых прокси из источника ${sourceName}`);
      if (onProgress) onProgress(sourceName, this.collectedProxies.size);
      
      return validProxies;
    } catch (error) {
      console.error(`Ошибка при сборе прокси из ${sourceName}:`, error);
      if (onProgress) onProgress(sourceName, -1);
      return [];
    }
  }

  // Utility method to chunk arrays for parallel processing
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  // Generate random user agents to avoid blocking
  private getRandomUserAgent(): string {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:122.0) Gecko/20100101 Firefox/122.0',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.2277.106',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
      // Добавим больше разнообразных User-Agent
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/106.0.0.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
  }

  // Улучшенный и более агрессивный fallback parser для извлечения прокси
  private fallbackParse(data: any, sourceName: string): Proxy[] {
    const proxies: Proxy[] = [];
    try {
      // Convert data to string if it's not already
      const content = typeof data === 'string' ? data : JSON.stringify(data);
      
      // Улучшенные регулярные выражения для поиска различных форматов прокси
      const ipPortPatterns = [
        // Основной паттерн для IP:PORT с более точным распознаванием
        /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})[^\d\w]?[:|\s]+(\d{2,5})/g,
        // Паттерн для поиска в HTML-таблицах
        /<td[^>]*>(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})<\/td>.*?<td[^>]*>(\d{2,5})<\/td>/gs,
        // Паттерн с протоколом в формате protocol://ip:port
        /(?:http|https|socks4|socks5):\/\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d{2,5})/g,
        // Паттерн для поиска IP и порта, разделенных различными символами
        /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})[^0-9a-zA-Z](\d{2,5})/g
      ];
      
      // Экстракция всех потенциальных IP-адресов
      const ipAddresses = content.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g) || [];
      const potentialPorts = content.match(/\b\d{2,5}\b/g) || [];
      
      // Проходим по всем паттернам и собираем результаты
      for (const pattern of ipPortPatterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const ip = match[1];
          const port = parseInt(match[2], 10);
          
          if (this.isValidIpPort(ip, port)) {
            let protocol: 'http' | 'https' | 'socks4' | 'socks5' = 'http';
            
            // Определение протокола по контексту, если возможно
            if (content.includes('socks5') || sourceName.toLowerCase().includes('socks5')) {
              protocol = 'socks5';
            } else if (content.includes('socks4') || sourceName.toLowerCase().includes('socks4')) {
              protocol = 'socks4';
            } else if (content.includes('https') || sourceName.toLowerCase().includes('https')) {
              protocol = 'https';
            }
            
            proxies.push({
              id: `${ip}:${port}`,
              ip,
              port,
              protocol,
              status: 'testing',
              lastChecked: new Date(),
              source: sourceName
            });
          }
        }
      }
      
      // Если традиционные методы не сработали, попробуем более агрессивный подход
      if (proxies.length === 0 && ipAddresses.length > 0) {
        for (const ip of ipAddresses) {
          // Ищем порты рядом с IP адресом
          const ipIdx = content.indexOf(ip);
          const nearby = content.substr(Math.max(0, ipIdx - 50), 100);
          
          // Ищем ближайший порт
          const portMatch = nearby.match(/\b(\d{2,5})\b/);
          if (portMatch && portMatch[1]) {
            const port = parseInt(portMatch[1], 10);
            if (port > 0 && port < 65536) { 
              if (this.isValidIpPort(ip, port)) {
                proxies.push({
                  id: `${ip}:${port}`,
                  ip,
                  port,
                  protocol: 'http', // Предположительно HTTP
                  status: 'testing',
                  lastChecked: new Date(),
                  source: sourceName + '-aggressive'
                });
              }
            }
          }
        }
      }
      
      // Дедупликация прокси по id
      const uniqueProxies = Array.from(
        new Map(proxies.map(proxy => [proxy.id, proxy])).values()
      );
      
      return uniqueProxies;
    } catch (e) {
      console.error('Fallback parser error:', e);
    }
    
    return proxies;
  }
  
  // Улучшенная валидация IP и порта
  private isValidIpPort(ip: string, port: number): boolean {
    // Validate IP format
    const ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipMatch = ip.match(ipPattern);
    
    if (!ipMatch) return false;
    
    // Check each octet is between 0-255
    for (let i = 1; i <= 4; i++) {
      const octet = parseInt(ipMatch[i], 10);
      if (isNaN(octet) || octet < 0 || octet > 255) return false;
    }
    
    // Расширенная проверка специальных IP-адресов, которые не могут быть прокси
    if (
      ip === '0.0.0.0' || 
      ip === '127.0.0.1' || 
      ip.startsWith('169.254.') || 
      ip.startsWith('172.16.') || 
      ip.startsWith('172.17.') || 
      ip.startsWith('172.18.') || 
      ip.startsWith('172.19.') || 
      ip.startsWith('172.2') || 
      ip.startsWith('172.3') || 
      ip.startsWith('192.168.') || 
      ip.startsWith('10.') ||
      ip.startsWith('224.') ||
      ip.startsWith('239.') ||
      ip.startsWith('240.') ||
      ip === '255.255.255.255'
    ) {
      return false;
    }
    
    // Check port is valid
    return !isNaN(port) && port > 0 && port <= 65535;
  }

  // Импорт источников прокси из Python-скрипта
  importProxySourcesFromPython(sources: string[]): number {
    let importedCount = 0;
    
    for (const source of sources) {
      if (!Object.values(this.proxySources).some(s => s.url === source) && source.startsWith('http')) {
        const sourceName = `custom-${Date.now()}-${importedCount}`;
        console.log(`Импортирован источник прокси: ${source} -> ${sourceName}`);
        
        this.proxySources[sourceName] = {
          url: source,
          enabled: true,
          parseFunction: (html: string) => {
            // Enhanced parser to handle more formats
            const proxies: Proxy[] = [];
            const ipPortRegex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})[^\d\w]?[:|\s]+(\d{2,5})/g;
            let match;
            
            while ((match = ipPortRegex.exec(html)) !== null) {
              const ip = match[1];
              const port = parseInt(match[2], 10);
              
              if (this.isValidIpPort(ip, port)) {
                proxies.push({
                  id: `${ip}:${port}`,
                  ip,
                  port,
                  protocol: 'http',
                  status: 'testing',
                  lastChecked: new Date(),
                  source: sourceName
                });
              }
            }
            
            console.log(`Импортированный источник ${sourceName} нашел ${proxies.length} прокси`);
            return proxies;
          }
        };
        
        importedCount++;
      }
    }
    
    return importedCount;
  }
  
  getProxySources(): ProxySources {
    return this.proxySources;
  }
  
  // Добавление нового API источника
  addApiSource(name: string, url: string): boolean {
    if (this.proxySources[name]) {
      console.log(`Источник с именем ${name} уже существует`);
      return false;
    }
    
    this.proxySources[name] = {
      url,
      enabled: true,
      parseFunction: (data: any) => {
        try {
          const proxies: Proxy[] = [];
          // Пытаемся распарсить как JSON
          let jsonData = data;
          if (typeof data === 'string') {
            try {
              jsonData = JSON.parse(data);
            } catch (e) {
              // Если не JSON, применяем fallback parser
              return this.fallbackParse(data, name);
            }
          }
          
          // Обработка данных API
          if (Array.isArray(jsonData)) {
            for (const item of jsonData) {
              let ip, port;
              
              if (typeof item === 'string' && item.includes(':')) {
                [ip, port] = item.split(':');
              } else if (item.ip && item.port) {
                ip = item.ip;
                port = item.port;
              } else if (item.host && item.port) {
                ip = item.host;
                port = item.port;
              }
              
              if (ip && port) {
                const portNum = parseInt(port.toString(), 10);
                if (this.isValidIpPort(ip, portNum)) {
                  proxies.push({
                    id: `${ip}:${portNum}`,
                    ip,
                    port: portNum,
                    protocol: item.protocol || 'http',
                    status: 'testing',
                    lastChecked: new Date(),
                    source: name
                  });
                }
              }
            }
          } else {
            // Применяем fallback parser
            return this.fallbackParse(data, name);
          }
          
          return proxies;
        } catch (e) {
          console.error(`Ошибка при парсинге API источника ${name}:`, e);
          return this.fallbackParse(data, name);
        }
      }
    };
    
    return true;
  }
}
