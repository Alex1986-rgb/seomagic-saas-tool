
import { ProxySources, Proxy } from './types';

export const defaultProxySources: ProxySources = {
  'free-proxy-list': {
    url: 'https://free-proxy-list.net/',
    enabled: true,
    parseFunction: (html: string) => {
      // Пример парсинга HTML
      const proxies: Proxy[] = [];
      try {
        // Простой парсинг на основе строк (в реальном приложении лучше использовать cheerio или другой HTML парсер)
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
                lastChecked: new Date()
              });
            }
          }
        }
      } catch (error) {
        console.error('Ошибка при парсинге прокси:', error);
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
                status: 'testing'
              });
            }
          }
        }
      } catch (error) {
        console.error('Ошибка при парсинге JSON прокси:', error);
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
  }
};
