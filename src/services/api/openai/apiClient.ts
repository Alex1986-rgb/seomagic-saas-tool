
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

  async makeRequest(messages: { role: string; content: string; }[], model = 'gpt-4-turbo-preview'): Promise<any> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not set');
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 2500
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  }
}

export const openAIApiClient = new OpenAIApiClient();

