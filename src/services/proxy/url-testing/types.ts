
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
}
