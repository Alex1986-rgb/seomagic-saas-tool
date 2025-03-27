
import { PositionData } from './positionTracker';

// Получение истории проверок из хранилища
export const getPositionHistory = async (): Promise<PositionData[]> => {
  // Эмулируем задержку API-запроса
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    // В реальном приложении здесь был бы API-вызов к бэкенду
    const historyJson = localStorage.getItem('position_history');
    
    if (historyJson) {
      return JSON.parse(historyJson);
    }
    
    // Если истории нет, возвращаем пустой массив
    return generateMockHistory();
  } catch (error) {
    console.error('Ошибка получения истории:', error);
    return [];
  }
};

// Получение исторических данных для конкретного домена
export const getHistoricalData = async (domain: string): Promise<PositionData[]> => {
  try {
    const history = await getPositionHistory();
    return history.filter(item => item.domain === domain);
  } catch (error) {
    console.error('Ошибка получения исторических данных:', error);
    return [];
  }
};

// Генерация моковых данных истории для демонстрации
const generateMockHistory = (): PositionData[] => {
  const domains = ['example.com', 'mysite.ru', 'onlineshop.com'];
  const searchEngines = ['google', 'yandex', 'mailru'];
  const keywords = [
    'купить товар онлайн', 'лучший сервис', 'доставка заказа', 
    'интернет магазин', 'скидки акции', 'бесплатная доставка',
    'отзывы клиентов', 'каталог товаров', 'цена услуги'
  ];
  
  const history: PositionData[] = [];
  
  // Генерируем историю за последние 30 дней
  for (let i = 0; i < 15; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i * 2);
    
    const domain = domains[i % domains.length];
    const engine = i % 3 === 0 ? 'all' : searchEngines[i % searchEngines.length];
    
    // Генерируем результаты для каждого ключевого слова
    const keywordResults: any[] = [];
    
    for (const keyword of keywords.slice(0, 5 + (i % 5))) {
      for (const se of engine === 'all' ? searchEngines : [engine]) {
        // Создаем случайную позицию
        let position = Math.floor(Math.random() * 50);
        if (Math.random() > 0.8) position = 0; // Иногда не находим позицию
        
        keywordResults.push({
          keyword,
          position,
          url: position > 0 ? `https://${domain}/page-${keyword.replace(/\s+/g, '-').toLowerCase()}` : undefined,
          searchEngine: se
        });
      }
    }
    
    // Формируем запись истории
    const historyEntry: PositionData = {
      domain,
      timestamp: date.toISOString(),
      date: date.toISOString(),
      keywords: keywordResults,
      searchEngine: engine,
      region: 'Москва',
      depth: 30,
      scanFrequency: 'once',
    };
    
    // Добавляем предыдущие результаты для сравнения
    if (i > 0 && i % 2 === 0) {
      const prevDate = new Date();
      prevDate.setDate(prevDate.getDate() - (i+2) * 2);
      
      const prevKeywords = keywordResults.map(k => ({
        ...k,
        position: Math.max(0, k.position + Math.floor(Math.random() * 10) - 5)
      }));
      
      historyEntry.previousResults = [{
        domain,
        timestamp: prevDate.toISOString(),
        date: prevDate.toISOString(),
        keywords: prevKeywords,
        searchEngine: engine,
        region: 'Москва',
        depth: 30,
        scanFrequency: 'once',
      }];
    }
    
    history.push(historyEntry);
  }
  
  return history;
};
