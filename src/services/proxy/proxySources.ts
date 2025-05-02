
import { v4 as uuidv4 } from 'uuid';
import type { Proxy, ProxySources as ProxySourcesType } from './types';
import { ProxyStorage } from './proxyStorage';

export class ProxySources {
  public proxySources: ProxySourcesType;
  private proxyStorage: ProxyStorage;
  
  constructor(proxySources: ProxySourcesType, proxyStorage: ProxyStorage) {
    this.proxySources = proxySources;
    this.proxyStorage = proxyStorage;
  }
  
  async collectProxies(
    progressCallback?: (source: string, count: number) => void
  ): Promise<Proxy[]> {
    const existingProxies = new Set(
      this.proxyStorage.getAll().map(proxy => `${proxy.ip}:${proxy.port}`)
    );
    
    const newProxies: Proxy[] = [];
    
    for (const [sourceName, source] of Object.entries(this.proxySources)) {
      if (!source.enabled) continue;
      
      try {
        // In a real implementation, we would fetch data from the source URL
        // For this mock version, we'll generate some random proxies
        const mockData = this.generateMockResponse();
        
        // Parse the proxies using the source's parseFunction
        const parsedProxies = this.parseMockData(mockData, sourceName);
        
        let count = 0;
        
        for (const proxy of parsedProxies) {
          const proxyKey = `${proxy.ip}:${proxy.port}`;
          
          if (!existingProxies.has(proxyKey)) {
            this.proxyStorage.add(proxy);
            newProxies.push(proxy);
            existingProxies.add(proxyKey);
            count++;
          }
        }
        
        if (progressCallback) {
          progressCallback(sourceName, count);
        }
      } catch (error) {
        console.error(`Error collecting proxies from ${sourceName}:`, error);
        if (progressCallback) {
          progressCallback(sourceName, -1);
        }
      }
    }
    
    return newProxies;
  }
  
  // Mock data generation for testing
  private generateMockResponse(): string {
    return `
      <table>
        <tr><td>192.168.1.1</td><td>8080</td><td>HTTP</td><td>Elite</td></tr>
        <tr><td>10.0.0.1</td><td>3128</td><td>HTTPS</td><td>Anonymous</td></tr>
        <tr><td>172.16.0.1</td><td>1080</td><td>SOCKS5</td><td>Transparent</td></tr>
      </table>
    `;
  }
  
  private parseMockData(data: string, source: string): Proxy[] {
    // Simple mock implementation that creates random proxies
    const proxies: Proxy[] = [];
    
    for (let i = 0; i < 5; i++) {
      const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      const port = Math.floor(Math.random() * 65000) + 1000;
      const protocols = ['http', 'https', 'socks4', 'socks5'] as const;
      const statuses = ['active', 'inactive', 'testing'] as const;
      const anonymityLevels = ['transparent', 'anonymous', 'elite'] as const;
      
      proxies.push({
        id: uuidv4(),
        ip,
        port,
        protocol: protocols[Math.floor(Math.random() * protocols.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        lastChecked: new Date(),
        source,
        anonymity: anonymityLevels[Math.floor(Math.random() * anonymityLevels.length)]
      });
    }
    
    return proxies;
  }
  
  // Method to parse proxies from imported text
  parseProxiesFromText(text: string): Proxy[] {
    const proxies: Proxy[] = [];
    const lines = text.trim().split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      try {
        let ip: string;
        let port: number;
        let protocol: 'http' | 'https' | 'socks4' | 'socks5' = 'http';
        
        // Try to match protocol://ip:port format
        const protocolMatch = trimmedLine.match(/^(https?|socks[45]):\/\/([^:]+):(\d+)/i);
        
        if (protocolMatch) {
          protocol = protocolMatch[1].toLowerCase() as 'http' | 'https' | 'socks4' | 'socks5';
          if (protocol === 'socks') protocol = 'socks5';
          ip = protocolMatch[2];
          port = parseInt(protocolMatch[3], 10);
        } else {
          // Try to match ip:port format
          const ipPortMatch = trimmedLine.match(/^([^:]+):(\d+)/);
          if (!ipPortMatch) continue;
          
          ip = ipPortMatch[1];
          port = parseInt(ipPortMatch[2], 10);
        }
        
        // Validate IP and port
        if (!this.isValidIp(ip) || !this.isValidPort(port)) continue;
        
        const proxy: Proxy = {
          id: uuidv4(),
          ip,
          port,
          protocol,
          status: 'testing',
          lastChecked: new Date(),
          source: 'imported'
        };
        
        proxies.push(proxy);
      } catch (error) {
        console.error('Error parsing proxy:', trimmedLine, error);
      }
    }
    
    return proxies;
  }
  
  private isValidIp(ip: string): boolean {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    
    for (const part of parts) {
      const num = parseInt(part, 10);
      if (isNaN(num) || num < 0 || num > 255) return false;
    }
    
    return true;
  }
  
  private isValidPort(port: number): boolean {
    return !isNaN(port) && port > 0 && port <= 65535;
  }
  
  // Mock parser methods for different proxy sources
  parseFreeProxyLists(data: string): any[] {
    // In a real implementation, this would parse HTML from the freeproxylists.net site
    return this.parseMockData(data, 'freeproxylists');
  }
  
  parseSSLProxies(data: string): any[] {
    return this.parseMockData(data, 'sslproxies');
  }
  
  parseFreeProxyCZ(data: string): any[] {
    return this.parseMockData(data, 'free-proxy.cz');
  }
  
  parseProxylistMe(data: string): any[] {
    return this.parseMockData(data, 'proxylist.me');
  }
  
  parseProxyScanIO(data: string): any[] {
    return this.parseMockData(data, 'proxyscan.io');
  }
}
