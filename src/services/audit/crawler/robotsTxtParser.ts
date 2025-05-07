
import axios from 'axios';

/**
 * Класс для работы с robots.txt
 */
export class RobotsTxtParser {
  private robotsTxtAllowed: { [key: string]: boolean } = {};
  private userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
  ];

  /**
   * Получает случайный User-Agent для избежания обнаружения
   */
  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  /**
   * Парсит robots.txt файл по указанному URL
   */
  async parse(baseUrl: string): Promise<{ [key: string]: boolean }> {
    try {
      const robotsUrl = `${baseUrl}/robots.txt`;
      const response = await axios.get(robotsUrl, {
        timeout: 5000,
        headers: {
          'User-Agent': this.getRandomUserAgent()
        }
      }).catch(() => null);

      if (response && response.status === 200) {
        const lines = response.data.split('\n');
        let currentUserAgent = '*';
        const result: { [key: string]: boolean } = {};

        for (const line of lines) {
          const trimmedLine = line.trim();
          
          if (trimmedLine.startsWith('User-agent:')) {
            currentUserAgent = trimmedLine.substring(11).trim();
          } else if (trimmedLine.startsWith('Disallow:') && 
                    (currentUserAgent === '*' || currentUserAgent.includes('bot'))) {
            const path = trimmedLine.substring(9).trim();
            if (path) {
              result[path] = false;
            }
          } else if (trimmedLine.startsWith('Allow:') && 
                    (currentUserAgent === '*' || currentUserAgent.includes('bot'))) {
            const path = trimmedLine.substring(6).trim();
            if (path) {
              result[path] = true;
            }
          } else if (trimmedLine.startsWith('Sitemap:')) {
            // Обработка Sitemap URL если необходимо
          }
        }
        
        this.robotsTxtAllowed = result;
        return result;
      }
    } catch (error) {
      console.warn('Could not parse robots.txt:', error);
    }
    
    return {};
  }

  /**
   * Проверяет, разрешен ли URL согласно robots.txt
   */
  isAllowed(url: string, domain: string): boolean {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname !== domain) {
        return false; // Внешние URL не разрешены в нашем сканировании
      }

      const pathname = urlObj.pathname;
      for (const path in this.robotsTxtAllowed) {
        if (pathname.startsWith(path)) {
          return this.robotsTxtAllowed[path];
        }
      }
      
      return true; // По умолчанию разрешено, если нет явного запрета
    } catch (error) {
      return false;
    }
  }
}
