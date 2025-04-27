import axios, { AxiosInstance } from 'axios';
import type { Proxy } from '../types';
import https from 'https';
import http from 'http';

export function setupAxiosInstance(proxy: Proxy, testUrl: string = 'https://api.ipify.org/'): AxiosInstance {
  // Создаем агенты с keepAlive для оптимизации соединений
  const httpsAgent = new https.Agent({ 
    keepAlive: true,
    keepAliveMsecs: 3000,
    maxSockets: 100,
    maxFreeSockets: 10,
    timeout: 30000
  });
  
  const httpAgent = new http.Agent({ 
    keepAlive: true,
    keepAliveMsecs: 3000,
    maxSockets: 100,
    maxFreeSockets: 10,
    timeout: 30000
  });
  
  // Создаем кастомный экземпляр с улучшенными настройками
  const axiosInstance = axios.create({
    timeout: 30000, // Более оптимальный таймаут
    httpAgent,
    httpsAgent,
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
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Upgrade-Insecure-Requests': '1'
    },
    validateStatus: null, // Позволяем обрабатывать все статусы ответа
    maxRedirects: 5,
    decompress: true,
  });
  
  // Сокращаем логирование для повышения производительности
  axiosInstance.interceptors.request.use(
    config => {
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
}
