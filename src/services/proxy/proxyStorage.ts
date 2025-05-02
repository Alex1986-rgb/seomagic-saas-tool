
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
    return true;
  }

  addProxies(proxies: Proxy[]): number {
    let addedCount = 0;
    for (const proxy of proxies) {
      if (!this.proxies.has(proxy.id)) {
        this.proxies.set(proxy.id, proxy);
        addedCount++;
      }
    }
    this.saveProxiesToStorage();
    return addedCount;
  }

  updateProxies(proxies: Proxy[]): number {
    let updatedCount = 0;
    for (const proxy of proxies) {
      if (this.proxies.has(proxy.id)) {
        this.proxies.set(proxy.id, proxy);
        updatedCount++;
      } else {
        // If proxy doesn't exist, add it
        this.proxies.set(proxy.id, proxy);
        updatedCount++;
      }
    }
    this.saveProxiesToStorage();
    return updatedCount;
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
        // Улучшенная обработка различных форматов
        let ip: string;
        let port: number;
        let protocol: 'http' | 'https' | 'socks4' | 'socks5' = 'http';
        let username: string | undefined;
        let password: string | undefined;
        
        // Regular expression to match IP:PORT:USERNAME:PASSWORD or IP:PORT format
        const fullPattern = /^(.+?):(\d+)(?::(.+?)(?::(.+))?)?$/;
        const match = trimmedLine.match(fullPattern);
        
        if (match) {
          // Handle format with username:password
          [, ip, port, username, password] = match;
          port = parseInt(port, 10);
          
          // Check for protocol prefix
          if (ip.includes('://')) {
            const protocolParts = ip.split('://');
            protocol = protocolParts[0] as 'http' | 'https' | 'socks4' | 'socks5';
            ip = protocolParts[1];
          }
        } else if (trimmedLine.includes('://')) {
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
              source: 'imported',
              username,
              password
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
