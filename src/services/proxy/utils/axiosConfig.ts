
import axios, { AxiosInstance } from 'axios';
import { Proxy } from '../types';

// Создание экземпляра Axios с настройками прокси
export function setupAxiosInstance(proxy: Proxy, targetUrl: string = 'https://api.ipify.org/'): AxiosInstance {
  // Создаем URL объект для получения протокола (http/https)
  const urlProtocol = new URL(targetUrl).protocol.replace(':', '');
  
  // Формируем URI прокси в зависимости от типа
  let proxyUri: string;
  
  // Если есть логин и пароль
  if (proxy.username && proxy.password) {
    proxyUri = `${proxy.protocol}://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`;
  } else {
    proxyUri = `${proxy.protocol}://${proxy.ip}:${proxy.port}`;
  }
  
  // Настройки прокси для axios
  const proxyConfig = {
    host: proxy.ip,
    port: proxy.port,
    protocol: proxy.protocol,
    auth: proxy.username && proxy.password ? {
      username: proxy.username,
      password: proxy.password
    } : undefined
  };
  
  // Создаем экземпляр axios с настройками
  const instance = axios.create({
    proxy: proxyConfig,
    timeout: 15000, // 15 секунд тайм-аут
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive'
    }
  });
  
  // Добавляем интерсептор для отладки запросов через прокси
  instance.interceptors.request.use(config => {
    // console.log(`Запрос через прокси ${proxy.ip}:${proxy.port} к ${config.url}`);
    return config;
  }, error => {
    // console.error(`Ошибка запроса через прокси ${proxy.ip}:${proxy.port}:`, error);
    return Promise.reject(error);
  });
  
  return instance;
}

export function getRandomUserAgent(): string {
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
