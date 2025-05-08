
/**
 * Класс для валидации данных
 */
class ValidationService {
  /**
   * Валидирует URL
   * @param url URL для проверки
   * @returns true если URL корректен, иначе false
   */
  validateUrl(url: string): boolean {
    if (!url) return false;
    
    // Добавляем протокол если его нет
    let urlWithProtocol = url;
    if (!urlWithProtocol.startsWith('http://') && !urlWithProtocol.startsWith('https://')) {
      urlWithProtocol = 'https://' + urlWithProtocol;
    }
    
    try {
      new URL(urlWithProtocol);
      return true;
    } catch (err) {
      return false;
    }
  }
  
  /**
   * Форматирует URL, добавляя протокол если необходимо
   * @param url URL для форматирования
   * @returns отформатированный URL
   */
  formatUrl(url: string): string {
    if (!url) return '';
    
    let formattedUrl = url.trim();
    
    // Если URL не начинается с протокола, добавляем https://
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    // Убираем завершающий слеш, если он есть
    if (formattedUrl.endsWith('/')) {
      formattedUrl = formattedUrl.slice(0, -1);
    }
    
    return formattedUrl;
  }

  /**
   * Извлекает домен из URL
   * @param url URL для извлечения домена
   * @returns домен без протокола и www
   */
  extractDomain(url: string): string {
    if (!url) return '';
    
    try {
      let formattedUrl = url;
      
      // Добавляем протокол если его нет, чтобы URL был валидным
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
      }
      
      const urlObj = new URL(formattedUrl);
      let domain = urlObj.hostname;
      
      // Удаляем www. если есть
      if (domain.startsWith('www.')) {
        domain = domain.substring(4);
      }
      
      return domain;
    } catch (err) {
      // В случае ошибки возвращаем исходную строку
      console.error('Error extracting domain:', err);
      return url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    }
  }
}

export const validationService = new ValidationService();
