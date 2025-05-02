
import axios from 'axios';
import { Proxy, ProxySources } from './types';
import { defaultProxySources } from './proxySourcesConfig';

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
    
    // Improved concurrency with max parallelism of 5
    const sourcePromises = [];
    const sourceChunks = this.chunkArray(enabledSources, 5); // Process 5 sources in parallel

    for (const chunk of sourceChunks) {
      const chunkPromises = chunk.map(([sourceName, sourceConfig]) => 
        this.processSource(sourceName, sourceConfig, onProgress)
      );
      
      // Wait for current chunk to complete before moving to the next
      const results = await Promise.all(chunkPromises);
      sourcePromises.push(...results);
      
      // Brief pause between chunks to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
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
      
      const response = await axios.get(sourceConfig.url, {
        timeout: 30000, // Increased timeout for slower sources
        headers: {
          'User-Agent': this.getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Cache-Control': 'max-age=0'
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
        } catch (parseError) {
          console.error(`Ошибка при парсинге прокси из ${sourceName}:`, parseError);
          parsedProxies = this.fallbackParse(responseData, sourceName);
          console.log(`Fallback парсер нашел ${parsedProxies.length} прокси`);
        }
      }
      
      // Add proxies to our collection map (automatically dedupes by ID)
      let newProxiesCount = 0;
      for (const proxy of parsedProxies) {
        if (!this.collectedProxies.has(proxy.id)) {
          this.collectedProxies.set(proxy.id, proxy);
          newProxiesCount++;
        }
      }
      
      console.log(`Добавлено ${newProxiesCount} новых прокси из источника ${sourceName}`);
      if (onProgress) onProgress(sourceName, this.collectedProxies.size);
      
      return parsedProxies;
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
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.2277.106'
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
  }

  // Fallback parser when the main parser fails
  private fallbackParse(data: any, sourceName: string): Proxy[] {
    const proxies: Proxy[] = [];
    try {
      // Universal regex for IP:PORT format
      const content = typeof data === 'string' ? data : JSON.stringify(data);
      
      // Improved regex to catch more proxy formats
      const ipPortRegex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})[^\d\w]?[:|\s]+(\d{2,5})/g;
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
            // Enhanced parser to handle more formats
            const proxies: Proxy[] = [];
            const ipPortRegex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})[^\d\w]?[:|\s]+(\d{2,5})/g;
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
