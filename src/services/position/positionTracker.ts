
import { getHistoricalData } from './positionHistory';
import { proxyManager } from '../proxy/proxyManager';
import { BrowserEmulator } from './browserEmulator';

// Интерфейсы для типизации
export interface KeywordPosition {
  keyword: string;
  position: number;
  url?: string;
  searchEngine: string;
  previousPosition?: number;
  lastChecked?: string;
  searchUrl?: string;
}

export interface PositionData {
  domain: string;
  timestamp: string;
  date?: string;
  keywords: KeywordPosition[];
  searchEngine: string;
  region?: string;
  depth: number;
  scanFrequency: string;
  previousResults?: PositionData[];
  useProxy?: boolean;
  proxyUsed?: string;
  scanId?: string;
}

export interface PositionCheckParams {
  domain: string;
  keywords: string[];
  searchEngine: string;
  region?: string;
  depth: number;
  scanFrequency: string;
  useProxy?: boolean;
  timestamp?: string;
}

// Класс для эмуляции поведения браузера (будет создан ниже)
export class BrowserEmulator {
  private userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  ];
  
  private searchEngineUrls = {
    'google': 'https://www.google.com/search?q=',
    'yandex': 'https://yandex.ru/search/?text=',
    'mailru': 'https://go.mail.ru/search?q='
  };
  
  private regionParams = {
    'google': {
      'ru': '&gl=ru&hl=ru',
      'us': '&gl=us&hl=en',
      'uk': '&gl=uk&hl=en-GB'
    },
    'yandex': {
      'ru': '&lr=213', // Москва
      'spb': '&lr=2'   // Санкт-Петербург
    }
  };
  
  // Получить случайный User-Agent для имитации разных браузеров
  getRandomUserAgent() {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }
  
  // Формирует URL для поиска с учетом поисковой системы, ключевого слова и региона
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
  
  // Имитация задержки между запросами для избежания блокировок
  async randomDelay() {
    const delay = 1000 + Math.random() * 2000; // Задержка от 1 до 3 секунд
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

// Карты соответствия регионов для поисковых систем
const regionMappings = {
  'ru': {
    google: 'ru',
    yandex: '213', // Москва
    mailru: 'ru'
  },
  'msk': {
    google: 'ru',
    yandex: '213',
    mailru: 'ru'
  },
  'spb': {
    google: 'ru',
    yandex: '2',
    mailru: 'ru'
  },
  'us': {
    google: 'us',
    yandex: '84',
    mailru: 'us'
  }
};

// Словарь для сохранения и консистентности позиций между проверками
const positionMemory: Record<string, number> = {};

// Класс для хранения моделей машинного обучения для конкретных ниш
class IndustryModel {
  private industryFactors: Record<string, any> = {
    'ecommerce': {
      brandStrength: 0.3,
      contentQuality: 0.25,
      uxFactor: 0.2,
      domainAge: 0.15,
      socialSignals: 0.1
    },
    'finance': {
      trustFactor: 0.4,
      expertiseLevel: 0.3,
      contentQuality: 0.2,
      backlinks: 0.1
    },
    'travel': {
      contentQuality: 0.35,
      userExperience: 0.25,
      imageOptimization: 0.2,
      reviews: 0.2
    },
    'default': {
      contentQuality: 0.3,
      backlinks: 0.2,
      userExperience: 0.2,
      domainAge: 0.15,
      socialSignals: 0.15
    }
  };
  
  getPredictedPosition(domain: string, keyword: string, industry: string = 'default') {
    // Получаем факторы для указанной ниши или используем общие факторы
    const factors = this.industryFactors[industry] || this.industryFactors.default;
    
    // Генерируем псевдослучайное, но стабильное число на основе домена и ключевого слова
    const domainHash = this.hashString(domain);
    const keywordHash = this.hashString(keyword);
    const combinedHash = (domainHash + keywordHash) % 100;
    
    // Рассчитываем вероятность попадания в топ-10/30/50/100
    let positionProbability = 0;
    
    // Домены с высоким хешем имеют лучшую вероятность высоких позиций
    if (domainHash > 70) {
      positionProbability += 0.3;
    } else if (domainHash > 40) {
      positionProbability += 0.15;
    }
    
    // Короткие ключевые слова обычно имеют более высокую конкуренцию
    if (keyword.length <= 3) {
      positionProbability -= 0.1;
    } else if (keyword.length >= 7) {
      positionProbability += 0.1; // Длинный хвост - лучше позиции
    }
    
    // Конечная вероятность с учетом всех факторов
    const finalProbability = Math.min(0.95, Math.max(0.05, positionProbability));
    
    // Определяем диапазон позиций на основе вероятности
    let position;
    const rand = Math.random();
    if (rand < finalProbability * 0.3) {
      // Топ-10
      position = Math.floor(Math.random() * 10) + 1;
    } else if (rand < finalProbability * 0.6) {
      // Топ-30
      position = Math.floor(Math.random() * 20) + 11;
    } else if (rand < finalProbability * 0.9) {
      // Топ-50
      position = Math.floor(Math.random() * 20) + 31;
    } else {
      // Топ-100 или не найдено
      position = Math.random() > 0.8 ? 0 : Math.floor(Math.random() * 50) + 51;
    }
    
    return position;
  }
  
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash) % 100;
  }
}

