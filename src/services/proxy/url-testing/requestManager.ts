
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { setupAxiosInstance } from '../utils/axiosConfig';
import type { Proxy } from '../types';
import { UrlTestResult } from './types';
import { isSuccessStatus, getStatusDescription, formatErrorDetail } from './urlTestUtils';

/**
 * Makes an HTTP request to test a URL with optional proxy with retry logic
 */
export async function makeRequest(
  url: string,
  proxy?: Proxy,
  timeout: number = 20000,
  retries: number = 2
): Promise<UrlTestResult> {
  let retryCount = 0;
  let lastError: any = null;
  
  while (retryCount <= retries) {
    try {
      let axiosInstance;
      const config: AxiosRequestConfig = {
        timeout,
        validateStatus: () => true,
        maxRedirects: 5,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
          'Cache-Control': 'no-cache',
        }
      };
      
      if (proxy) {
        axiosInstance = setupAxiosInstance(proxy);
      } else {
        axiosInstance = axios.create(config);
      }
      
      const response = await axiosInstance.get(url, config);
      
      const statusDescription = getStatusDescription(response.status);
      const isSuccess = isSuccessStatus(response.status);
      
      const responsePreview = response.data && typeof response.data === 'string' 
        ? response.data.substring(0, 200) 
        : JSON.stringify(response.data).substring(0, 200);
      
      return {
        url,
        status: response.status,
        proxy: proxy ? `${proxy.ip}:${proxy.port}` : undefined,
        success: isSuccess,
        errorDetails: isSuccess ? undefined : statusDescription,
        responseData: responsePreview,
        retryCount
      };
    } catch (error) {
      lastError = error;
      retryCount++;
      
      // Only retry if we haven't exceeded max retries
      if (retryCount <= retries) {
        console.log(`Retrying request to ${url} (${retryCount}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
      }
    }
  }
  
  // If all retries failed, return error result
  const errorDetails = formatErrorDetail(lastError);
  
  return {
    url,
    status: lastError.response?.status || 0,
    error: lastError.message || 'Maximum retry attempts reached',
    errorDetails,
    proxy: proxy ? `${proxy.ip}:${proxy.port}` : undefined,
    success: false,
    retryCount
  };
}

/**
 * Makes a POST request specifically for XML-RPC pings with enhanced error handling
 */
export async function makeXmlRpcRequest(
  url: string,
  xmlData: string,
  proxy?: Proxy,
  timeout: number = 20000,
  retries: number = 2
): Promise<UrlTestResult> {
  let retryCount = 0;
  let lastError: any = null;
  
  while (retryCount <= retries) {
    try {
      let axiosInstance;
      const config: AxiosRequestConfig = {
        timeout,
        validateStatus: () => true,
        maxRedirects: 5,
        headers: {
          'Content-Type': 'text/xml',
          'User-Agent': 'Mozilla/5.0 (compatible; SeoToolkit/1.0; +http://example.com)',
          'Accept': 'text/xml,application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8',
          'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
          'Cache-Control': 'no-cache',
        }
      };
      
      if (proxy) {
        axiosInstance = setupAxiosInstance(proxy);
      } else {
        axiosInstance = axios.create(config);
      }
      
      const response = await axiosInstance.post(url, xmlData, config);
      
      // Check for XML-RPC fault response
      const hasFault = response.data && typeof response.data === 'string' && 
                     response.data.includes('<fault>');
                     
      // Success only if status code is successful AND there's no fault in the response
      const isSuccess = isSuccessStatus(response.status) && !hasFault;
      
      let errorDetails;
      if (hasFault) {
        errorDetails = 'XML-RPC сервер вернул ошибку в ответе';
      } else if (!isSuccessStatus(response.status)) {
        errorDetails = getStatusDescription(response.status);
      }
      
      const responsePreview = response.data && typeof response.data === 'string' 
        ? response.data.substring(0, 200) 
        : '';
      
      return {
        url,
        status: response.status,
        proxy: proxy ? `${proxy.ip}:${proxy.port}` : undefined,
        success: isSuccess,
        errorDetails,
        responseData: responsePreview,
        retryCount
      };
    } catch (error) {
      lastError = error;
      retryCount++;
      
      // Only retry if we haven't exceeded max retries
      if (retryCount <= retries) {
        console.log(`Retrying XML-RPC request to ${url} (${retryCount}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
      }
    }
  }
  
  // If all retries failed, return error result
  const errorDetails = formatErrorDetail(lastError);
  
  return {
    url,
    status: lastError?.response?.status || 0,
    error: lastError?.message || 'Maximum retry attempts reached',
    errorDetails: errorDetails || 'Network Error',
    proxy: proxy ? `${proxy.ip}:${proxy.port}` : undefined,
    success: false,
    retryCount
  };
}
