
// Типы для прокси-сервисов
export interface Proxy {
  id: string;
  ip: string;
  port: number;
  protocol: 'http' | 'https' | 'socks4' | 'socks5';
  country?: string;
  anonymity?: 'transparent' | 'anonymous' | 'elite';
  speed?: number; // в миллисекундах
  uptime?: number; // процент работоспособности
  lastChecked: Date;
  status: 'active' | 'inactive' | 'testing';
  source?: string;
}

export interface ProxySources {
  [key: string]: {
    url: string;
    enabled: boolean;
    parseFunction: (data: string) => Proxy[];
  }
}

export interface PingResult {
  url: string;
  rpc: string;
  success: boolean;
  message: string;
}