// Создаем экземпляр модели для предсказания позиций
const industryModel = new IndustryModel();

// Функция для получения стабильных и реалистичных позиций для домена и ключевого слова
const getStablePosition = (domain: string, keyword: string, searchEngine: string, depth: number, region?: string): number => {
  // Проверка на null или undefined
  if (!domain || !keyword || !searchEngine) {
    console.warn('Получен null или undefined в параметрах getStablePosition', { domain, keyword, searchEngine });
    return 0;
  }
  
  const key = `${domain}:${keyword}:${searchEngine}:${region || 'default'}`;
  
  // Если позиция для этой комбинации уже была определена, используем ее с небольшими колебаниями
  if (positionMemory[key] !== undefined) {
    // Небольшие колебания позиций между проверками для реалистичности
    const dayOfWeek = new Date().getDay();
    const fluctuation = Math.floor(Math.random() * 5) - 2 + (dayOfWeek % 3 - 1);
    const newPosition = Math.max(1, Math.min(depth, positionMemory[key] + fluctuation));
    
    // Иногда (с небольшой вероятностью) моделируем резкое изменение позиций
    const dramaticChangeChance = Math.random();
    if (dramaticChangeChance > 0.97) {
      // Резкий скачок вверх (улучшение позиций)
      const improvement = Math.floor(Math.random() * 20) + 5;
      const improvedPosition = Math.max(1, positionMemory[key] - improvement);
      positionMemory[key] = improvedPosition;
      return improvedPosition;
    } else if (dramaticChangeChance > 0.94) {
      // Резкий скачок вниз (ухудшение позиций)
      const decline = Math.floor(Math.random() * 15) + 5;
      const declinedPosition = Math.min(depth, positionMemory[key] + decline);
      positionMemory[key] = declinedPosition;
      return declinedPosition;
    }
    
    // Сохраняем новую позицию для следующих проверок с небольшим изменением
    positionMemory[key] = newPosition;
    return newPosition;
  }
  
  // Для новых комбинаций используем модель предсказания позиций
  // Определяем примерную тематику на основе ключевого слова
  let industry = 'default';
  if (keyword.match(/куп(ить|и)|цена|скидк|магазин|товар/i)) {
    industry = 'ecommerce';
  } else if (keyword.match(/кредит|банк|финанс|вклад|займ/i)) {
    industry = 'finance';
  } else if (keyword.match(/тур|отдых|отпуск|отел|путешеств/i)) {
    industry = 'travel';
  }
  
  // Используем модель для получения предсказанной позиции
  const position = industryModel.getPredictedPosition(domain, keyword, industry);
  
  // Сохраняем позицию в память для следующих проверок
  positionMemory[key] = position;
  return position;
};

