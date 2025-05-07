
import { createUrlObject, normalizePath, normalizeUrl, isUrlFromSameDomain, isExternalUrl, getUrlPriority } from './urlUtils';

/**
 * Класс для обработки и управления URL при сканировании
 */
export class UrlProcessor {
  private domain: string;
  private baseUrl: string;
  private fileExtensionsToSkip = /\.(jpg|jpeg|png|gif|css|js|svg|pdf|zip|rar|doc|xls)$/i;
  private adminPathsToSkip = ['/wp-admin/', '/admin/', '/wp-login.php'];
  private robotsTxtDisallowedPaths: { [key: string]: boolean } = {};

  constructor(url: string) {
    try {
      let normalizedUrl = url;
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = `https://${normalizedUrl}`;
      }

      const urlObj = new URL(normalizedUrl);
      this.baseUrl = urlObj.origin;
      this.domain = urlObj.hostname;
    } catch (error) {
      throw new Error(`Invalid URL: ${url}`);
    }
  }

  /**
   * Устанавливает пути, запрещённые в robots.txt
   */
  setRobotsTxtPaths(paths: { [key: string]: boolean }): void {
    this.robotsTxtDisallowedPaths = paths;
  }

  /**
   * Проверяет, разрешён ли URL в robots.txt
   */
  isAllowedByRobotsTxt(url: string): boolean {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname !== this.domain) {
        return false; // External URLs are not allowed in our crawl
      }

      const pathname = urlObj.pathname;
      for (const path in this.robotsTxtDisallowedPaths) {
        if (pathname.startsWith(path) && !this.robotsTxtDisallowedPaths[path]) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Определяет, должен ли URL быть просканирован
   */
  shouldCrawl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      
      // Пропускать не-http/https URL
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        return false;
      }
      
      // Сканировать только в пределах одного домена
      if (urlObj.hostname !== this.domain) {
        return false;
      }
      
      // Пропускать URL с определёнными расширениями файлов
      if (this.fileExtensionsToSkip.test(urlObj.pathname)) {
        return false;
      }
      
      // Пропускать админские/бекенд URL
      for (const adminPath of this.adminPathsToSkip) {
        if (urlObj.pathname.includes(adminPath)) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Нормализует URL для избежания дублирования
   */
  normalize(url: string): string {
    return normalizeUrl(url);
  }

  /**
   * Сортирует URL по приоритету для более эффективного сканирования
   */
  sortByPriority(urls: string[]): string[] {
    return urls.sort((a, b) => {
      const aPriority = getUrlPriority(a);
      const bPriority = getUrlPriority(b);
      return bPriority - aPriority;
    });
  }

  /**
   * Возвращает домен текущего сканирования
   */
  getDomain(): string {
    return this.domain;
  }

  /**
   * Возвращает базовый URL текущего сканирования
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}
