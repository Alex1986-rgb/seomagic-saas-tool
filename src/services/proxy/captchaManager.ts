
import { CaptchaService } from './captchaService';

/**
 * Class responsible for managing captcha solving operations
 */
export class CaptchaManager {
  private captchaService: CaptchaService;
  
  constructor(captchaApiKey?: string, botableApiKey?: string) {
    this.captchaService = new CaptchaService(captchaApiKey, botableApiKey);
  }

  /**
   * Set the API key for captcha solver service
   */
  setCaptchaApiKey(apiKey: string): void {
    this.captchaService.setCaptchaApiKey(apiKey);
  }
  
  /**
   * Set the API key for Botable service
   */
  setBotableApiKey(apiKey: string): void {
    this.captchaService.setBotableApiKey(apiKey);
  }
  
  /**
   * Get the current captcha solver API key
   */
  getCaptchaApiKey(): string {
    return this.captchaService.getCaptchaApiKey();
  }
  
  /**
   * Get the current Botable API key
   */
  getBotableApiKey(): string {
    return this.captchaService.getBotableApiKey();
  }
  
  /**
   * Solve a captcha using API
   */
  async solveCaptcha(
    imageOrSiteKey: string, 
    type: 'image' | 'recaptcha' | 'hcaptcha' = 'image', 
    websiteUrl?: string
  ): Promise<string> {
    return this.captchaService.solveCaptcha(imageOrSiteKey, type, websiteUrl);
  }
}
