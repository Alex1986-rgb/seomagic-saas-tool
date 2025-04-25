
import axios from 'axios';

export class CaptchaService {
  private captchaApiKey: string = '';
  private botableApiKey: string = '';

  constructor(captchaApiKey?: string, botableApiKey?: string) {
    if (captchaApiKey) this.captchaApiKey = captchaApiKey;
    if (botableApiKey) this.botableApiKey = botableApiKey;
    
    this.loadApiKeysFromStorage();
  }

  private loadApiKeysFromStorage() {
    const storedCaptchaKey = localStorage.getItem('captchaApiKey');
    const storedBotableKey = localStorage.getItem('botableApiKey');
    
    if (storedCaptchaKey) this.captchaApiKey = storedCaptchaKey;
    if (storedBotableKey) this.botableApiKey = storedBotableKey;
  }

  setCaptchaApiKey(apiKey: string): void {
    this.captchaApiKey = apiKey;
    localStorage.setItem('captchaApiKey', apiKey);
  }
  
  setBotableApiKey(apiKey: string): void {
    this.botableApiKey = apiKey;
    localStorage.setItem('botableApiKey', apiKey);
  }
  
  getCaptchaApiKey(): string {
    return this.captchaApiKey;
  }
  
  getBotableApiKey(): string {
    return this.botableApiKey;
  }
  
  async solveCaptcha(
    imageOrSiteKey: string, 
    type: 'image' | 'recaptcha' | 'hcaptcha' = 'image', 
    websiteUrl?: string
  ): Promise<string> {
    if (!this.captchaApiKey) {
      throw new Error('API ключ для решения капчи не установлен');
    }
    
    try {
      let response;
      
      if (type === 'image') {
        // Решение обычной капчи с изображением
        response = await axios.post('https://api.ipcaptchaguru.com/solve', {
          key: this.captchaApiKey,
          method: 'base64',
          body: imageOrSiteKey, // base64 изображения
        });
      } else {
        // Решение reCAPTCHA или hCAPTCHA
        response = await axios.post('https://api.ipcaptchaguru.com/solve', {
          key: this.captchaApiKey,
          method: type === 'recaptcha' ? 'recaptcha' : 'hcaptcha',
          googlekey: imageOrSiteKey, // sitekey
          pageurl: websiteUrl
        });
      }
      
      if (response.data && response.data.status === 1) {
        return response.data.answer;
      } else {
        throw new Error(`Ошибка решения капчи: ${response.data?.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Ошибка при решении капчи:', error);
      throw new Error(`Ошибка при решении капчи: ${error.message}`);
    }
  }
}
