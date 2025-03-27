
import { getHistoricalData } from './positionHistory';

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
}

// Моковые данные для демонстрации
const mockSearchResults = (domain: string, keywords: string[], searchEngine: string, depth: number) => {
  // Имитируем проверку позиций в поисковой системе
  const results: KeywordPosition[] = keywords.map(keyword => {
    // Генерируем случайную позицию для демонстрации
    const randomPosition = Math.random() > 0.2 
      ? Math.floor(Math.random() * depth) + 1 
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
export const checkPositions = async (data: any): Promise<PositionData> => {
  // Эмулируем задержку, как будто выполняется реальный запрос
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Получаем данные из параметров
  const { domain, keywords, searchEngine, region, depth, scanFrequency } = data;
  
  let allResults: KeywordPosition[] = [];
  
  // Проверяем позиции в выбранных поисковых системах
  if (searchEngine === 'all' || searchEngine === 'google') {
    const googleResults = mockSearchResults(domain, keywords, 'google', depth);
    allResults = [...allResults, ...googleResults];
  }
  
  if (searchEngine === 'all' || searchEngine === 'yandex') {
    const yandexResults = mockSearchResults(domain, keywords, 'yandex', depth);
    allResults = [...allResults, ...yandexResults];
  }
  
  if (searchEngine === 'all' || searchEngine === 'mailru') {
    const mailruResults = mockSearchResults(domain, keywords, 'mailru', depth);
    allResults = [...allResults, ...mailruResults];
  }
  
  // Формируем результирующий объект
  const result: PositionData = {
    domain,
    timestamp: new Date().toISOString(),
    date: new Date().toISOString(),
    keywords: allResults,
    searchEngine,
    region,
    depth,
    scanFrequency
  };
  
  // Получаем исторические данные для сравнения
  const history = await getHistoricalData(domain);
  if (history.length > 0) {
    result.previousResults = [history[0]];
  }
  
  // Сохраняем результат в историю (в реальном приложении здесь был бы API-вызов)
  saveResultToHistory(result);
  
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
  } catch (error) {
    console.error('Ошибка сохранения истории:', error);
  }
};
