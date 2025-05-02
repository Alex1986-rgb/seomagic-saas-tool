
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
    let totalCollected = 0;
    
    for (const [sourceName, source] of Object.entries(this.proxySources)) {
      if (!source.enabled) continue;
      
      try {
        // In a real implementation, we would fetch data from the source URL
        // For this mock version, we'll generate some random proxies
        const mockData = this.generateMockResponse(sourceName);
        
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
            totalCollected++;
          }
        }
        
        if (progressCallback) {
          progressCallback(sourceName, totalCollected);
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
  
  // Enhanced mock data generation for testing
  private generateMockResponse(source: string): string {
    // Different templates for different sources to simulate variety
    switch (source) {
      case 'freeproxylists':
        return `
          <table>
            <tr><td>192.168.1.1</td><td>8080</td><td>HTTP</td><td>Elite</td></tr>
            <tr><td>10.0.0.1</td><td>3128</td><td>HTTPS</td><td>Anonymous</td></tr>
            <tr><td>172.16.0.1</td><td>1080</td><td>SOCKS5</td><td>Transparent</td></tr>
            <tr><td>192.168.5.5</td><td>8888</td><td>HTTP</td><td>Anonymous</td></tr>
          </table>
        `;
      case 'sslproxies':
        return `
          <table>
            <tr><th>IP Address</th><th>Port</th><th>Code</th><th>Country</th><th>Anonymity</th><th>Google</th><th>Https</th><th>Last Checked</th></tr>
            <tr><td>203.0.113.1</td><td>80</td><td>US</td><td>United States</td><td>elite proxy</td><td>no</td><td>yes</td><td>1 minute ago</td></tr>
            <tr><td>203.0.113.2</td><td>3128</td><td>CA</td><td>Canada</td><td>anonymous</td><td>no</td><td>yes</td><td>5 minutes ago</td></tr>
            <tr><td>203.0.113.3</td><td>8080</td><td>UK</td><td>United Kingdom</td><td>transparent</td><td>no</td><td>no</td><td>10 minutes ago</td></tr>
            <tr><td>203.0.113.4</td><td>443</td><td>DE</td><td>Germany</td><td>elite proxy</td><td>yes</td><td>yes</td><td>2 minutes ago</td></tr>
          </table>
        `;
      default:
        return `
          <div class="proxy-list">
            <div class="proxy-item">
              <span class="ip">45.67.89.10</span>:<span class="port">8080</span>
              <span class="type">HTTP</span>
              <span class="country">Russia</span>
            </div>
            <div class="proxy-item">
              <span class="ip">98.76.54.32</span>:<span class="port">3128</span>
              <span class="type">HTTPS</span>
              <span class="country">Brazil</span>
            </div>
            <div class="proxy-item">
              <span class="ip">11.22.33.44</span>:<span class="port">1080</span>
              <span class="type">SOCKS5</span>
              <span class="country">China</span>
            </div>
          </div>
        `;
    }
  }
  
  private parseMockData(data: string, source: string): Proxy[] {
    // Enhanced mock implementation that creates more random proxies
    const proxies: Proxy[] = [];
    
    // Increase the number of proxies generated for each source
    const proxyCount = source === 'freeproxylists' || source === 'sslproxies' ? 20 : 15;
    
    for (let i = 0; i < proxyCount; i++) {
      // Generate more realistic-looking IPs for different sources
      let ip: string;
      
      if (source === 'freeproxylists') {
        ip = `103.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      } else if (source === 'sslproxies') {
        ip = `45.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      } else if (source === 'free-proxy.cz') {
        ip = `185.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      } else {
        ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      }
      
      // Make port numbers more realistic based on common proxy ports
      const commonPorts = [80, 443, 1080, 3128, 8080, 8888, 9090];
      const port = i < commonPorts.length 
        ? commonPorts[i] 
        : commonPorts[Math.floor(Math.random() * commonPorts.length)];
      
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
          const protocolStr = protocolMatch[1].toLowerCase();
          // Fix for the type error: Check protocol value and map correctly to allowed types
          if (protocolStr === 'http' || protocolStr === 'https') {
            protocol = protocolStr;
          } else if (protocolStr === 'socks4') {
            protocol = 'socks4';
          } else if (protocolStr === 'socks5' || protocolStr === 'socks') {
            protocol = 'socks5'; // Map 'socks' to 'socks5'
          }
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
  
  // Enhanced parser methods for different proxy sources
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
