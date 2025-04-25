
import axios from 'axios';
import { Proxy, ProxySources } from './types';
import { defaultProxySources } from './proxySourcesConfig';

export class ProxyCollector {
  private proxySources: ProxySources;
  
  constructor(sources?: ProxySources) {
    this.proxySources = sources || defaultProxySources;
  }
  
  async collectProxies(
    onProgress?: (source: string, count: number) => void,
    clearExisting: boolean = false
  ): Promise<Proxy[]> {
    const newProxies: Proxy[] = [];
    const enabledSources = Object.entries(this.proxySources).filter(([_, config]) => config.enabled);
    
    if (enabledSources.length === 0) {
      console.log('Нет активных источников прокси для сбора');
      return [];
    }
    
    console.log(`Начинаем сбор прокси из ${enabledSources.length} источников`);
    
    for (const [sourceName, sourceConfig] of enabledSources) {
      try {
        console.log(`Сбор прокси из источника: ${sourceName}, URL: ${sourceConfig.url}`);
        if (onProgress) onProgress(sourceName, 0);
        
        // Используем axios для всех запросов с расширенными настройками для обхода простой защиты
        const response = await axios.get(sourceConfig.url, {
          timeout: 60000, // Increased timeout to 60 seconds
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          validateStatus: status => (status >= 200 && status < 300) || status === 404,
          maxRedirects: 5
        });
        
        let responseData = response.data;
        let parsedProxies: Proxy[] = [];
        
        if (responseData) {
          console.log(`Получены данные от ${sourceName}, размер: ${
            typeof responseData === 'string' ? responseData.length : 'объект'
          }`);
          
          try {
            parsedProxies = sourceConfig.parseFunction(responseData);
            console.log(`Найдено ${parsedProxies.length} прокси в источнике ${sourceName}`);
            
            if (parsedProxies.length > 0) {
              console.log(`Примеры прокси из ${sourceName}:`, 
                parsedProxies.slice(0, 3).map(p => `${p.ip}:${p.port}`));
            }
          } catch (parseError) {
            console.error(`Ошибка при парсинге прокси из ${sourceName}:`, parseError);
            parsedProxies = this.fallbackParse(responseData, sourceName);
            console.log(`Fallback парсер нашел ${parsedProxies.length} прокси`);
          }
        } else {
          console.error(`Ошибка при запросе к ${sourceName}. Данные не получены.`);
        }
        
        // Enhanced duplicate filtering
        const uniqueProxies = parsedProxies.filter((proxy, index, self) => {
          return index === self.findIndex((t) => (
            t.ip === proxy.ip && 
            t.port === proxy.port &&
            (!proxy.protocol || t.protocol === proxy.protocol)
          ));
        });
        
        console.log(`После фильтрации дубликатов: ${uniqueProxies.length} уникальных прокси из ${sourceName}`);
        newProxies.push(...uniqueProxies);
        
        if (onProgress) onProgress(sourceName, uniqueProxies.length);
      } catch (error) {
        console.error(`Ошибка при сборе прокси из ${sourceName}:`, error);
        if (onProgress) onProgress(sourceName, -1);
      }
      
      // Increased delay between requests to avoid rate limits
      console.log(`Добавляем задержку перед следующим запросом: 5000ms`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    console.log(`Всего собрано ${newProxies.length} прокси из всех источников`);
    return newProxies;
  }

  // Fallback parser when the main parser fails
  private fallbackParse(data: any, sourceName: string): Proxy[] {
    const proxies: Proxy[] = [];
    try {
      // Universal regex for IP:PORT format
      const content = typeof data === 'string' ? data : JSON.stringify(data);
      const ipPortRegex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d{1,5})/g;
      let match;
      
      while ((match = ipPortRegex.exec(content)) !== null) {
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
    } catch (e) {
      console.error('Fallback parser error:', e);
    }
    
    return proxies;
  }
  
  // Validate IP and port
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
    
    // Check port is valid
    return !isNaN(port) && port > 0 && port <= 65535;
  }

  importProxySourcesFromPython(sources: string[]): number {
    let importedCount = 0;
    
    for (const source of sources) {
      if (!this.proxySources[source] && source.startsWith('http')) {
        const sourceName = `custom-${Date.now()}-${importedCount}`;
        console.log(`Импортирован источник прокси: ${source} -> ${sourceName}`);
        
        this.proxySources[sourceName] = {
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
}
