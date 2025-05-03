
import type { Proxy } from '../types';
import axios from 'axios';

export async function testProxy(proxy: Proxy, testUrl: string = 'https://api.ipify.org/'): Promise<Proxy> {
  const updatedProxy = { ...proxy };
  const startTime = Date.now();
  
  try {
    // Create a proxy configuration for Axios
    const proxyConfig = {
      host: proxy.ip,
      port: proxy.port,
      protocol: proxy.protocol || 'http'
    };
    
    // Make request with timeout
    const response = await axios.get(testUrl, {
      proxy: proxyConfig,
      timeout: 15000,
      headers: {
        'User-Agent': getRandomUserAgent()
      }
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (response.status >= 200 && response.status < 400) {
      updatedProxy.status = 'active';
      updatedProxy.speed = responseTime;
      updatedProxy.lastSeen = new Date();
      updatedProxy.lastError = undefined;
      updatedProxy.checkedUrl = testUrl;
      console.log(`Proxy ${proxy.ip}:${proxy.port} is active. Speed: ${responseTime}ms`);
    } else {
      updatedProxy.status = 'inactive';
      updatedProxy.lastError = `Unexpected response: ${response.status}`;
      updatedProxy.checkedUrl = testUrl;
      console.log(`Proxy ${proxy.ip}:${proxy.port} returned status ${response.status}`);
    }
  } catch (error) {
    updatedProxy.status = 'inactive';
    updatedProxy.lastError = error.message || 'Unknown error';
    updatedProxy.checkedUrl = testUrl;
    console.log(`Proxy ${proxy.ip}:${proxy.port} failed: ${updatedProxy.lastError}`);
  }
  
  updatedProxy.lastChecked = new Date();
  
  return updatedProxy;
}

// Helper function to get random user agent
function getRandomUserAgent(): string {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:122.0) Gecko/20100101 Firefox/122.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.2277.106',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}
