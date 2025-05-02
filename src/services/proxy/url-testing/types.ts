
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
}
