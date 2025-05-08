
/**
 * Service for validating different types of inputs
 */
class ValidationService {
  /**
   * Validates a URL string
   * @param url URL string to validate
   * @returns boolean indicating if the URL is valid
   */
  validateUrl(url: string): boolean {
    if (!url || url.trim() === '') {
      return false;
    }
    
    try {
      // Add protocol if missing
      const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
      
      // Try to construct a URL object
      new URL(urlWithProtocol);
      
      // Additional checks for valid domain
      const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
      const hostname = new URL(urlWithProtocol).hostname;
      
      return domainRegex.test(hostname);
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Formats a URL string by adding protocol if missing
   * @param url URL string to format
   * @returns Formatted URL string
   */
  formatUrl(url: string): string {
    return url.startsWith('http') ? url : `https://${url}`;
  }
  
  /**
   * Extracts domain from a URL string
   * @param url URL string to extract domain from
   * @returns Domain string
   */
  extractDomain(url: string): string {
    try {
      if (!url) return '';
      const formattedUrl = this.formatUrl(url);
      return new URL(formattedUrl).hostname;
    } catch (error) {
      console.error('Error extracting domain:', error);
      return url;
    }
  }
}

export const validationService = new ValidationService();
