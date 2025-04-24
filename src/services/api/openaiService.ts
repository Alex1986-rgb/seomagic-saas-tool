
import { PageData } from './crawlerService';
import { OptimizationOptions, OptimizationResult } from './openai/types';
import { openAIApiClient } from './openai/apiClient';
import { optimizationService } from './openai/optimizationService';

class OpenAIService {
  setApiKey(key: string): void {
    openAIApiClient.setApiKey(key);
  }
  
  getApiKey(): string | null {
    return openAIApiClient.getApiKey();
  }

  setModel(model: string): void {
    localStorage.setItem('openai_model', model);
  }

  getModel(): string | null {
    return localStorage.getItem('openai_model') || 'gpt-4o-mini';
  }
  
  async optimizePage(pageData: PageData, options: OptimizationOptions): Promise<OptimizationResult> {
    const model = this.getModel();
    return optimizationService.optimizePage(pageData, { ...options, model });
  }
}

export const openaiService = new OpenAIService();
