
import { ProxyStorage } from './proxyStorage';
import type { Proxy, ProxySources as ProxySourcesType } from './types';
import { parseProxiesFromText } from './proxySourceParser';

export class ProxySources {
  public proxySources: ProxySourcesType;
  private proxyStorage: ProxyStorage;
  
  constructor(initialSources: ProxySourcesType, proxyStorage: ProxyStorage) {
    this.proxySources = initialSources;
    this.proxyStorage = proxyStorage;
  }
  
  async collectProxies(
    progressCallback?: (source: string, count: number) => void
  ): Promise<Proxy[]> {
    const newProxies: Proxy[] = [];
    
    for (const [sourceName, source] of Object.entries(this.proxySources)) {
      try {
        if (source.enabled) {
          if (progressCallback) {
            progressCallback(sourceName, -1); // Start indicator
          }
          
          const fetchedData = await fetch(source.url).then(res => res.text());
          const proxiesFromSource = source.parseFunction(fetchedData);
          
          // Process and add new proxies
          for (const proxyData of proxiesFromSource) {
            const proxy: Proxy = {
              ...proxyData,
              id: `${proxyData.ip}:${proxyData.port}`,
              lastChecked: new Date(),
              source: sourceName,
              status: 'inactive'
            };
            
            if (!this.proxyStorage.exists(proxy.ip, proxy.port)) {
              this.proxyStorage.add(proxy);
              newProxies.push(proxy);
            }
          }
          
          if (progressCallback) {
            progressCallback(sourceName, newProxies.length);
          }
        }
      } catch (error) {
        console.error(`Error collecting from source ${sourceName}:`, error);
        if (progressCallback) {
          progressCallback(sourceName, -1); // Error indicator
        }
      }
    }
    
    return newProxies;
  }
  
  parseProxiesFromText(text: string): Proxy[] {
    return parseProxiesFromText(text);
  }
  
  // Parser methods
  parseFreeProxyLists(data: string): any[] {
    // Implementation placeholder
    return [];
  }
  
  parseSSLProxies(data: string): any[] {
    // Implementation placeholder
    return [];
  }
  
  parseFreeProxyCZ(data: string): any[] {
    // Implementation placeholder
    return [];
  }
  
  parseProxylistMe(data: string): any[] {
    // Implementation placeholder
    return [];
  }
  
  parseProxyScanIO(data: string): any[] {
    // Implementation placeholder
    return [];
  }
}
