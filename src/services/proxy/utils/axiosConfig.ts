
import axios, { AxiosInstance } from 'axios';
import type { Proxy } from '../types';

export function setupAxiosInstance(proxy: Proxy, testUrl: string = 'https://api.ipify.org/'): AxiosInstance {
  return axios.create({
    timeout: 15000,
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
      'Accept': 'text/plain,*/*;q=0.01',
      'Accept-Language': 'en-US,en;q=0.9',
      'Connection': 'keep-alive',
      'DNT': '1',
    },
    validateStatus: null
  });
}
