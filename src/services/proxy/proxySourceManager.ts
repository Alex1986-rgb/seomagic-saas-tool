
import { ProxySources } from './types';

// List of proxy sources from Python scripts
export const pythonProxySources = [
  'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
  'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt',
  'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt',
  'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-http.txt',
  'https://raw.githubusercontent.com/mertguvencli/http-proxy-list/main/proxy-list/data.txt'
];

// Create proxy sources from list of URLs
export function createProxySources(urls: string[]): ProxySources {
  const sources: ProxySources = {};
  
  urls.forEach((url, index) => {
    // Create a unique name for each source
    const name = `source-${Date.now()}-${index}`;
    
    sources[name] = {
      url,
      enabled: true,
      parseFunction: (data: string) => {
        try {
          const proxies = [];
          const lines = data.split('\n');
          
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;
            
            // Handle different formats
            let ip, port;
            
            if (trimmedLine.includes(':')) {
              const parts = trimmedLine.split(':');
              ip = parts[0];
              port = parseInt(parts[1], 10);
              
              if (ip && !isNaN(port)) {
                proxies.push({
                  id: `${ip}:${port}`,
                  ip,
                  port,
                  protocol: 'http',
                  status: 'testing',
                  lastChecked: new Date(),
                  source: name
                });
              }
            }
          }
          
          return proxies;
        } catch (error) {
          console.error(`Error parsing proxies from ${url}:`, error);
          return [];
        }
      }
    };
  });
  
  return sources;
}

// Load custom sources from localStorage
export function loadCustomProxySources(): ProxySources {
  try {
    const stored = localStorage.getItem('customProxySources');
    if (stored) {
      // We need to handle the parseFunction which can't be stored as JSON
      const parsedSources = JSON.parse(stored);
      
      // Add the parseFunction to each source
      Object.keys(parsedSources).forEach(key => {
        parsedSources[key].parseFunction = (data: string) => {
          try {
            const proxies = [];
            const ipPortRegex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d{1,5})/g;
            let match;
            
            while ((match = ipPortRegex.exec(data)) !== null) {
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
                  source: key
                });
              }
            }
            
            return proxies;
          } catch (error) {
            console.error(`Error parsing proxies:`, error);
            return [];
          }
        };
      });
      
      return parsedSources;
    }
  } catch (error) {
    console.error('Error loading custom proxy sources:', error);
  }
  
  return {};
}

// Save custom sources to localStorage
export function saveCustomProxySources(sources: ProxySources): void {
  try {
    // We need to filter out the parseFunction as it can't be stored as JSON
    const sourcesForStorage = {};
    
    Object.keys(sources).forEach(key => {
      if (key.startsWith('custom-') || key.startsWith('source-')) {
        sourcesForStorage[key] = {
          url: sources[key].url,
          enabled: sources[key].enabled
        };
      }
    });
    
    localStorage.setItem('customProxySources', JSON.stringify(sourcesForStorage));
  } catch (error) {
    console.error('Error saving custom proxy sources:', error);
  }
}
