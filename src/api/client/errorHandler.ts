
import { AxiosError } from 'axios';

export interface ApiErrorResponse {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

/**
 * Type guard for Axios errors
 */
export const isAxiosError = (error: any): error is AxiosError => {
  return error && error.isAxiosError === true;
};

/**
 * Formats API errors for consistent handling
 */
export const formatApiError = (error: unknown): ApiErrorResponse => {
  // Handle Axios errors
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError;
    return {
      message: axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data
        ? String(axiosError.response.data.message)
        : axiosError.message || 'API request failed',
      code: axiosError.response?.data && typeof axiosError.response.data === 'object' && 'code' in axiosError.response.data
        ? String(axiosError.response.data.code)
        : undefined,
      status: axiosError.response?.status,
      details: axiosError.response?.data
    };
  }
  
  // Handle standard Error objects
  if (error instanceof Error) {
    return {
      message: error.message,
      details: error
    };
  }
  
  // Handle unknown error types
  return {
    message: typeof error === 'string' ? error : 'Unknown error occurred',
    details: error
  };
};
