
/**
 * Configuration for proxy testing
 */

// Расширенная конфигурация для параллельного тестирования
export const MAX_CONCURRENT_TESTS = 100;

// Конфигурация таймаутов для различных сценариев
export const TIMEOUT_VALUES = {
  FAST: 6000,     // Ускоренный тайм-аут для быстрой проверки
  NORMAL: 10000,  // Стандартный тайм-аут, уменьшен для ускорения
  EXTENDED: 15000 // Расширенный тайм-аут для полной проверки
};

// Список тестовых URL для проверки прокси
export const TEST_URLS = [
  'https://api.ipify.org/',
  'https://ifconfig.io/ip',
  'https://httpbin.org/ip',
  'https://checkip.amazonaws.com/'
];
