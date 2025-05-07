
/**
 * Validation service for various input validations
 */
export class ValidationService {
  /**
   * Validates a URL
   * 
   * @param url URL to validate
   * @returns Boolean indicating if URL is valid
   */
  validateUrl(url: string): boolean {
    if (!url.trim()) return false;
    
    // URL validation pattern
    const pattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    return pattern.test(url);
  }

  /**
   * Formats a URL by adding https:// prefix if missing
   * 
   * @param url URL to format
   * @returns Formatted URL
   */
  formatUrl(url: string): string {
    let formattedUrl = url.trim();
    
    if (!formattedUrl.match(/^https?:\/\//i)) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    return formattedUrl;
  }

  /**
   * Extracts domain name from URL
   * 
   * @param url URL to process
   * @returns Domain name
   */
  extractDomain(url: string): string {
    try {
      return new URL(this.formatUrl(url)).hostname;
    } catch (e) {
      return url;
    }
  }

  /**
   * Validates an email address
   * 
   * @param email Email to validate
   * @returns Boolean indicating if email is valid
   */
  validateEmail(email: string): boolean {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }
}

export const validationService = new ValidationService();
