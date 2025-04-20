
import axios from 'axios';
import { PageContent } from '../audit/optimization/types';

interface OpenAIConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

interface OpenAIPrompt {
  task: 'meta_description' | 'meta_keywords' | 'title' | 'content' | 'headings' | 'alt_tags';
  content: string;
  url?: string;
  keywords?: string[];
  locale?: string;
}

const DEFAULT_CONFIG: OpenAIConfig = {
  apiKey: '',
  model: 'gpt-4o',
  temperature: 0.7,
  maxTokens: 1000
};

export class OpenAIIntegration {
  private config: OpenAIConfig;
  
  constructor(apiKey: string, config: Partial<OpenAIConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config, apiKey };
  }
  
  /**
   * Оптимизирует страницу с помощью OpenAI
   */
  async optimizePage(page: PageContent, prompt: string): Promise<PageContent> {
    // Создаем копию страницы, которую будем оптимизировать
    const optimizedPage: PageContent = { ...page };
    
    try {
      // Оптимизируем мета-описание
      if (!page.meta.description) {
        optimizedPage.meta.description = await this.generateMetaDescription(page, prompt);
      }
      
      // Оптимизируем ключевые слова
      if (!page.meta.keywords) {
        optimizedPage.meta.keywords = await this.generateMetaKeywords(page, prompt);
      }
      
      // Оптимизируем заголовки если нужно
      if (page.headings.h1.length === 0 || page.headings.h2.length === 0) {
        const headings = await this.generateHeadings(page, prompt);
        if (page.headings.h1.length === 0 && headings.h1.length > 0) {
          optimizedPage.headings.h1 = headings.h1;
        }
        if (page.headings.h2.length === 0 && headings.h2.length > 0) {
          optimizedPage.headings.h2 = headings.h2;
        }
      }
      
      // Оптимизируем контент если он слишком короткий
      if (page.wordCount < 300) {
        optimizedPage.optimized = {
          content: await this.optimizeContent(page, prompt),
          meta: {
            description: optimizedPage.meta.description || null,
            keywords: optimizedPage.meta.keywords || null
          },
          score: 95 // Условная оценка качества
        };
      }
      
      return optimizedPage;
    } catch (error) {
      console.error('Error optimizing page with OpenAI:', error);
      
      // В случае ошибки возвращаем исходную страницу
      return page;
    }
  }
  
  /**
   * Генерирует мета-описание для страницы
   */
  private async generateMetaDescription(page: PageContent, prompt: string): Promise<string> {
    const openAIPrompt: OpenAIPrompt = {
      task: 'meta_description',
      content: page.content.substring(0, 1000),
      url: page.url
    };
    
    const systemMessage = `
      Ты — профессиональный SEO-специалист. Твоя задача — создать оптимизированное мета-описание для веб-страницы.
      Мета-описание должно:
      - Быть длиной 150-160 символов
      - Содержать ключевые слова из контента
      - Быть привлекательным для пользователей
      - Точно отражать содержимое страницы
      
      Дополнительные требования: ${prompt}
    `;
    
    return this.callOpenAI(systemMessage, JSON.stringify(openAIPrompt));
  }
  
  /**
   * Генерирует мета-ключевые слова для страницы
   */
  private async generateMetaKeywords(page: PageContent, prompt: string): Promise<string> {
    const openAIPrompt: OpenAIPrompt = {
      task: 'meta_keywords',
      content: page.content.substring(0, 1000),
      url: page.url
    };
    
    const systemMessage = `
      Ты — профессиональный SEO-специалист. Твоя задача — создать оптимизированные ключевые слова для веб-страницы.
      Ключевые слова должны:
      - Включать 5-7 релевантных ключевых слов/фраз
      - Быть разделены запятыми
      - Точно отражать содержимое страницы
      
      Дополнительные требования: ${prompt}
    `;
    
    return this.callOpenAI(systemMessage, JSON.stringify(openAIPrompt));
  }
  
  /**
   * Генерирует заголовки для страницы
   */
  private async generateHeadings(page: PageContent, prompt: string): Promise<{h1: string[], h2: string[], h3: string[]}> {
    const openAIPrompt: OpenAIPrompt = {
      task: 'headings',
      content: page.content.substring(0, 1500),
      url: page.url
    };
    
    const systemMessage = `
      Ты — профессиональный SEO-специалист. Твоя задача — создать оптимизированные заголовки для веб-страницы.
      Заголовки должны:
      - Включать один H1, 3-5 H2, и необходимое количество H3
      - Содержать ключевые слова
      - Быть структурированными и логичными
      - Точно отражать содержимое страницы
      
      Отформатируй ответ как JSON с массивами h1, h2, h3.
      
      Дополнительные требования: ${prompt}
    `;
    
    const result = await this.callOpenAI(systemMessage, JSON.stringify(openAIPrompt));
    
    try {
      return JSON.parse(result);
    } catch (error) {
      console.error('Error parsing headings JSON:', error);
      return { h1: [], h2: [], h3: [] };
    }
  }
  
  /**
   * Оптимизирует контент страницы
   */
  private async optimizeContent(page: PageContent, prompt: string): Promise<string> {
    const openAIPrompt: OpenAIPrompt = {
      task: 'content',
      content: page.content,
      url: page.url
    };
    
    const systemMessage = `
      Ты — профессиональный SEO-копирайтер. Твоя задача — оптимизировать контент веб-страницы.
      Оптимизированный контент должен:
      - Быть хорошо структурированным
      - Содержать ключевые слова в естественной форме
      - Быть привлекательным для пользователей
      - Соответствовать требованиям SEO
      - Сохранять основной смысл исходного контента
      
      Дополнительные требования: ${prompt}
    `;
    
    return this.callOpenAI(systemMessage, JSON.stringify(openAIPrompt));
  }
  
  /**
   * Вызывает OpenAI API
   */
  private async callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.config.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error;
    }
  }
}
