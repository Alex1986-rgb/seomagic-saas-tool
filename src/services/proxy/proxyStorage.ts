
import type { Proxy } from './types';

export class ProxyStorage {
  private proxies: Map<string, Proxy>;
  private storageKey = 'proxy_storage';
  
  constructor() {
    this.proxies = new Map();
    this.loadFromStorage();
  }
  
  private loadFromStorage(): void {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        const proxyArray: Proxy[] = JSON.parse(storedData);
        proxyArray.forEach(proxy => {
          this.proxies.set(proxy.id, {
            ...proxy,
            lastChecked: new Date(proxy.lastChecked),
            lastSeen: proxy.lastSeen ? new Date(proxy.lastSeen) : undefined
          });
        });
      }
    } catch (error) {
      console.error('Error loading proxies from storage:', error);
    }
  }
  
  private saveToStorage(): void {
    try {
      const proxyArray = Array.from(this.proxies.values());
      localStorage.setItem(this.storageKey, JSON.stringify(proxyArray));
    } catch (error) {
      console.error('Error saving proxies to storage:', error);
    }
  }
  
  add(proxy: Proxy): void {
    this.proxies.set(proxy.id, proxy);
    this.saveToStorage();
  }
  
  update(id: string, updates: Partial<Proxy>): boolean {
    const proxy = this.proxies.get(id);
    if (proxy) {
      this.proxies.set(id, { ...proxy, ...updates });
      this.saveToStorage();
      return true;
    }
    return false;
  }
  
  get(id: string): Proxy | undefined {
    return this.proxies.get(id);
  }
  
  getAll(): Proxy[] {
    return Array.from(this.proxies.values());
  }
  
  getByIpPort(ip: string, port: number): Proxy | undefined {
    return Array.from(this.proxies.values()).find(
      proxy => proxy.ip === ip && proxy.port === port
    );
  }
  
  exists(ip: string, port: number): boolean {
    return Array.from(this.proxies.values()).some(
      proxy => proxy.ip === ip && proxy.port === port
    );
  }
  
  remove(id: string): boolean {
    const result = this.proxies.delete(id);
    if (result) {
      this.saveToStorage();
    }
    return result;
  }
  
  clear(): void {
    this.proxies.clear();
    this.saveToStorage();
  }
  
  // Get active proxies (status === 'active')
  getActiveProxies(): Proxy[] {
    return Array.from(this.proxies.values()).filter(proxy => proxy.status === 'active');
  }
}
