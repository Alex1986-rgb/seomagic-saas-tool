
import robotsParser from 'robots-parser';
import axios from 'axios';

/**
 * Класс для работы с файлом robots.txt
 */
export class RobotsTxtParser {
  private baseUrl: string;
  private userAgent: string;
  private excludePatterns: RegExp[];
  private parsedRobots: any = null;

  constructor(baseUrl?: string, userAgent: string = 'SEOBot/1.0', excludePatterns: RegExp[] = []) {
    this.baseUrl = baseUrl || '';
    this.userAgent = userAgent;
    this.excludePatterns = excludePatterns;
  }

  /**
   * Извлекает URL из robots.txt
   * @param baseUrl URL сайта
   */
  async parse(baseUrl: string): Promise<string[]> {
    try {
      const robotsUrl = `${baseUrl}/robots.txt`;
      const response = await axios.get(robotsUrl, {
        timeout: 5000,
        headers: {
          'User-Agent': this.userAgent
        }
      });
      
      if (response.status === 200) {
        const robotsTxt = response.data;
        this.parsedRobots = robotsParser(robotsUrl, robotsTxt);
        
        // Получаем пути, которые запрещены для сканирования
        const disallowedPaths: string[] = [];
        const robotsLines = robotsTxt.split('\n');
        
        for (const line of robotsLines) {
          const trimmedLine = line.trim().toLowerCase();
          if (trimmedLine.startsWith('disallow:')) {
            const path = line.split(':')[1].trim();
            if (path && path !== '/') {
              disallowedPaths.push(path);
            }
          }
        }
        
        return disallowedPaths;
      }
      
      return [];
    } catch (error) {
      console.warn(`Не удалось получить robots.txt для ${baseUrl}:`, error);
      return [];
    }
  }
  
  /**
   * Читает файл robots.txt и возвращает паттерны для исключения
   */
  async readRobotsTxt(): Promise<RegExp[]> {
    if (!this.baseUrl) {
      return this.excludePatterns;
    }
    
    try {
      await this.parse(this.baseUrl);
      
      // Обрабатываем disallow правила для текущего user-agent
      const patterns: RegExp[] = [...this.excludePatterns];
      
      // Добавляем дополнительную логику для создания RegExp из disallow правил
      
      return patterns;
    } catch (error) {
      console.warn('Error reading robots.txt:', error);
      return this.excludePatterns;
    }
  }
  
  /**
   * Проверяет, разрешен ли URL для сканирования по правилам robots.txt
   */
  isAllowed(url: string): boolean {
    if (!this.parsedRobots) {
      return true;
    }
    
    return this.parsedRobots.isAllowed(url, this.userAgent);
  }
}
