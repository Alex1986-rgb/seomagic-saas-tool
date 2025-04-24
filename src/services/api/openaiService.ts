
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
  
  async optimizePage(pageData: PageData, options: OptimizationOptions): Promise<OptimizationResult> {
    return optimizationService.optimizePage(pageData, options);
  }
}

export const openaiService = new OpenAIService();

