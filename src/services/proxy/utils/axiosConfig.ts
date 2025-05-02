import axios, { AxiosInstance } from 'axios';
import type { Proxy } from '../types';
import https from 'https';
import http from 'http';

// Cache for axios instances to avoid recreating them for the same proxy
const axiosInstanceCache = new Map<string, {instance: AxiosInstance, timestamp: number}>();

// Cache expiration time (10 minutes)
const CACHE_EXPIRATION_MS = 10 * 60 * 1000;

export function setupAxiosInstance(proxy: Proxy, testUrl: string = 'https://api.ipify.org/'): AxiosInstance {
  // Check if we have a cached instance for this proxy
  const cacheKey = `${proxy.id}-${testUrl}`;
  const cachedInstance = axiosInstanceCache.get(cacheKey);
  
  if (cachedInstance && (Date.now() - cachedInstance.timestamp) < CACHE_EXPIRATION_MS) {
    return cachedInstance.instance;
  }
  
  // Create agents with keepAlive for connection optimization
  const httpsAgent = new https.Agent({ 
    keepAlive: true,
    keepAliveMsecs: 5000,      // Increased keepalive duration
    maxSockets: 300,           // Further increased for better parallelism  
    maxFreeSockets: 50,        // Increased for better reuse
    timeout: 15000             // Balanced timeout
  });
  
  const httpAgent = new http.Agent({ 
    keepAlive: true,
    keepAliveMsecs: 5000,
    maxSockets: 300, 
    maxFreeSockets: 50,
    timeout: 15000
  });
  
  // Optimized proxy configuration
  const proxyConfig = {
    host: proxy.ip,
    port: proxy.port,
    protocol: proxy.protocol,
    auth: proxy.username && proxy.password ? {
      username: proxy.username,
      password: proxy.password
    } : undefined
  };
  
  // Create custom axios instance with improved settings
  const axiosInstance = axios.create({
    timeout: 15000,             // Balanced timeout
    httpAgent,
    httpsAgent,
    proxy: proxyConfig,
    headers: {
      'User-Agent': getRandomUserAgent(),
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Upgrade-Insecure-Requests': '1',
      'X-Requested-With': 'XMLHttpRequest'
    },
    validateStatus: null, // Allow handling all status codes
    maxRedirects: 5,
    decompress: true,
    responseType: 'text'
  });
  
  // Optimized interceptors for performance
  axiosInstance.interceptors.request.use(
    config => {
      // Add randomization to bypass caching
      const randomParam = `_r=${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
      const separator = config.url?.includes('?') ? '&' : '?';
      config.url = `${config.url}${separator}${randomParam}`;
      
      // Log request for debugging
      console.debug(`[Proxy ${proxy.ip}:${proxy.port}] Request to: ${config.url}`);
      
      return config;
    },
    error => {
      console.error(`[Proxy ${proxy.ip}:${proxy.port}] Request error:`, error.message);
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    response => {
      console.debug(`[Proxy ${proxy.ip}:${proxy.port}] Response status: ${response.status} from ${response.config.url}`);
      return response;
    },
    error => {
      // Enhanced error handling with more details
      if (error.response) {
        console.error(`[Proxy ${proxy.ip}:${proxy.port}] HTTP Error ${error.response.status}: ${error.response.statusText}`);
        return Promise.reject({
          status: error.response.status,
          message: `HTTP Error: ${error.response.status}`,
          details: error.response.data
        });
      } else if (error.code === 'ECONNABORTED') {
        console.error(`[Proxy ${proxy.ip}:${proxy.port}] Timeout Error: ${error.message}`);
        return Promise.reject({
          status: null,
          message: 'Timeout Error: Превышен таймаут соединения',
          details: error.message
        });
      } else {
        console.error(`[Proxy ${proxy.ip}:${proxy.port}] Network Error: ${error.message}`);
        return Promise.reject({
          status: null,
          message: 'Network Error: Ошибка сети',
          details: error.message
        });
      }
    }
  );
  
  // Cache the instance
  axiosInstanceCache.set(cacheKey, {
    instance: axiosInstance, 
    timestamp: Date.now()
  });
  
  return axiosInstance;
}

// Clean up expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of axiosInstanceCache.entries()) {
    if (now - value.timestamp > CACHE_EXPIRATION_MS) {
      axiosInstanceCache.delete(key);
    }
  }
}, 60000); // Check every minute

// Function to get a random user agent to avoid detection/blocking
function getRandomUserAgent(): string {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:122.0) Gecko/20100101 Firefox/122.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.2277.106',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/106.0.0.0',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1'
  ];
  
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}
