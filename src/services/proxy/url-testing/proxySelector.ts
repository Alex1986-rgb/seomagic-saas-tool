
import type { Proxy } from '../types';

/**
 * Manages proxy selection and load balancing for URL testing
 */
export class ProxySelector {
  private usedProxies: Set<string> = new Set();
  private activeProxies: Proxy[];
  
  constructor(activeProxies: Proxy[]) {
    this.activeProxies = [...activeProxies];
  }
  
  /**
   * Gets a random proxy with load balancing
   */
  getRandomProxy(): Proxy | undefined {
    if (this.activeProxies.length === 0) return undefined;
    
    // If all proxies have been used, reset tracking
    if (this.usedProxies.size >= this.activeProxies.length) {
      this.usedProxies.clear();
    }
    
    // Try to find an unused proxy
    const availableProxies = this.activeProxies.filter(
      p => !this.usedProxies.has(`${p.ip}:${p.port}`)
    );
    
    let proxy: Proxy;
    
    if (availableProxies.length > 0) {
      proxy = availableProxies[Math.floor(Math.random() * availableProxies.length)];
    } else {
      // If all are used, pick any
      proxy = this.activeProxies[Math.floor(Math.random() * this.activeProxies.length)];
    }
    
    this.usedProxies.add(`${proxy.ip}:${proxy.port}`);
    return proxy;
  }
}
