import axios, { AxiosInstance } from 'axios';
import type { Proxy } from '../types';

export function setupAxiosInstance(proxy: Proxy, testUrl: string = 'https://api.ipify.org/'): AxiosInstance {
  // Create a custom agent with keepAlive enabled
  const axiosInstance = axios.create({
    timeout: 60000, // Increased timeout to 60 seconds for slow proxies
    proxy: {
      host: proxy.ip,
      port: proxy.port,
      protocol: proxy.protocol,
      auth: proxy.username && proxy.password ? {
        username: proxy.username,
        password: proxy.password
      } : undefined
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/jxl,*/*;q=0.8',
      'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'DNT': '1',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Upgrade-Insecure-Requests': '1'
    },
    validateStatus: null,
    maxRedirects: 5,
    decompress: true,
  });
  
  // Add request interceptor for detailed logging
  axiosInstance.interceptors.request.use(
    config => {
      console.log(`Отправка запроса через прокси ${proxy.ip}:${proxy.port} к: ${config.url}`);
      return config;
    },
    error => {
      console.error(`Ошибка при подготовке запроса через прокси ${proxy.ip}:${proxy.port}:`, error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor for better error handling
  axiosInstance.interceptors.response.use(
    response => {
      console.log(`Получен ответ от ${response.config.url} через прокси ${proxy.ip}:${proxy.port}: ${response.status}`);
      return response;
    },
    error => {
      console.error(`Ошибка ответа через прокси ${proxy.ip}:${proxy.port}:`, 
        error.code || error.message || 'Неизвестная ошибка');
      return Promise.reject(error);
    }
  );

  return axiosInstance;
}
