import { PageData } from './crawlerService';
import { OptimizationOptions, OptimizationResult } from './openai/types';
import { openAIApiClient } from './openai/apiClient';
import { optimizationService } from './openai/optimizationService';

interface AISystemSettings {
  auto_optimize: boolean;
  auto_fix_errors: boolean;
  content_quality: 'standard' | 'premium' | 'ultimate';
  max_tokens: number;
  temperature: number;
}

class OpenAIService {
  private systemSettings: AISystemSettings = {
    auto_optimize: true,
    auto_fix_errors: true,
    content_quality: 'premium',
    max_tokens: 2500,
    temperature: 0.7
  };

  constructor() {
    // Загружаем настройки при инициализации
    this.loadSettings();
  }
  
  private loadSettings(): void {
    const savedSettings = localStorage.getItem('ai_settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        this.systemSettings = { ...this.systemSettings, ...parsedSettings };
      } catch (e) {
        console.error('Ошибка при загрузке настроек AI:', e);
      }
    }
  }

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
  
  getSetting<K extends keyof AISystemSettings>(key: K): AISystemSettings[K] {
    return this.systemSettings[key];
  }

  getSettings(): AISystemSettings {
    return { ...this.systemSettings };
  }
  
  async optimizePage(pageData: PageData, options: OptimizationOptions): Promise<OptimizationResult> {
    const model = this.getModel();
    return optimizationService.optimizePage(pageData, { 
      ...options, 
      model,
      temperature: this.systemSettings.temperature,
      max_tokens: this.systemSettings.max_tokens,
    });
  }
  
  async generateContent(prompt: string): Promise<string> {
    return openAIApiClient.makeRequest([
      { role: 'system', content: 'You are a helpful content creation assistant.' },
      { role: 'user', content: prompt }
    ], this.getModel());
  }
  
  async fixErrors(html: string, errors: string[]): Promise<string> {
    if (!this.systemSettings.auto_fix_errors) {
      console.log('Автоматическое исправление ошибок отключено в настройках');
      return html;
    }
    
    const response = await openAIApiClient.makeRequest([
      { 
        role: 'system', 
        content: 'You are a helpful HTML and technical error fixing assistant. Fix the provided HTML based on the list of errors without changing the visual design or content meaning.' 
      },
      { 
        role: 'user', 
        content: `Please fix the following errors in this HTML:\n${errors.join('\n')}\n\nHTML:\n${html}` 
      }
    ], this.getModel());
    
    // Извлекаем HTML код из ответа
    const htmlMatch = response.match(/<html[\s\S]*<\/html>/i);
    if (htmlMatch) {
      return htmlMatch[0];
    }
    
    return response;
  }
  
  async improveContent(content: string, keywords: string[] = []): Promise<string> {
    let qualityPrompt = '';
    
    switch (this.systemSettings.content_quality) {
      case 'standard':
        qualityPrompt = 'Provide a good quality improvement that focuses on SEO.';
        break;
      case 'premium':
        qualityPrompt = 'Provide a premium quality improvement with balanced attention to SEO and readability. Add detailed information where appropriate.';
        break;
      case 'ultimate':
        qualityPrompt = 'Provide the highest quality content optimization with expert-level insights, perfect SEO, excellent readability, and fully detailed information.';
        break;
    }
    
    const response = await openAIApiClient.makeRequest([
      { 
        role: 'system', 
        content: `You are an expert content optimization assistant. ${qualityPrompt}`
      },
      { 
        role: 'user', 
        content: `Please improve this content. ${keywords.length > 0 ? 'Focus on these keywords: ' + keywords.join(', ') : ''}
        
        Content:
        ${content}`
      }
    ], this.getModel());
    
    return response;
  }
}

export const openaiService = new OpenAIService();
