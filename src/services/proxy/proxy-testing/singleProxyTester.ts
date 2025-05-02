
import type { Proxy } from '../types';
import { setupAxiosInstance } from '../utils/axiosConfig';
import { TEST_URLS } from './config';
import { getRandomUserAgent } from './utils';

/**
 * Тестирование одиночного прокси с множественными попытками и URL
 */
export async function testProxy(
  proxy: Proxy, 
  testUrl: string = TEST_URLS[0],
  timeout: number = 10000,
  retries: number = 2
): Promise<Proxy> {
  const updatedProxy: Proxy = { 
    ...proxy, 
    status: 'testing', 
    lastChecked: new Date() 
  };
  
  let attemptsMade = 0;
  let lastError: string | undefined = undefined;
  
  // Пробуем с несколькими URL, если первый не сработает
  const urlsToTry = [testUrl, ...TEST_URLS.filter(url => url !== testUrl)];
  let urlIndex = 0;
  
  while (attemptsMade < retries && urlIndex < urlsToTry.length) {
    const currentUrl = urlsToTry[urlIndex];
    attemptsMade++;
    
    try {
      const startTime = Date.now();
      const axiosInstance = setupAxiosInstance(proxy, currentUrl);
      
      // Оптимизированные настройки запроса с расширенными заголовками
      const response = await axiosInstance.get(currentUrl, {
        validateStatus: (status) => true,
        maxRedirects: 5,
        timeout,
        headers: {
          'User-Agent': getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive'
        }
      });
      
      const endTime = Date.now();
      const speed = endTime - startTime;
      
      if (response.status >= 200 && response.status < 400) {
        // Проверяем, содержит ли ответ IP-адрес для подтверждения работы прокси
        const responseData = typeof response.data === 'string' 
          ? response.data.trim() 
          : JSON.stringify(response.data);
          
        // Базовая проверка, что ответ содержит IP-адрес
        if (responseData.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
          updatedProxy.status = 'active';
          updatedProxy.speed = speed;
          updatedProxy.lastSeen = new Date();
          updatedProxy.lastError = undefined;
          updatedProxy.checkedUrl = currentUrl;
          return updatedProxy; // Возвращаем при успехе
        } else {
          lastError = `Ответ не содержит IP (${currentUrl})`;
          urlIndex++;
        }
      } else {
        lastError = `HTTP статус ${response.status} (${currentUrl})`;
        urlIndex++;
      }
    } catch (error) {
      let errorMessage = error.message || 'Неизвестная ошибка';
      
      if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED' || errorMessage.includes('timeout')) {
        errorMessage = `Превышено время ожидания (${currentUrl})`;
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = `Соединение отклонено (${currentUrl})`;
      } else if (error.code === 'ENOTFOUND') {
        errorMessage = `DNS не смог разрешить хост (${currentUrl})`;
      }
      
      lastError = errorMessage;
      
      // Если ошибка с текущим URL, пробуем следующий URL
      if (attemptsMade >= retries) {
        urlIndex++;
        attemptsMade = 0; // Сбросим счетчик попыток для следующего URL
      }
      
      // Небольшая задержка перед повторной попыткой
      if (attemptsMade < retries || urlIndex < urlsToTry.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }
  
  // После всех попыток, если все неудачны
  updatedProxy.status = 'inactive';
  updatedProxy.speed = undefined;
  updatedProxy.lastError = lastError;
  
  return updatedProxy;
}
