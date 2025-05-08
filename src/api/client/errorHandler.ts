
import { AxiosError } from 'axios';

export interface ApiErrorResponse {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

/**
 * Formats API errors for consistent handling
 */
export const formatApiError = (error: unknown): ApiErrorResponse => {
  // Handle Axios errors
  if (isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message || 'API request failed',
      code: error.response?.data?.code,
      status: error.response?.status,
      details: error.response?.data
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
    message: 'Unknown error occurred',
    details: error
  };
};

/**
 * Type guard for Axios errors
 */
export const isAxiosError = (error: any): error is AxiosError => {
  return error && error.isAxiosError === true;
};
