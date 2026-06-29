
import axios from 'axios';

class OpenAIApiClient {
  // Ключ держим только в памяти на время сессии — не пишем в localStorage
  // (clear-text storage). Постоянный ключ задаётся через env (VITE_OPENAI_API_KEY)
  // или, правильнее, проксируется через серверную edge-функцию.
  private apiKey: string | null = null;

  setApiKey(key: string): void {
    this.apiKey = key;
  }

  getApiKey(): string | null {
    if (this.apiKey) {
      return this.apiKey;
    }

    const envKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
    if (envKey) {
      this.apiKey = envKey;
      return envKey;
    }

    return null;
  }

  async makeRequest(messages: { role: string; content: string; }[], model?: string, options: { maxTokens?: number, temperature?: number } = {}): Promise<any> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
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
            'Authorization': `Bearer ${apiKey}`,
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
    const apiKey = this.getApiKey();
    if (!apiKey) {
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
            'Authorization': `Bearer ${apiKey}`,
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
