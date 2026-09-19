
import type { Proxy } from './types';

export class ProxyStorage {
  private proxies: Map<string, Proxy>;
  private storageKey = 'proxy_storage';
  
  constructor() {
    this.proxies = new Map();
    this.loadFromStorage();
  }
  
  /**
   * Раньше «сбор прокси» генерировал случайные адреса и сохранял их сюда,
   * часть — со статусом «active». Тот генератор, и только он, ставил поле
   * anonymity вместе со случайным uuid в id; настоящие разборщики, которые
   * знают анонимность, пишут id в виде «ip:port», а импорт анонимность не
   * ставит. По этому сочетанию выдуманные записи и отсеиваем при загрузке,
   * чтобы они не выдавались за рабочие прокси.
   */
  private loadFromStorage(): void {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        const proxyArray: Proxy[] = JSON.parse(storedData);
        let dropped = 0;
        proxyArray.forEach(proxy => {
          if (proxy.anonymity !== undefined && proxy.id !== `${proxy.ip}:${proxy.port}`) {
            dropped++;
            return;
          }
          this.proxies.set(proxy.id, {
            ...proxy,
            lastChecked: new Date(proxy.lastChecked),
            lastSeen: proxy.lastSeen ? new Date(proxy.lastSeen) : undefined
          });
        });
        if (dropped > 0) {
          console.info(`Удалено ${dropped} прокси, сгенерированных прежней имитацией сбора`);
          this.saveToStorage();
        }
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

  /**
   * Добавить пачку адресов одной записью в localStorage. Повторы по ip:port
   * пропускаются. Списки источников бывают на тысячи строк, и сохранять
   * хранилище после каждого адреса слишком долго.
   */
  addMany(list: Proxy[]): Proxy[] {
    const known = new Set(Array.from(this.proxies.values()).map(proxy => `${proxy.ip}:${proxy.port}`));
    const added: Proxy[] = [];
    for (const proxy of list) {
      const key = `${proxy.ip}:${proxy.port}`;
      if (known.has(key)) continue;
      known.add(key);
      this.proxies.set(proxy.id, proxy);
      added.push(proxy);
    }
    if (added.length > 0) this.saveToStorage();
    return added;
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
