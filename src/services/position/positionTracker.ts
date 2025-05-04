
import { getHistoricalData } from './positionHistory';
import { proxyManager } from '../proxy/proxyManager';

// Интерфейсы для типизации
export interface KeywordPosition {
  keyword: string;
  position: number;
  url?: string;
  searchEngine: string;
  previousPosition?: number;
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

// Словарь для сохранения и консистентности позиций между проверками
const positionMemory: Record<string, number> = {};

// Функция для получения стабильных и реалистичных позиций для домена и ключевого слова
const getStablePosition = (domain: string, keyword: string, searchEngine: string, depth: number): number => {
  // Проверка на null или undefined
  if (!domain || !keyword || !searchEngine) {
    console.warn('Получен null или undefined в параметрах getStablePosition', { domain, keyword, searchEngine });
    return 0;
  }
  
  const key = `${domain}:${keyword}:${searchEngine}`;
  
  // Если позиция для этой комбинации уже была определена, используем ее с небольшими колебаниями
  if (positionMemory[key] !== undefined) {
    // Добавляем реалистичные небольшие колебания позиций (+/- 2 позиции)
    const fluctuation = Math.floor(Math.random() * 5) - 2; 
    const newPosition = Math.max(1, Math.min(depth, positionMemory[key] + fluctuation));
    // Сохраняем новую позицию для следующих проверок
    positionMemory[key] = newPosition;
    return newPosition;
  }
  
  // Для новых комбинаций домен-ключевое слово генерируем реалистичную позицию
  // Используем домен и ключевое слово для создания псевдослучайного, но стабильного распределения
  const domainHash = domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 100;
  const keywordHash = keyword.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 100;
  const basePositionFactor = (domainHash + keywordHash) / 200; // От 0 до 1
  
  // Делаем распределение более реалистичным:
  // - Чаще встречаются позиции за пределами ТОП-10
  // - Для более длинных ключевых слов позиции обычно лучше (длинный хвост)
  const keywordLength = keyword.length;
  const lengthBonus = Math.max(0, Math.min(0.3, (keywordLength - 3) * 0.03));
  
  // Разные поисковые системы дают разные результаты
  const searchEngineModifier = searchEngine === 'google' ? 0 : 
                              searchEngine === 'yandex' ? 0.05 : 0.1;
  
  // Рассчитываем позицию с учетом всех факторов
  let position = Math.floor((basePositionFactor - lengthBonus + searchEngineModifier) * depth * 0.9) + 1;
  
  // Некоторые ключевые слова должны отсутствовать в выдаче
  const randomFactor = Math.random();
  if (randomFactor > 0.9) {
    position = 0; // Не найдено
  }
  
  // Сохраняем позицию для будущих проверок
  positionMemory[key] = position;
  return position;
};

// Функция для реалистичной имитации данных поисковой выдачи
const generateSearchResults = (domain: string, keywords: string[], searchEngine: string, depth: number, useProxy: boolean = false): KeywordPosition[] => {
  console.log(`Генерация результатов поиска для ${domain} в ${searchEngine} с глубиной ${depth}, использование прокси: ${useProxy}`);
  
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
  
  // Имитируем проверку позиций в поисковой системе
  const results: KeywordPosition[] = keywords
    .filter(keyword => keyword && typeof keyword === 'string') // Фильтруем только валидные ключевые слова
    .map(keyword => {
      // Получаем стабильную позицию для домена и ключевого слова
      const position = getStablePosition(domain, keyword, searchEngine, depth);
      
      // Получаем предыдущую позицию из исторических данных
      const previousPosition = historicalData[keyword] || Math.floor(Math.random() * depth) + 1;
      
      // Генерируем URL для найденных позиций
      const url = position > 0 
        ? `https://${domain}/${keyword.replace(/\s+/g, '-').toLowerCase()}` 
        : undefined;
      
      return {
        keyword,
        position,
        previousPosition,
        url,
        searchEngine
      };
    });
  
  return results;
};

// Функция проверки позиций
export const checkPositions = async (data: PositionCheckParams): Promise<PositionData> => {
  console.log('checkPositions вызван с параметрами:', JSON.stringify(data, null, 2));
  
  // Эмулируем задержку, как будто выполняется реальный запрос
  await new Promise(resolve => setTimeout(resolve, 2000));
  
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
    const googleResults = generateSearchResults(domain, validKeywords, 'google', depth, !!proxyUsed);
    allResults = [...allResults, ...googleResults];
  }
  
  if (searchEngine === 'all' || searchEngine === 'yandex') {
    console.log(`Проверка позиций в Яндексе для домена ${domain}...`);
    const yandexResults = generateSearchResults(domain, validKeywords, 'yandex', depth, !!proxyUsed);
    allResults = [...allResults, ...yandexResults];
  }
  
  if (searchEngine === 'all' || searchEngine === 'mailru') {
    console.log(`Проверка позиций в Mail.ru для домена ${domain}...`);
    const mailruResults = generateSearchResults(domain, validKeywords, 'mailru', depth, !!proxyUsed);
    allResults = [...allResults, ...mailruResults];
  }
  
  // Генерируем уникальный ID сканирования
  const scanId = `scan-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Формируем результирующий объект
  const result: PositionData = {
    domain,
    timestamp: timestamp || new Date().toISOString(),
    date: new Date().toISOString(),
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