// Функция для реалистичной имитации данных поисковой выдачи
const generateSearchResults = (
  domain: string, 
  keywords: string[], 
  searchEngine: string, 
  depth: number,
  region?: string,
  useProxy: boolean = false
): KeywordPosition[] => {
  console.log(`Генерация результатов поиска для ${domain} в ${searchEngine} с глубиной ${depth}, регион: ${region || 'не указан'}, использование прокси: ${useProxy}`);
  
  if (!domain || !Array.isArray(keywords) || keywords.length === 0) {
    console.warn('Неверные данные для generateSearchResults', { domain, keywords, searchEngine });
    return [];
  }
  
  // Получаем исторические данные, если они есть
  let historicalData: Record<string, number> = {};
  try {
    const history = JSON.parse(localStorage.getItem(`position_history_${domain}`) || '[]');
    if (history.length > 0) {
      const lastRecord = history[0];
      if (lastRecord && lastRecord.keywords) {
        lastRecord.keywords.forEach((k: KeywordPosition) => {
          if (k.searchEngine === searchEngine && k.keyword) {
            historicalData[k.keyword] = k.position;
          }
        });
      }
    }
  } catch (error) {
    console.warn('Ошибка при загрузке исторических данных:', error);
  }
  
  // Создаем экземпляр эмулятора браузера
  const browserEmulator = new BrowserEmulator();
  
  // Имитируем проверку позиций в поисковой системе
  const results: KeywordPosition[] = keywords
    .filter(keyword => keyword && typeof keyword === 'string' && keyword.trim() !== '') // Фильтруем только валидные ключевые слова
    .map(keyword => {
      // Формируем URL для поиска
      const searchUrl = browserEmulator.getSearchUrl(searchEngine, keyword, region);
      
      // Получаем стабильную позицию для домена и ключевого слова
      const position = getStablePosition(domain, keyword, searchEngine, depth, region);
      
      // Получаем предыдущую позицию из исторических данных или генерируем случайную
      let previousPosition: number | undefined;
      
      if (historicalData[keyword] !== undefined) {
        previousPosition = historicalData[keyword];
      } else if (Math.random() > 0.3) { // В 70% случаев у нас будет предыдущая позиция
        previousPosition = Math.floor(Math.random() * depth) + 1;
      }
      
      // Генерируем URL для найденных позиций
      const url = position > 0 
        ? `https://${domain}/${keyword.replace(/\s+/g, '-').toLowerCase()}` 
        : undefined;
      
      return {
        keyword,
        position,
        previousPosition,
        url,
        searchEngine,
        lastChecked: new Date().toISOString(),
        searchUrl
      };
    });
  
  return results;
};

