
import { ProxySources, Proxy } from './types';

export const defaultProxySources: ProxySources = {
  'free-proxy-list': {
    url: 'https://free-proxy-list.net/',
    enabled: true,
    parseFunction: (html: string) => {
      const proxies: Proxy[] = [];
      try {
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
    url: 'https://proxylist.geonode.com/api/proxy-list?limit=500&page=1&sort_by=lastChecked&sort_type=desc',
    enabled: true,
    parseFunction: (data: string) => {
      const proxies: Proxy[] = [];
      try {
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
  'proxylist-org': {
    url: 'https://proxy-list.org/english/index.php',
    enabled: true,
    parseFunction: (html: string) => {
      const proxies: Proxy[] = [];
      try {
        const rows = html.match(/Proxy\('([^']+)'\)/g) || [];
        for (const row of rows) {
          const decodedProxy = atob(row.match(/Proxy\('([^']+)'\)/)?.[1] || '');
          const [ip, portStr] = decodedProxy.split(':');
          const port = parseInt(portStr, 10);
          
          if (ip && !isNaN(port)) {
            proxies.push({
              id: `${ip}:${port}`,
              ip,
              port,
              protocol: 'http',
              status: 'testing',
              lastChecked: new Date(),
              source: 'proxylist-org'
            });
          }
        }
      } catch (error) {
        console.error('Ошибка при парсинге proxylist.org:', error);
      }
      return proxies;
    }
  },
  'hidemy-name': {
    url: 'https://hidemy.name/en/proxy-list/',
    enabled: true,
    parseFunction: (html: string) => {
      const proxies: Proxy[] = [];
      try {
        const rows = html.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\s*:\s*\d{2,5}/g) || [];
        for (const row of rows) {
          const [ip, portStr] = row.split(':').map(s => s.trim());
          const port = parseInt(portStr, 10);
          
          if (ip && !isNaN(port)) {
            proxies.push({
              id: `${ip}:${port}`,
              ip,
              port,
              protocol: 'http',
              status: 'testing',
              lastChecked: new Date(),
              source: 'hidemy-name'
            });
          }
        }
      } catch (error) {
        console.error('Ошибка при парсинге hidemy.name:', error);
      }
      return proxies;
    }
  },
  'sslproxies': {
    url: 'https://www.sslproxies.org/',
    enabled: true,
    parseFunction: (html: string) => {
      const proxies: Proxy[] = [];
      try {
        const rows = html.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\s*:\s*\d{2,5}/g) || [];
        for (const row of rows) {
          const [ip, portStr] = row.split(':').map(s => s.trim());
          const port = parseInt(portStr, 10);
          
          if (ip && !isNaN(port)) {
            proxies.push({
              id: `${ip}:${port}`,
              ip,
              port,
              protocol: 'https',
              status: 'testing',
              lastChecked: new Date(),
              source: 'sslproxies'
            });
          }
        }
      } catch (error) {
        console.error('Ошибка при парсинге sslproxies.org:', error);
      }
      return proxies;
    }
  },
  // Добавим новые источники
  'proxy-list-download-http': {
    url: 'https://www.proxy-list.download/api/v1/get?type=http',
    enabled: true,
    parseFunction: (data: string) => {
      const proxies: Proxy[] = [];
      try {
        if (typeof data === 'string') {
          const lines = data.split('\r\n');
          for (const line of lines) {
            if (!line.trim()) continue;
            
            const [ip, portStr] = line.split(':');
            const port = parseInt(portStr, 10);
            
            if (ip && !isNaN(port)) {
              proxies.push({
                id: `${ip}:${port}`,
                ip,
                port,
                protocol: 'http',
                status: 'testing',
                lastChecked: new Date(),
                source: 'proxy-list-download'
              });
            }
          }
        }
      } catch (error) {
        console.error('Ошибка при парсинге proxy-list.download:', error);
      }
      return proxies;
    }
  },
  'proxy-list-download-https': {
    url: 'https://www.proxy-list.download/api/v1/get?type=https',
    enabled: true,
    parseFunction: (data: string) => {
      const proxies: Proxy[] = [];
      try {
        if (typeof data === 'string') {
          const lines = data.split('\r\n');
          for (const line of lines) {
            if (!line.trim()) continue;
            
            const [ip, portStr] = line.split(':');
            const port = parseInt(portStr, 10);
            
            if (ip && !isNaN(port)) {
              proxies.push({
                id: `${ip}:${port}`,
                ip,
                port,
                protocol: 'https',
                status: 'testing',
                lastChecked: new Date(),
                source: 'proxy-list-download'
              });
            }
          }
        }
      } catch (error) {
        console.error('Ошибка при парсинге proxy-list.download HTTPS:', error);
      }
      return proxies;
    }
  },
  'github-clarketm': {
    url: 'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt',
    enabled: true,
    parseFunction: (data: string) => {
      const proxies: Proxy[] = [];
      try {
        if (typeof data === 'string') {
          const lines = data.split('\n');
          for (const line of lines) {
            if (!line.trim()) continue;
            
            const [ip, portStr] = line.split(':');
            const port = parseInt(portStr, 10);
            
            if (ip && !isNaN(port)) {
              proxies.push({
                id: `${ip}:${port}`,
                ip,
                port,
                protocol: 'http',
                status: 'testing',
                lastChecked: new Date(),
                source: 'github-clarketm'
              });
            }
          }
        }
      } catch (error) {
        console.error('Ошибка при парсинге github-clarketm:', error);
      }
      return proxies;
    }
  },
  'github-TheSpeedX': {
    url: 'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
    enabled: true,
    parseFunction: (data: string) => {
      const proxies: Proxy[] = [];
      try {
        if (typeof data === 'string') {
          const lines = data.split('\n');
          for (const line of lines) {
            if (!line.trim()) continue;
            
            const [ip, portStr] = line.split(':');
            const port = parseInt(portStr, 10);
            
            if (ip && !isNaN(port)) {
              proxies.push({
                id: `${ip}:${port}`,
                ip,
                port,
                protocol: 'http',
                status: 'testing',
                lastChecked: new Date(),
                source: 'github-TheSpeedX'
              });
            }
          }
        }
      } catch (error) {
        console.error('Ошибка при парсинге github-TheSpeedX:', error);
      }
      return proxies;
    }
  },
  'github-ShiftyTR': {
    url: 'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt',
    enabled: true,
    parseFunction: (data: string) => {
      const proxies: Proxy[] = [];
      try {
        if (typeof data === 'string') {
          const lines = data.split('\n');
          for (const line of lines) {
            if (!line.trim()) continue;
            
            const [ip, portStr] = line.split(':');
            const port = parseInt(portStr, 10);
            
            if (ip && !isNaN(port)) {
              proxies.push({
                id: `${ip}:${port}`,
                ip,
                port,
                protocol: 'http',
                status: 'testing',
                lastChecked: new Date(),
                source: 'github-ShiftyTR'
              });
            }
          }
        }
      } catch (error) {
        console.error('Ошибка при парсинге github-ShiftyTR:', error);
      }
      return proxies;
    }
  },
  'github-monosans': {
    url: 'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt',
    enabled: true,
    parseFunction: (data: string) => {
      const proxies: Proxy[] = [];
      try {
        if (typeof data === 'string') {
          const lines = data.split('\n');
          for (const line of lines) {
            if (!line.trim()) continue;
            
            const [ip, portStr] = line.split(':');
            const port = parseInt(portStr, 10);
            
            if (ip && !isNaN(port)) {
              proxies.push({
                id: `${ip}:${port}`,
                ip,
                port,
                protocol: 'http',
                status: 'testing',
                lastChecked: new Date(),
                source: 'github-monosans'
              });
            }
          }
        }
      } catch (error) {
        console.error('Ошибка при парсинге github-monosans:', error);
      }
      return proxies;
    }
  },
  'github-jetkai': {
    url: 'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-http.txt',
    enabled: true,
    parseFunction: (data: string) => {
      const proxies: Proxy[] = [];
      try {
        if (typeof data === 'string') {
          const lines = data.split('\n');
          for (const line of lines) {
            if (!line.trim()) continue;
            
            const [ip, portStr] = line.split(':');
            const port = parseInt(portStr, 10);
            
            if (ip && !isNaN(port)) {
              proxies.push({
                id: `${ip}:${port}`,
                ip,
                port,
                protocol: 'http',
                status: 'testing',
                lastChecked: new Date(),
                source: 'github-jetkai'
              });
            }
          }
        }
      } catch (error) {
        console.error('Ошибка при парсинге github-jetkai:', error);
      }
      return proxies;
    }
  },
  'github-mertguvencli': {
    url: 'https://raw.githubusercontent.com/mertguvencli/http-proxy-list/main/proxy-list/data.txt',
    enabled: true,
    parseFunction: (data: string) => {
      const proxies: Proxy[] = [];
      try {
        if (typeof data === 'string') {
          const lines = data.split('\n');
          for (const line of lines) {
            if (!line.trim()) continue;
            
            const [ip, portStr] = line.split(':');
            const port = parseInt(portStr, 10);
            
            if (ip && !isNaN(port)) {
              proxies.push({
                id: `${ip}:${port}`,
                ip,
                port,
                protocol: 'http',
                status: 'testing',
                lastChecked: new Date(),
                source: 'github-mertguvencli'
              });
            }
          }
        }
      } catch (error) {
        console.error('Ошибка при парсинге github-mertguvencli:', error);
      }
      return proxies;
    }
  }
};
