
/**
 * Types for URL testing functionality
 */

/**
 * Result of testing a URL
 */
export interface UrlTestResult {
  url: string;
  status: number;
  error?: string;
  errorDetails?: string;
  proxy?: string;
  success: boolean;
  timestamp?: string;
  responseData?: string; // Added to store the response body for debugging
  retryCount?: number;   // Added to track retries
  direct?: boolean;      // Added to indicate if this was a direct connection (no proxy)
  timing?: {             // Added to track timing information
    start: number;
    end: number;
    duration: number;
  }
}

/**
 * Configuration for URL testing
 */
export interface UrlTestConfig {
  timeout?: number;
  maxRedirects?: number;
  retries?: number;
  retryDelay?: number;
  maxConcurrentRequests?: number;
  failoverToDirect?: boolean; // Added to allow falling back to direct connections
  forceDirect?: boolean;      // Added to force direct connections without proxies
}

/**
 * Options for ping requests
 */
export interface PingOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  useProxy?: boolean;
  fallbackToDirect?: boolean;
  forceDirect?: boolean; // Added for forcing direct connections
}

/**
 * Результат пинга
 */
export interface PingResult {
  url: string;
  rpc: string;
  success: boolean;
  message: string;
  proxy?: string;
  time?: number;
  error?: string;
  direct?: boolean; // Added flag for direct connection
}

/**
 * Proxy interface defining a proxy configuration
 */
export interface Proxy {
  id: string;
  ip: string;
  port: number;
  protocol: 'http' | 'https' | 'socks4' | 'socks5';
  status: 'active' | 'inactive' | 'testing';
  username?: string;
  password?: string;
  country?: string;
  speed?: number;
  lastChecked: Date;
  lastSeen?: Date;
  source?: string;
  lastError?: string;
  checkedUrl?: string;
  anonymity?: 'transparent' | 'anonymous' | 'elite'; // Add anonymity level
  uptime?: number;
}

/**
 * Structure for proxy sources configuration
 */
export interface ProxySources {
  [key: string]: {
    url: string;
    enabled: boolean;
    parseFunction: (data: string) => any[];
  };
}
