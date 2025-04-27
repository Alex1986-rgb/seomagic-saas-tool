
import type { Proxy } from '../types';
import { setupAxiosInstance } from '../utils/axiosConfig';

export async function testProxy(proxy: Proxy, testUrl: string = 'https://api.ipify.org/'): Promise<Proxy> {
  const updatedProxy: Proxy = { 
    ...proxy, 
    status: 'testing', 
    lastChecked: new Date() 
  };
  
  try {
    const startTime = Date.now();
    const axiosInstance = setupAxiosInstance(proxy, testUrl);
    
    const response = await axiosInstance.get(testUrl, {
      validateStatus: (status) => true,
      maxRedirects: 5,
      timeout: 15000,
    });
    
    const endTime = Date.now();
    const speed = endTime - startTime;
    
    if (response.status >= 200 && response.status < 400) {
      updatedProxy.status = 'active';
      updatedProxy.speed = speed;
      console.log(`Прокси ${proxy.ip}:${proxy.port} работает, скорость: ${speed}ms, статус: ${response.status}`);
    } else {
      updatedProxy.status = 'inactive';
      updatedProxy.speed = speed;
      console.log(`Прокси ${proxy.ip}:${proxy.port} ответил с неприемлемым статусом: ${response.status}`);
    }
    
  } catch (error) {
    let errorMessage = error.message || 'Неизвестная ошибка';
    
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED' || errorMessage.includes('timeout')) {
      errorMessage = 'Превышено время ожидания';
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Соединение отклонено';
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'DNS не смог разрешить хост';
    }
    
    console.error(`Прокси ${proxy.ip}:${proxy.port} не работает: ${errorMessage}`);
    updatedProxy.status = 'inactive';
    updatedProxy.speed = undefined;
  }
  
  return updatedProxy;
}
