
import type { Proxy } from '../types';

export class ProxySelector {
  private proxies: Proxy[];
  private lastIndex: number = -1;

  constructor(proxies: Proxy[]) {
    this.proxies = proxies;
  }

  getRandomProxy(): Proxy {
    if (this.proxies.length === 0) {
      throw new Error('No proxies available');
    }

    const randomIndex = Math.floor(Math.random() * this.proxies.length);
    return this.proxies[randomIndex];
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
}
