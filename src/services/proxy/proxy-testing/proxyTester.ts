
/**
 * Главный модуль для тестирования прокси
 * Экспортирует все необходимые функции для тестирования отдельных прокси и пакетов
 */

import { testProxy } from './singleProxyTester';
import { batchTestProxies } from './batchProxyTester';

export { testProxy, batchTestProxies };
export * from './config';
