
import type { Proxy } from '../types';
import { UrlTestResult } from '../types';

export async function makeRequest(url: string, proxy?: Proxy, timeout: number = 20000): Promise<UrlTestResult> {
  // Enhanced mock implementation with more realistic behavior
  
  const startTime = Date.now();
  
  // Simulate random success/fail with different status codes
  // Give proxies a slightly lower success rate than direct connections
  const successRateModifier = proxy ? 0.8 : 1;
  const success = Math.random() > 0.3 * successRateModifier;
  
  const statusOptions = [
    { status: 200, weight: 70 },  // OK - most common
    { status: 301, weight: 5 },   // Moved Permanently
    { status: 302, weight: 5 },   // Found
    { status: 400, weight: 5 },   // Bad Request
    { status: 403, weight: 5 },   // Forbidden
    { status: 404, weight: 5 },   // Not Found
    { status: 500, weight: 3 },   // Internal Server Error
    { status: 502, weight: 1 },   // Bad Gateway
    { status: 503, weight: 1 }    // Service Unavailable
  ];
  
  // Select a status code based on weights
  let weightSum = 0;
  const weights = statusOptions.map(option => {
    weightSum += option.weight;
    return weightSum;
  });
  
  let status = 200; // Default to 200
  if (!success) {
    // Pick a random weighted status code for failure
    const rand = Math.floor(Math.random() * weightSum);
    for (let i = 0; i < weights.length; i++) {
      if (rand < weights[i]) {
        status = statusOptions[i].status;
        break;
      }
    }
  }
  
  // Add a variable delay to simulate network request
  // Proxies are generally slower than direct connections
  const delay = proxy
    ? 500 + Math.random() * 2000  // 500-2500ms for proxies
    : 100 + Math.random() * 800;  // 100-900ms for direct connections
  
  await new Promise(resolve => setTimeout(resolve, delay));
  
  const endTime = Date.now();
  
  return {
    url,
    status,
    success: status >= 200 && status < 300,
    proxy: proxy ? `${proxy.ip}:${proxy.port}` : undefined,
    timestamp: new Date().toISOString(),
    direct: !proxy,
    timing: {
      start: startTime,
      end: endTime,
      duration: endTime - startTime
    }
  };
}

// Implement the makeXmlRpcRequest function with more realistic behavior
export async function makeXmlRpcRequest(
  rpcEndpoint: string, 
  xmlrpcRequest: string, 
  proxy: Proxy | null,
  timeout: number = 20000,
  retries: number = 1
): Promise<{
  success: boolean;
  error?: string;
  errorDetails?: string;
  data?: any;
}> {
  // Enhanced mock implementation for XML-RPC requests
  const startTime = Date.now();
  
  // Simulate random success/failure with more realistic distribution
  // Give proxies a lower success rate than direct connections
  const successRate = proxy ? 0.65 : 0.85;
  const success = Math.random() < successRate;
  
  // Add a variable delay to simulate network request
  const delay = proxy 
    ? 800 + Math.random() * 2500  // Proxy connections are typically slower (800-3300ms)
    : 300 + Math.random() * 1200; // Direct connections are faster (300-1500ms)
  
  await new Promise(resolve => setTimeout(resolve, delay));
  
  if (success) {
    // Create a more detailed success response
    return {
      success: true,
      data: {
        flerror: false,
        message: "Weblog ping successful",
        pingTime: Date.now() - startTime,
        endpoint: rpcEndpoint,
        timestamp: new Date().toISOString(),
        proxyUsed: proxy ? `${proxy.ip}:${proxy.port}` : "none",
        responseCode: 200,
        responseDetails: {
          weblogName: "Sample Weblog",
          weblogUrl: "https://example.com/blog",
          pingServiceName: rpcEndpoint.includes("pingomatic") ? "Ping-O-Matic" : "Generic XML-RPC Service",
          timestamp: new Date().toISOString()
        }
      }
    };
  } else {
    // Create more detailed and realistic error responses
    const errorTypes = [
      { error: "Connection refused", details: "Could not establish connection to RPC endpoint", weight: 25 },
      { error: "Timeout error", details: "Connection timed out after waiting for response", weight: 30 },
      { error: "XML-RPC fault", details: "Server responded with fault code: 32 - Item Not Found", weight: 15 },
      { error: "Invalid response", details: "Server response could not be parsed as valid XML-RPC", weight: 15 },
      { error: "Network error", details: "A network error occurred during the request", weight: 15 }
    ];
    
    // Select error based on weighted probability
    let weightSum = 0;
    const weights = errorTypes.map(type => {
      weightSum += type.weight;
      return weightSum;
    });
    
    const rand = Math.floor(Math.random() * weightSum);
    let selectedError = errorTypes[0];
    for (let i = 0; i < weights.length; i++) {
      if (rand < weights[i]) {
        selectedError = errorTypes[i];
        break;
      }
    }
    
    // Add more detailed error information
    return {
      success: false,
      error: selectedError.error,
      errorDetails: selectedError.details + 
        (proxy ? ` (via proxy ${proxy.ip}:${proxy.port})` : " (direct connection)") +
        ` after ${Math.round((Date.now() - startTime) / 10) / 100}s`
    };
  }
}
