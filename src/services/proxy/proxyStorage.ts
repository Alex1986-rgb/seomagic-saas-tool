
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
          if (proxy.lastSeen && typeof proxy.lastSeen === 'string') {
            proxy.lastSeen = new Date(proxy.lastSeen);
          }
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
        
        // Обработка разных форматов
        if (trimmedLine.includes('://')) {
          // Формат protocol://ip:port или protocol://user:pass@ip:port
          const protocolSplit = trimmedLine.split('://');
          protocol = protocolSplit[0] as 'http' | 'https' | 'socks4' | 'socks5';
          
          let hostPart = protocolSplit[1];
          
          // Проверка на наличие user:pass@
          if (hostPart.includes('@')) {
            const userPassHostSplit = hostPart.split('@');
            const userPassPart = userPassHostSplit[0];
            hostPart = userPassHostSplit[1];
            
            // Разбор user:pass
            if (userPassPart.includes(':')) {
              const userPassSplit = userPassPart.split(':');
              username = userPassSplit[0];
              password = userPassSplit[1];
            }
          }
          
          // Разбор ip:port
          if (hostPart.includes(':')) {
            const ipPortSplit = hostPart.split(':');
            ip = ipPortSplit[0];
            port = parseInt(ipPortSplit[1], 10);
          } else {
            continue; // Неверный формат
          }
        } else {
          // Обработка формата IP:PORT:USERNAME:PASSWORD или IP:PORT
          const fullPattern = /^(.+?):(\d+)(?::(.+?)(?::(.+))?)?$/;
          const match = trimmedLine.match(fullPattern);
          
          if (match) {
            // Handle format with username:password
            ip = match[1];
            port = parseInt(match[2], 10); // Convert to number
            username = match[3];
            password = match[4];
          } else if (trimmedLine.includes(':')) {
            // Простой формат ip:port
            const parts = trimmedLine.split(':');
            ip = parts[0];
            port = parseInt(parts[1], 10);
          } else {
            continue; // Неверный формат
          }
        }
        
        if (ip && !isNaN(port)) {
          // Валидация IP и порта
          if (!this.isValidIp(ip) || port <= 0 || port > 65535) {
            continue;
          }
          
          // Создаем ID прокси
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

  // Вспомогательный метод для валидации IP-адреса
  private isValidIp(ip: string): boolean {
    // Проверяем формат IP
    const ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = ip.match(ipPattern);
    
    if (!match) return false;
    
    // Проверяем, что каждый октет между 0 и 255
    for (let i = 1; i <= 4; i++) {
      const octet = parseInt(match[i], 10);
      if (isNaN(octet) || octet < 0 || octet > 255) return false;
    }
    
    // Проверяем специальные IP, которые не могут быть прокси
    if (ip === '0.0.0.0' || ip === '127.0.0.1' || ip.startsWith('169.254.') || 
        ip.startsWith('172.16.') || ip.startsWith('192.168.') || ip === '255.255.255.255') {
      return false;
    }
    
    return true;
  }
}
