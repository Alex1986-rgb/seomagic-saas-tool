
import axios, { AxiosResponse } from 'axios';
import { setupAxiosInstance } from '../utils/axiosConfig';
import type { Proxy } from '../types';
import { UrlTestResult } from './types';
import { isSuccessStatus, getStatusDescription, formatErrorDetail } from './urlTestUtils';

/**
 * Makes an HTTP request to test a URL with optional proxy
 */
export async function makeRequest(
  url: string,
  proxy?: Proxy,
  timeout: number = 20000,
): Promise<UrlTestResult> {
  try {
    let axiosInstance;
    
    if (proxy) {
      axiosInstance = setupAxiosInstance(proxy);
    } else {
      axiosInstance = axios.create({
        timeout,
        validateStatus: () => true,
        maxRedirects: 5,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
          'Cache-Control': 'no-cache',
        }
      });
    }
    
    const response = await axiosInstance.get(url, {
      timeout,
      validateStatus: () => true
    });
    
    const statusDescription = getStatusDescription(response.status);
    const isSuccess = isSuccessStatus(response.status);
    
    return {
      url,
      status: response.status,
      proxy: proxy ? `${proxy.ip}:${proxy.port}` : undefined,
      success: isSuccess,
      errorDetails: isSuccess ? undefined : statusDescription
    };
  } catch (error) {
    const errorDetails = formatErrorDetail(error);
    
    return {
      url,
      status: error.response?.status || 0,
      error: error.message,
      errorDetails,
      proxy: proxy ? `${proxy.ip}:${proxy.port}` : undefined,
      success: false
    };
  }
}
