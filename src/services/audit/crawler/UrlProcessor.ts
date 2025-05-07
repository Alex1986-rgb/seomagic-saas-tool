
/**
 * Класс для обработки URL в процессе сканирования
 */
export class UrlProcessor {
  private baseUrl: string;
  private domain: string;
  private crawledUrls: Set<string> = new Set();
  private disallowedPaths: string[] = [];
  
  constructor(url: string) {
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
    
    try {
      const parsedUrl = new URL(normalizedUrl);
      this.domain = parsedUrl.hostname;
      this.baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    } catch (error) {
      console.error('Invalid URL provided to UrlProcessor:', url);
      this.domain = '';
      this.baseUrl = '';
    }
  }
  
  /**
   * Получить домен текущего URL
   */
  getDomain(): string {
    return this.domain;
  }
  
  /**
   * Получить базовый URL (протокол + домен)
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
  
  /**
   * Устанавливает пути, запрещенные robots.txt
   */
  setRobotsTxtPaths(paths: string[]): void {
    this.disallowedPaths = paths;
  }
  
  /**
   * Нормализует URL для единого формата
   */
  normalize(url: string): string {
    try {
      // Для относительных URL добавляем базовый URL
      if (url.startsWith('/')) {
        url = `${this.baseUrl}${url}`;
      } else if (!url.startsWith('http')) {
        url = `${this.baseUrl}/${url}`;
      }
      
      // Удаляем фрагменты URL (всё после #)
      const hashIndex = url.indexOf('#');
      if (hashIndex > -1) {
        url = url.substring(0, hashIndex);
      }
      
      // Нормализация URL
      const parsedUrl = new URL(url);
      
      // Удаляем trailing slash для единообразия
      let normalizedUrl = parsedUrl.toString();
      if (normalizedUrl.endsWith('/') && parsedUrl.pathname.length > 1) {
        normalizedUrl = normalizedUrl.slice(0, -1);
      }
      
      return normalizedUrl;
    } catch (error) {
      console.error('Error normalizing URL:', url, error);
      return url;
    }
  }
  
  /**
   * Проверяет, должен ли URL быть сканирован
   */
  shouldCrawl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      
      // Проверка, что URL относится к тому же домену
      if (parsedUrl.hostname !== this.domain) {
        return false;
      }
      
      const normalizedUrl = this.normalize(url);
      
      // Проверка, был ли URL уже сканирован
      if (this.crawledUrls.has(normalizedUrl)) {
        return false;
      }
      
      return this.isAllowedByRobotsTxt(url);
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Проверяет, разрешен ли URL правилами robots.txt
   */
  isAllowedByRobotsTxt(url: string): boolean {
    // Проверка по disallowed paths из robots.txt
    for (const path of this.disallowedPaths) {
      if (url.includes(path)) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Сортирует URL по приоритету для сканирования
   */
  sortByPriority(urls: string[]): string[] {
    // Отфильтровываем недопустимые URL
    const validUrls = urls.filter(url => {
      try {
        new URL(url);
        return true;
      } catch (error) {
        return false;
      }
    });
    
    // Сортируем URL по приоритету:
    // 1. URL того же домена
    // 2. Короткие URL (обычно более важные страницы)
    return validUrls.sort((a, b) => {
      try {
        const urlA = new URL(a);
        const urlB = new URL(b);
        
        // Сначала URL того же домена
        if (urlA.hostname === this.domain && urlB.hostname !== this.domain) {
          return -1;
        }
        if (urlA.hostname !== this.domain && urlB.hostname === this.domain) {
          return 1;
        }
        
        // Затем сортируем по длине пути (более короткие пути обычно важнее)
        return urlA.pathname.length - urlB.pathname.length;
      } catch (error) {
        return 0;
      }
    });
  }
  
  /**
   * Отмечает URL как просканированный
   */
  markAsScanned(url: string): void {
    this.crawledUrls.add(this.normalize(url));
  }
  
  /**
   * Проверяет, был ли URL уже просканирован
   */
  isScanned(url: string): boolean {
    return this.crawledUrls.has(this.normalize(url));
  }
}
