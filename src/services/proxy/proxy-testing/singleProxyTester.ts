
import type { Proxy } from '../types';

export async function testProxy(proxy: Proxy, testUrl: string = 'https://api.ipify.org/'): Promise<Proxy> {
  // Implementation would normally test the proxy here
  // This is a mock implementation
  
  const updatedProxy = { ...proxy };
  
  // Random success/failure for demonstration
  const success = Math.random() > 0.5;
  
  if (success) {
    updatedProxy.status = 'active';
    updatedProxy.speed = Math.floor(Math.random() * 1000) + 100;
    updatedProxy.lastSeen = new Date();
    updatedProxy.lastError = undefined;
    updatedProxy.checkedUrl = testUrl;
  } else {
    updatedProxy.status = 'inactive';
    updatedProxy.lastError = 'Connection timeout';
    updatedProxy.checkedUrl = testUrl;
  }
  
  updatedProxy.lastChecked = new Date();
  
  return updatedProxy;
}
