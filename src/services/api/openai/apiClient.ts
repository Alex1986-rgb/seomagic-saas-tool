
import axios from 'axios';

class OpenAIApiClient {
  private apiKey: string | null = null;

  setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem('openai_api_key', key);
  }

  getApiKey(): string | null {
    if (this.apiKey) {
      return this.apiKey;
    }
    
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      this.apiKey = storedKey;
      return storedKey;
    }
    
    return null;
  }

  async makeRequest(messages: { role: string; content: string; }[], model?: string, options: { maxTokens?: number, temperature?: number } = {}): Promise<any> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not set');
    }

    const selectedModel = model || localStorage.getItem('openai_model') || 'gpt-4o-mini';
    const maxTokens = options.maxTokens || 2500;
    const temperature = options.temperature !== undefined ? options.temperature : 0.7;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: selectedModel,
          messages,
          temperature,
          max_tokens: maxTokens
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          throw new Error('Неверный API ключ OpenAI. Проверьте настройки API ключа.');
        } else if (status === 429) {
          throw new Error('Превышен лимит запросов к API OpenAI. Попробуйте позже.');
        } else {
          throw new Error(`Ошибка API OpenAI: ${data.error?.message || 'неизвестная ошибка'}`);
        }
      }
      
      throw new Error('Ошибка при обращении к API OpenAI');
    }
  }
  
  async generateImage(prompt: string, size: '1024x1024' | '512x512' | '256x256' = '1024x1024'): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not set');
    }
    
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
          prompt,
          n: 1,
          size
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.data[0].url;
    } catch (error) {
      console.error('Error generating image with OpenAI:', error);
      throw new Error('Ошибка при генерации изображения');
    }
  }
}

export const openAIApiClient = new OpenAIApiClient();
