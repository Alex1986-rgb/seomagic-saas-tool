
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Base API service for handling HTTP requests
 */
export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Make a GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.get(
        this.baseUrl ? `${this.baseUrl}${url}` : url, 
        config
      );
      return response.data;
    } catch (error) {
      console.error('GET request failed:', error);
      throw error;
    }
  }

  /**
   * Make a POST request
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.post(
        this.baseUrl ? `${this.baseUrl}${url}` : url, 
        data, 
        config
      );
      return response.data;
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  }

  /**
   * Make a PUT request
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.put(
        this.baseUrl ? `${this.baseUrl}${url}` : url, 
        data, 
        config
      );
      return response.data;
    } catch (error) {
      console.error('PUT request failed:', error);
      throw error;
    }
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.delete(
        this.baseUrl ? `${this.baseUrl}${url}` : url, 
        config
      );
      return response.data;
    } catch (error) {
      console.error('DELETE request failed:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
