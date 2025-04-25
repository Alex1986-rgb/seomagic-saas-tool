
import { ProxySources, Proxy } from './types';

export const defaultProxySources: ProxySources = {
  'free-proxy-list': {
    url: 'https://free-proxy-list.net/',
    enabled: true,
    parseFunction: (html: string) => {
      const proxies: Proxy[] = [];
      try {
        // Improved parsing logic
        const rows = html.split('<tr>').slice(1);
        for (const row of rows) {
          const cells = row.split('<td>');
          if (cells.length > 7) {
            const ip = cells[1].split('</td>')[0];
            const port = parseInt(cells[2].split('</td>')[0], 10);
            const anonymity = cells[5].split('</td>')[0].toLowerCase().includes('elite') 
              ? 'elite' 
              : cells[5].split('</td>')[0].toLowerCase().includes('anonymous') 
                ? 'anonymous' 
                : 'transparent';
            const protocol = cells[7].split('</td>')[0].toLowerCase().includes('yes') ? 'https' : 'http';
            
            if (ip && !isNaN(port)) {
              proxies.push({
                id: `${ip}:${port}`,
                ip,
                port,
                protocol,
                anonymity: anonymity as 'transparent' | 'anonymous' | 'elite',
                status: 'testing',
                lastChecked: new Date(),
                source: 'free-proxy-list'
              });
            }
          }
        }
      } catch (error) {
        console.error('Ошибка при парсинге free-proxy-list:', error);
      }
      return proxies;
    }
  },
  'geonode': {
    url: 'https://proxylist.geonode.com/api/proxy-list?limit=300&page=1&sort_by=lastChecked&sort_type=desc',
    enabled: true,
    parseFunction: (data: string) => {
      const proxies: Proxy[] = [];
      try {
        // Handle response being already parsed as an object
        const jsonData = typeof data === 'object' ? data : JSON.parse(data);
        if (jsonData.data && Array.isArray(jsonData.data)) {
          for (const item of jsonData.data) {
            if (item.ip && item.port && Array.isArray(item.protocols) && item.protocols.length > 0) {
              proxies.push({
                id: `${item.ip}:${item.port}`,
                ip: item.ip,
                port: parseInt(item.port, 10),
                protocol: item.protocols[0],
                country: item.country,
                anonymity: item.anonymityLevel,
                speed: item.speed,
                uptime: item.upTime,
                lastChecked: new Date(),
                status: 'testing',
                source: 'geonode'
              });
            }
          }
        }
      } catch (error) {
        console.error('Ошибка при парсинге JSON geonode:', error);
      }
      return proxies;
    }
  },
  'proxyscrape': {
    url: 'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all',
    enabled: true,
    parseFunction: (data: string) => {
      const proxies: Proxy[] = [];
      try {
        if (typeof data === 'string') {
          const lines = data.split('\n');
          for (const line of lines) {
            const [ip, portStr] = line.trim().split(':');
            const port = parseInt(portStr, 10);
            
            if (ip && !isNaN(port)) {
              proxies.push({
                id: `${ip}:${port}`,
                ip,
                port,
                protocol: 'http',
                status: 'testing',
                lastChecked: new Date(),
                source: 'proxyscrape'
              });
            }
          }
        }
      } catch (error) {
        console.error('Ошибка при парсинге proxyscrape данных:', error);
      }
      return proxies;
    }
  },
  'pubproxy': {
    url: 'http://pubproxy.com/api/proxy?limit=20&format=txt&https=true',
    enabled: true,
    parseFunction: (data: string) => {
      const proxies: Proxy[] = [];
      try {
        if (typeof data === 'string') {
          const lines = data.split('\n');
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;
            
            const [ip, portStr] = trimmedLine.split(':');
            const port = parseInt(portStr, 10);
            
            if (ip && !isNaN(port)) {
              proxies.push({
                id: `${ip}:${port}`,
                ip,
                port,
                protocol: 'https',
                status: 'testing',
                lastChecked: new Date(),
                source: 'pubproxy'
              });
            }
          }
        }
      } catch (error) {
        console.error('Ошибка при парсинге pubproxy данных:', error);
      }
      return proxies;
    }
  },
  'spys-one': {
    url: 'https://spys.one/en/free-proxy-list/',
    enabled: true,
    parseFunction: (html: string) => {
      const proxies: Proxy[] = [];
      try {
        // More complex parsing of the spys.one site
        const ipPortRegex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}).*?:(\d{1,5})/g;
        let match;
        
        while ((match = ipPortRegex.exec(html)) !== null) {
          const ip = match[1];
          const port = parseInt(match[2], 10);
          
          if (ip && !isNaN(port)) {
            proxies.push({
              id: `${ip}:${port}`,
              ip,
              port,
              protocol: 'http',
              status: 'testing',
              lastChecked: new Date(),
              source: 'spys-one'
            });
          }
        }
      } catch (error) {
        console.error('Ошибка при парсинге spys.one данных:', error);
      }
      return proxies;
    }
  }
};
