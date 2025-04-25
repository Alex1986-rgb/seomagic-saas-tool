
import { Proxy } from './types';

export class ProxyStorage {
  private proxies: Map<string, Proxy> = new Map();

  constructor() {
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

  saveProxiesToStorage() {
    try {
      localStorage.setItem('proxies', JSON.stringify(Array.from(this.proxies.values())));
    } catch (error) {
      console.error('Ошибка при сохранении прокси в localStorage:', error);
    }
  }

  addProxy(proxy: Proxy) {
    this.proxies.set(proxy.id, proxy);
    this.saveProxiesToStorage();
  }

  addProxies(proxies: Proxy[]) {
    for (const proxy of proxies) {
      this.proxies.set(proxy.id, proxy);
    }
    this.saveProxiesToStorage();
  }

  getProxy(id: string): Proxy | undefined {
    return this.proxies.get(id);
  }

  getAllProxies(): Proxy[] {
    return Array.from(this.proxies.values());
  }

  getActiveProxies(): Proxy[] {
    return Array.from(this.proxies.values()).filter(proxy => proxy.status === 'active');
  }

  updateProxy(proxy: Proxy) {
    this.proxies.set(proxy.id, proxy);
    this.saveProxiesToStorage();
  }

  removeProxy(id: string): boolean {
    const result = this.proxies.delete(id);
    if (result) this.saveProxiesToStorage();
    return result;
  }

  clearAllProxies(): void {
    this.proxies.clear();
    this.saveProxiesToStorage();
  }

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
    
    this.saveProxiesToStorage();
    
    return importedProxies;
  }
}
