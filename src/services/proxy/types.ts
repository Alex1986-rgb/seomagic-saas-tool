
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
  username?: string; // Добавляем опциональное поле для имени пользователя
  password?: string; // Добавляем опциональное поле для пароля
  lastSeen?: Date;   // Добавляем опциональное поле для последнего успешного подключения
  lastError?: string; // Добавляем опциональное поле для описания ошибки
  checkedUrl?: string; // Добавляем опциональное поле для URL, который был проверен
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
  proxy?: string;     // Добавляем информацию об использованном прокси
  time?: number;      // Добавляем время выполнения запроса
  error?: string;     // Добавляем информацию об ошибке
}

// Реэкспортируем UrlTestResult из модуля url-testing для согласованности
export { UrlTestResult } from './url-testing/urlTester';
