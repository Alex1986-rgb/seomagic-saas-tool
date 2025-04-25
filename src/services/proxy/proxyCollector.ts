
import axios from 'axios';
import { Proxy, ProxySources } from './types';
import { defaultProxySources } from './proxySourcesConfig';

export class ProxyCollector {
  private proxySources: ProxySources;
  
  constructor(sources?: ProxySources) {
    this.proxySources = sources || defaultProxySources;
  }
  
  async collectProxies(
    onProgress?: (source: string, count: number) => void
  ): Promise<Proxy[]> {
    const newProxies: Proxy[] = [];
    
    for (const [sourceName, sourceConfig] of Object.entries(this.proxySources)) {
      if (!sourceConfig.enabled) continue;
      
      try {
        console.log(`Сбор прокси из источника: ${sourceName}`);
        if (onProgress) onProgress(sourceName, 0);
        
        const response = await axios.get(sourceConfig.url, {
          timeout: 20000, // Increased timeout to 20 seconds
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0'
          },
          validateStatus: status => (status >= 200 && status < 300) || status === 404
        });
        
        let parsedProxies: Proxy[] = [];
        
        if (response.status >= 200 && response.status < 300 && response.data) {
          try {
            parsedProxies = sourceConfig.parseFunction(response.data);
            console.log(`Найдено ${parsedProxies.length} прокси в источнике ${sourceName}`);
          } catch (parseError) {
            console.error(`Ошибка при парсинге прокси из ${sourceName}:`, parseError);
            parsedProxies = this.fallbackParse(response.data, sourceName);
          }
        }
        
        // Фильтрация дубликатов
        const uniqueProxies = parsedProxies.filter(
          (proxy, index, self) => 
            index === self.findIndex((t) => t.ip === proxy.ip && t.port === proxy.port)
        );
        
        newProxies.push(...uniqueProxies);
        
        if (onProgress) onProgress(sourceName, uniqueProxies.length);
      } catch (error) {
        console.error(`Ошибка при сборе прокси из ${sourceName}:`, error);
        if (onProgress) onProgress(sourceName, -1); // Ошибка
      }
      
      // Добавляем задержку между запросами
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
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
  
  getProxySources(): ProxySources {
    return this.proxySources;
  }
}
