
import type { Proxy } from './types';

export function parseProxiesFromText(text: string): Proxy[] {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  const proxies: Proxy[] = [];
  
  for (const line of lines) {
    try {
      let ip, port, protocol = 'http';
      
      // Check for full URL format (protocol://ip:port)
      if (line.includes('://')) {
        const [protocolPart, hostPart] = line.split('://');
        protocol = protocolPart.toLowerCase() as 'http' | 'https' | 'socks4' | 'socks5';
        if (!['http', 'https', 'socks4', 'socks5'].includes(protocol)) {
          protocol = 'http'; // Default to http if protocol is not recognized
        }
        const [hostIp, hostPort] = hostPart.split(':');
        ip = hostIp;
        port = parseInt(hostPort);
      } else {
        // Simple format (ip:port)
        const [hostIp, hostPort] = line.split(':');
        ip = hostIp;
        port = parseInt(hostPort);
      }
      
      if (ip && port) {
        proxies.push({
          id: `${ip}:${port}`,
          ip,
          port,
          protocol: protocol as 'http' | 'https' | 'socks4' | 'socks5',
          status: 'inactive',
          lastChecked: new Date(),
          source: 'import'
        });
      }
    } catch (error) {
      console.error('Error parsing proxy line:', line, error);
    }
  }
  
  return proxies;
}
