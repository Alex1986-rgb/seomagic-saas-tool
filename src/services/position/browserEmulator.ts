
/**
 * Класс для эмуляции поведения браузера при проверке позиций
 * Помогает более реалистично имитировать запросы к поисковым системам
 */
export class BrowserEmulator {
  private userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36 Edg/91.0.864.71'
  ];
  
  private searchEngineUrls = {
    'google': 'https://www.google.com/search?q=',
    'yandex': 'https://yandex.ru/search/?text=',
    'mailru': 'https://go.mail.ru/search?q=',
    'bing': 'https://www.bing.com/search?q='
  };
  
  private regionParams = {
    'google': {
      'ru': '&gl=ru&hl=ru',
      'us': '&gl=us&hl=en',
      'uk': '&gl=uk&hl=en-GB',
      'de': '&gl=de&hl=de'
    },
    'yandex': {
      'ru': '&lr=213', // Москва
      'spb': '&lr=2',  // Санкт-Петербург
      'nsk': '&lr=65', // Новосибирск
      'ekb': '&lr=54'  // Екатеринбург
    }
  };
  
  /**
   * Получить случайный User-Agent для имитации разных браузеров
   */
  getRandomUserAgent() {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }
  
  /**
   * Формирует URL для поиска с учетом поисковой системы, ключевого слова и региона
   */
  getSearchUrl(searchEngine: string, keyword: string, region?: string) {
    const baseUrl = this.searchEngineUrls[searchEngine] || this.searchEngineUrls.google;
    const encodedKeyword = encodeURIComponent(keyword);
    let regionParam = '';
    
    // Добавляем параметры региона, если поисковая система и регион поддерживаются
    if (region && this.regionParams[searchEngine] && this.regionParams[searchEngine][region]) {
      regionParam = this.regionParams[searchEngine][region];
    }
    
    return `${baseUrl}${encodedKeyword}${regionParam}`;
  }
  
  /**
   * Имитация задержки между запросами для избежания блокировок
   */
  async randomDelay() {
    const delay = 1000 + Math.random() * 2000; // Задержка от 1 до 3 секунд
    return new Promise(resolve => setTimeout(resolve, delay));
  }
  
  /**
   * Имитирует скроллинг страницы для поиска результатов
   * В реальной реализации здесь был бы код, использующий puppeteer или подобный инструмент
   */
  simulateScrolling() {
    const scrollTimes = 3 + Math.floor(Math.random() * 5); // От 3 до 7 скроллов
    return {
      scrollCount: scrollTimes,
      totalScrollHeight: scrollTimes * (700 + Math.floor(Math.random() * 300)) // Примерная высота скролла
    };
  }
  
  /**
   * Метод для преобразования региона в параметры поисковых систем
   */
  mapRegionToSearchEngineParams(region: string, searchEngine: string) {
    const regionMappings: Record<string, Record<string, string>> = {
      'Москва': { google: 'ru', yandex: '213', mailru: 'ru' },
      'Санкт-Петербург': { google: 'ru', yandex: '2', mailru: 'ru' },
      'Новосибирск': { google: 'ru', yandex: '65', mailru: 'ru' },
      'США': { google: 'us', yandex: '84', mailru: 'us' },
      'Великобритания': { google: 'uk', yandex: '10393', mailru: 'uk' },
      'Германия': { google: 'de', yandex: '96', mailru: 'de' }
    };
    
    if (regionMappings[region] && regionMappings[region][searchEngine]) {
      return regionMappings[region][searchEngine];
    }
    
    // Возвращаем регион по умолчанию, если маппинг не найден
    return searchEngine === 'yandex' ? '213' : 'ru';
  }
  
  /**
   * Имитирует запрос к поисковой системе
   */
  async simulateSearch(keyword: string, searchEngine: string, region?: string) {
    const userAgent = this.getRandomUserAgent();
    const searchUrl = this.getSearchUrl(searchEngine, keyword, region);
    
    console.log(`Поиск по запросу "${keyword}" в ${searchEngine}, регион: ${region || 'не указан'}`);
    console.log(`URL поиска: ${searchUrl}`);
    console.log(`User-Agent: ${userAgent}`);
    
    // В реальной имплементации здесь был бы код для запроса к поисковой системе
    // Например, с использованием puppeteer, playwright или аналогичного инструмента
    
    // Имитируем задержку запроса
    await this.randomDelay();
    
    return {
      searchUrl,
      userAgent,
      timestamp: new Date().toISOString()
    };
  }
}

export default BrowserEmulator;
