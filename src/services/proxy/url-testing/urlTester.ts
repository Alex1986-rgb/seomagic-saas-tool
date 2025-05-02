
import type { Proxy } from '../types';
import { UrlTestResult, UrlTestConfig } from '../types';
import { ProxySelector } from './proxySelector';
import { ConcurrencyManager } from './concurrencyManager';
import { makeRequest } from './requestManager';

// Re-export types for compatibility
export type { UrlTestResult, UrlTestConfig } from '../types';

// Default configuration values
const DEFAULT_CONFIG: UrlTestConfig = {
  timeout: 20000,
  maxRedirects: 5,
  retries: 2,
  retryDelay: 1000,
  maxConcurrentRequests: 10
};

/**
 * Tests a list of URLs with optional proxy support
 */
export async function testUrls(
  urls: string[], 
  proxies: Proxy[], 
  useProxies: boolean = true,
  onProgress?: (url: string, status: number, proxy?: string, errorDetails?: string) => void,
  config?: Partial<UrlTestConfig>
): Promise<UrlTestResult[]> {
  const results: UrlTestResult[] = [];
  const activeProxies = proxies.filter(p => p.status === 'active');
  
  // Merge provided config with defaults
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Override useProxies if forceDirect is specified
  if (mergedConfig.forceDirect === true) {
    useProxies = false;
    console.log('Forced direct connection mode enabled, ignoring proxies');
  }
  
  if (useProxies && activeProxies.length === 0) {
    throw new Error('Нет активных прокси для использования');
  }

  // Setup concurrency manager
  const concurrencyManager = new ConcurrencyManager(
    mergedConfig.maxConcurrentRequests
  );
  
  // Setup proxy selector if using proxies
  const proxySelector = useProxies ? new ProxySelector(activeProxies) : null;
  
  // Process all URLs in parallel with concurrency control
  const testPromises = urls.map(url => concurrencyManager.executeWithThrottle(async () => {
    let currentProxy: Proxy | undefined;
    let retries = mergedConfig.retries;
    let result: UrlTestResult | null = null;
    
    // Retry loop
    while (retries >= 0 && !result) {
      try {
        // Get a proxy if needed
        if (useProxies && proxySelector) {
          currentProxy = proxySelector.getRandomProxy();
        }
        
        // Make the request
        result = await makeRequest(url, currentProxy, mergedConfig.timeout);
        
        // Flag direct connections
        if (!currentProxy) {
          result.direct = true;
        }
        
        // Report progress
        if (onProgress) {
          onProgress(
            url, 
            result.status, 
            currentProxy ? `${currentProxy.ip}:${currentProxy.port}` : undefined,
            result.errorDetails
          );
        }
        
        // Add to results
        results.push(result);
        
      } catch (error) {
        // If we have retries left and we're using proxies, try again with a different proxy
        if (retries > 0 && useProxies) {
          retries--;
          await new Promise(resolve => setTimeout(resolve, mergedConfig.retryDelay));
        } else if (mergedConfig.failoverToDirect && useProxies) {
          // Try direct connection as last resort
          console.log(`Failing over to direct connection for ${url} after proxy attempts failed`);
          try {
            result = await makeRequest(url, undefined, mergedConfig.timeout);
            result.direct = true;
            
            if (onProgress) {
              onProgress(
                url, 
                result.status,
                'Direct connection',
                result.errorDetails
              );
            }
            
            results.push(result);
          } catch (directError) {
            // Both proxy and direct failed
            const errorResult: UrlTestResult = {
              url,
              status: 0,
              error: directError.message || "Unknown error",
              errorDetails: directError.message || "Unknown error",
              proxy: "Direct connection failed",
              success: false,
              direct: true
            };
            
            if (onProgress) {
              onProgress(
                url, 
                errorResult.status,
                errorResult.proxy,
                errorResult.errorDetails
              );
            }
            
            results.push(errorResult);
          }
          break;
        } else {
          // No more retries, add error result
          const errorResult: UrlTestResult = {
            url,
            status: 0,
            error: error.message || "Unknown error",
            errorDetails: error.message || "Unknown error",
            proxy: currentProxy ? `${currentProxy.ip}:${currentProxy.port}` : "Direct connection",
            success: false,
            direct: !currentProxy
          };
          
          if (onProgress) {
            onProgress(
              url, 
              errorResult.status,
              errorResult.proxy,
              errorResult.errorDetails
            );
          }
          
          results.push(errorResult);
          break;
        }
      }
    }
    
    // Small delay between URL tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }));
  
  // Wait for all URL tests to complete
  await Promise.all(testPromises);
  
  return results;
}
