
import type { Proxy } from '../types';

export class ProxySelector {
  private proxies: Proxy[];
  private lastIndex: number = -1;
  private failedProxies: Set<string> = new Set(); // Track failed proxies

  constructor(proxies: Proxy[]) {
    this.proxies = proxies;
  }

  getRandomProxy(): Proxy {
    if (this.proxies.length === 0) {
      throw new Error('No proxies available');
    }

    // Filter out failed proxies if possible
    const availableProxies = this.proxies.filter(p => !this.failedProxies.has(p.id));
    
    // If all proxies have failed, reset and try again with all proxies
    if (availableProxies.length === 0) {
      this.failedProxies.clear();
      const randomIndex = Math.floor(Math.random() * this.proxies.length);
      return this.proxies[randomIndex];
    }
    
    const randomIndex = Math.floor(Math.random() * availableProxies.length);
    return availableProxies[randomIndex];
  }

  getNextProxy(): Proxy {
    if (this.proxies.length === 0) {
      throw new Error('No proxies available');
    }

    this.lastIndex = (this.lastIndex + 1) % this.proxies.length;
    return this.proxies[this.lastIndex];
  }

  getProxyById(id: string): Proxy | undefined {
    return this.proxies.find(p => p.id === id);
  }

  markProxyAsFailed(id: string): void {
    this.failedProxies.add(id);
  }
}