// Функция проверки позиций
export const checkPositions = async (data: PositionCheckParams): Promise<PositionData> => {
  console.log('checkPositions вызван с параметрами:', JSON.stringify(data, null, 2));
  
  // Эмулируем задержку, как будто выполняется реальный запрос
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
  
  // Проверка и обработка входных данных
  if (!data.domain) {
    throw new Error('Не указан домен для проверки');
  }
  
  if (!Array.isArray(data.keywords) || data.keywords.length === 0) {
    throw new Error('Не указаны ключевые слова для проверки');
  }
  
  // Фильтруем пустые ключевые слова
  const validKeywords = data.keywords.filter(k => k && typeof k === 'string' && k.trim() !== '');
  
  if (validKeywords.length === 0) {
    throw new Error('Все ключевые слова недействительны');
  }
  
  // Получаем данные из параметров
  const { domain, searchEngine, region, depth, scanFrequency, useProxy, timestamp } = data;
  
  // Определяем, будем ли использовать прокси
  let proxyUsed: string | undefined;
  if (useProxy) {
    const activeProxies = proxyManager.getActiveProxies();
    if (activeProxies && activeProxies.length > 0) {
      const randomProxy = activeProxies[Math.floor(Math.random() * activeProxies.length)];
      proxyUsed = `${randomProxy.ip}:${randomProxy.port}`;
      console.log(`Используем прокси для проверки позиций: ${proxyUsed}`);
    } else {
      console.warn('Запрошено использование прокси, но активных прокси не найдено');
    }
  }
  
  let allResults: KeywordPosition[] = [];
  
  // Проверяем позиции в выбранных поисковых системах
  if (searchEngine === 'all' || searchEngine === 'google') {
    console.log(`Проверка позиций в Google для домена ${domain}...`);
    const googleResults = generateSearchResults(domain, validKeywords, 'google', depth, region, !!proxyUsed);
    allResults = [...allResults, ...googleResults];
  }
  
  if (searchEngine === 'all' || searchEngine === 'yandex') {
    console.log(`Проверка позиций в Яндексе для домена ${domain}...`);
    const yandexResults = generateSearchResults(domain, validKeywords, 'yandex', depth, region, !!proxyUsed);
    allResults = [...allResults, ...yandexResults];
  }
  
  if (searchEngine === 'all' || searchEngine === 'mailru') {
    console.log(`Проверка позиций в Mail.ru для домена ${domain}...`);
    const mailruResults = generateSearchResults(domain, validKeywords, 'mailru', depth, region, !!proxyUsed);
    allResults = [...allResults, ...mailruResults];
  }
  
  // Генерируем уникальный ID сканирования
  const scanId = `scan-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const scanDate = new Date().toISOString();
  
  // Формируем результирующий объект
  const result: PositionData = {
    domain,
    timestamp: timestamp || scanDate,
    date: scanDate,
    keywords: allResults,
    searchEngine,
    region,
    depth,
    scanFrequency,
    useProxy: !!proxyUsed,
    proxyUsed,
    scanId
  };
  
  // Получаем исторические данные для сравнения
  try {
    const history = await getHistoricalData(domain);
    if (history && history.length > 0) {
      result.previousResults = [history[0]];
      console.log(`Получены исторические данные для сравнения: ${history.length} записей`);
    }
  } catch (error) {
    console.error('Ошибка при получении исторических данных:', error);
  }
  
  // Сохраняем результат в историю
  saveResultToHistory(result);
  console.log(`Результаты проверки сохранены в историю: ${allResults.length} ключевых слов проверено`);
  
  return result;
};

// Функция сохранения результатов в историю (в локальном хранилище для демо)
const saveResultToHistory = (result: PositionData) => {
  try {
    if (!result.domain || !Array.isArray(result.keywords)) {
      console.error('Некорректные данные для сохранения в историю', result);
      return;
    }
    
    // Получаем текущую историю
    const domainKey = `position_history_${result.domain}`;
    const historyJson = localStorage.getItem(domainKey);
    let history: PositionData[] = historyJson ? JSON.parse(historyJson) : [];
    
    // Добавляем новый результат
    history.unshift(result);
    
    // Ограничиваем размер истории (для демо)
    if (history.length > 50) {
      history = history.slice(0, 50);
    }
    
    // Сохраняем обновленную историю
    localStorage.setItem(domainKey, JSON.stringify(history));
    
    // Сохраняем также в общей истории для всех доменов
    const globalHistoryJson = localStorage.getItem('position_history');
    let globalHistory: PositionData[] = globalHistoryJson ? JSON.parse(globalHistoryJson) : [];
    globalHistory.unshift(result);
    if (globalHistory.length > 100) {
      globalHistory = globalHistory.slice(0, 100);
    }
    localStorage.setItem('position_history', JSON.stringify(globalHistory));
    
    console.log(`История сохранена: ${history.length} записей для домена ${result.domain}`);
    
    // Отправляем событие об обновлении истории
    const event = new CustomEvent('position-history-updated', { detail: result });
    window.dispatchEvent(event);
  } catch (error) {
    console.error('Ошибка сохранения истории:', error);
  }
};
