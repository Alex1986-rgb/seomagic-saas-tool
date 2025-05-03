
import { getHistoricalData } from './positionHistory';
import { proxyManager } from '../proxy/proxyManager';

// Интерфейсы для типизации
export interface KeywordPosition {
  keyword: string;
  position: number;
  url?: string;
  searchEngine: string;
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

// Моковые данные для демонстрации
const mockSearchResults = (domain: string, keywords: string[], searchEngine: string, depth: number, useProxy: boolean = false) => {
  // Имитируем проверку позиций в поисковой системе
  const results: KeywordPosition[] = keywords.map(keyword => {
    // Генерируем случайную позицию для демонстрации
    // При использовании прокси делаем позиции немного лучше (для демонстрации)
    const randomPosition = Math.random() > (useProxy ? 0.15 : 0.25) 
      ? Math.floor(Math.random() * (useProxy ? depth * 0.7 : depth)) + 1 
      : 0; // Иногда возвращаем 0, обозначая, что позиция не найдена
    
    // Генерируем URL для найденных позиций
    const url = randomPosition > 0 
      ? `https://${domain}/page-${keyword.replace(/\s+/g, '-').toLowerCase()}` 
      : undefined;
    
    return {
      keyword,
      position: randomPosition,
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
  
  // Получаем данные из параметров
  const { domain, keywords, searchEngine, region, depth, scanFrequency, useProxy, timestamp } = data;
  
  // Определяем, будем ли использовать прокси
  let proxyUsed: string | undefined;
  if (useProxy) {
    const activeProxies = proxyManager.getActiveProxies();
    if (activeProxies.length > 0) {
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
    const googleResults = mockSearchResults(domain, keywords, 'google', depth, !!proxyUsed);
    allResults = [...allResults, ...googleResults];
  }
  
  if (searchEngine === 'all' || searchEngine === 'yandex') {
    console.log(`Проверка позиций в Яндексе для домена ${domain}...`);
    const yandexResults = mockSearchResults(domain, keywords, 'yandex', depth, !!proxyUsed);
    allResults = [...allResults, ...yandexResults];
  }
  
  if (searchEngine === 'all' || searchEngine === 'mailru') {
    console.log(`Проверка позиций в Mail.ru для домена ${domain}...`);
    const mailruResults = mockSearchResults(domain, keywords, 'mailru', depth, !!proxyUsed);
    allResults = [...allResults, ...mailruResults];
  }
  
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
    proxyUsed
  };
  
  // Получаем исторические данные для сравнения
  const history = await getHistoricalData(domain);
  if (history.length > 0) {
    result.previousResults = [history[0]];
    console.log(`Получены исторические данные для сравнения: ${history.length} записей`);
  }
  
  // Сохраняем результат в историю (в реальном приложении здесь был бы API-вызов)
  saveResultToHistory(result);
  console.log(`Результаты проверки сохранены в историю: ${allResults.length} ключевых слов проверено`);
  
  return result;
};

// Функция сохранения результатов в историю (в локальном хранилище для демо)
const saveResultToHistory = (result: PositionData) => {
  try {
    // Получаем текущую историю
    const historyJson = localStorage.getItem('position_history');
    let history: PositionData[] = historyJson ? JSON.parse(historyJson) : [];
    
    // Добавляем новый результат
    history.unshift(result);
    
    // Ограничиваем размер истории (для демо)
    if (history.length > 50) {
      history = history.slice(0, 50);
    }
    
    // Сохраняем обновленную историю
    localStorage.setItem('position_history', JSON.stringify(history));
    console.log(`История сохранена: ${history.length} записей`);
  } catch (error) {
    console.error('Ошибка сохранения истории:', error);
  }
};
