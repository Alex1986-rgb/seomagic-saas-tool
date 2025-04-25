
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
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        const parsedProxies = sourceConfig.parseFunction(response.data);
        console.log(`Найдено ${parsedProxies.length} прокси в источнике ${sourceName}`);
        
        newProxies.push(...parsedProxies);
        
        if (onProgress) onProgress(sourceName, parsedProxies.length);
      } catch (error) {
        console.error(`Ошибка при сборе прокси из ${sourceName}:`, error);
        if (onProgress) onProgress(sourceName, -1); // Ошибка
      }
    }
    
    return newProxies;
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
