import { AuditData, RecommendationData, AuditHistoryData, AuditHistoryItem, AuditItemData } from '@/types/audit';

// Helper function to simulate API delay with progress
const simulateApiDelay = (ms: number) => {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

// Историческая информация об аудитах (для имитации истории)
const mockHistoryData: Record<string, AuditHistoryItem[]> = {};

// Mock data structure for SEO audit
export const fetchAuditData = async (url: string): Promise<AuditData> => {
  // Simulate real-world network delay and processing
  await simulateApiDelay(2000);
  
  // Extract domain for personalization
  let domain = url;
  try {
    const urlObj = new URL(url);
    domain = urlObj.hostname;
  } catch (e) {
    // If URL parsing fails, use as-is
  }
  
  // Проверяем наличие истории для этого домена
  const hasHistory = mockHistoryData[domain] && mockHistoryData[domain].length > 0;
  const previousAudit = hasHistory ? mockHistoryData[domain][mockHistoryData[domain].length - 1] : null;
  
  // Генерируем новые показатели с учетом предыдущих (если есть)
  const generateRelativeScore = (previousScore?: number) => {
    if (!previousScore) return Math.floor(Math.random() * 30) + 50;
    
    // Генерируем новый счет с небольшим отклонением от предыдущего
    const change = Math.floor(Math.random() * 20) - 10; // Изменение от -10 до +10
    const newScore = previousScore + change;
    
    // Ограничиваем счет от 0 до 100
    return Math.min(100, Math.max(0, newScore));
  };
  
  // Создаем тренды на основе предыдущих значений
  const getTrend = (currentValue: number, previousValue?: number) => {
    if (!previousValue) return undefined;
    if (currentValue > previousValue + 3) return 'up';
    if (currentValue < previousValue - 3) return 'down';
    return 'neutral';
  };
  
  // Новый overall score
  const newScore = generateRelativeScore(previousAudit?.score);
  
  // Новые scores для категорий
  const performanceScore = generateRelativeScore(previousAudit?.details?.performance?.score);
  const seoScore = generateRelativeScore(previousAudit?.details?.seo?.score);
  const contentScore = generateRelativeScore(previousAudit?.details?.content?.score);
  const technicalScore = generateRelativeScore(previousAudit?.details?.technical?.score);
  
  // Генерируем количество страниц для сайта
  const pageCount = Math.floor(Math.random() * 50) + 10;
  
  // Создаем объект с данными аудита
  const mockAuditData: AuditData = {
    id: `audit-${Date.now()}`, // Generate a unique ID
    score: newScore,
    date: new Date().toISOString(),
    previousScore: previousAudit?.score,
    pageCount: pageCount,
    issues: {
      critical: Math.floor(Math.random() * 4) + 1,
      important: Math.floor(Math.random() * 6) + 4,
      opportunities: Math.floor(Math.random() * 8) + 6,
    },
    details: {
      performance: {
        score: performanceScore,
        previousScore: previousAudit?.details?.performance?.score,
        items: [
          { 
            id: 'p1', 
            title: 'Время до интерактивности', 
            description: `${(Math.random() * 4 + 1.5).toFixed(1)}s - время до полной интерактивности`,
            value: `${(Math.random() * 4 + 1.5).toFixed(1)}s`, 
            status: Math.random() > 0.5 ? 'warning' : 'good',
            trend: getTrend(Math.random(), Math.random()),
            helpText: 'Время до полной интерактивности страницы. Рекомендуемое значение: до 3.8s.'
          },
          { 
            id: 'p2', 
            title: 'Скорость загрузки первого контента', 
            description: `${(Math.random() * 2 + 0.8).toFixed(1)}s - время до отображения первого контента`,
            value: `${(Math.random() * 2 + 0.8).toFixed(1)}s`, 
            status: Math.random() > 0.7 ? 'warning' : 'good',
            trend: getTrend(Math.random(), Math.random()),
            helpText: 'Время до отображения первого содержимого. Рекомендуемое значение: до 1.8s.'
          },
          { 
            id: 'p3', 
            title: 'Общий размер страницы', 
            description: `${(Math.random() * 3 + 1.2).toFixed(1)}MB - общий объем ресурсов страницы`,
            value: `${(Math.random() * 3 + 1.2).toFixed(1)}MB`, 
            status: Math.random() > 0.4 ? 'warning' : 'good',
            trend: getTrend(Math.random(), Math.random()),
            helpText: 'Общий объем загружаемых ресурсов. Рекомендуемое значение: до 2MB.'
          },
          { 
            id: 'p4', 
            title: 'Количество запросов', 
            description: `${Math.floor(Math.random() * 30 + 25)} HTTP запросов на странице`,
            value: `${Math.floor(Math.random() * 30 + 25)}`, 
            status: Math.random() > 0.6 ? 'warning' : 'good',
            trend: getTrend(Math.random(), Math.random()),
            helpText: 'Количество HTTP-запросов на странице. Оптимально: до 50 запросов.'
          },
        ],
      },
      seo: {
        score: seoScore,
        previousScore: previousAudit?.details?.seo?.score,
        items: [
          { 
            id: 's1', 
            title: 'Meta-теги', 
            description: Math.random() > 0.5 ? 
              `На сайте ${domain} отсутствуют важные meta-теги на главной странице` : 
              'Meta-теги присутствуют, но требуют оптимизации', 
            status: Math.random() > 0.5 ? 'error' : 'warning',
            trend: getTrend(Math.random(), Math.random()),
            helpText: 'Наличие и оптимизация meta-тегов title, description и др.'
          },
          { 
            id: 's2', 
            title: 'Дублирующийся контент', 
            description: Math.random() > 0.7 ? 
              `Обнаружены страницы с дублирующимся контентом на ${domain}` : 
              'Дублирующийся контент не обнаружен', 
            status: Math.random() > 0.7 ? 'error' : 'good',
            trend: getTrend(Math.random(), Math.random()),
            helpText: 'Наличие на сайте страниц с одинаковым содержимым без canonical-тегов.'
          },
          { 
            id: 's3', 
            title: 'Заголовки H1-H6', 
            description: 'Структура заголовков нуждается в оптимизации', 
            status: 'warning',
            trend: getTrend(Math.random(), Math.random()),
            helpText: 'Правильная структура и иерархия заголовков H1-H6 на страницах.'
          },
          { 
            id: 's4', 
            title: 'Alt-теги изображений', 
            description: 'Некоторые изображения не имеют alt-тегов', 
            status: 'warning',
            trend: getTrend(Math.random(), Math.random()),
            helpText: 'Наличие альтернативных текстов для всех изображений на сайте.'
          },
          { 
            id: 's5', 
            title: 'Оптимизация мобильной версии', 
            description: 'Сайт адаптирован для мобильных устройств', 
            status: 'good',
            trend: getTrend(Math.random(), Math.random()),
            helpText: 'Адаптивность сайта и удобство использования на мобильных устройствах.'
          },
        ],
      },
      content: {
        score: contentScore,
        previousScore: previousAudit?.details?.content?.score,
        items: [
          { 
            id: 'c1', 
            title: 'Плотность ключевых слов', 
            description: 'Хорошая плотность ключевых слов', 
            status: 'good',
            trend: getTrend(Math.random(), Math.random()),
            helpText: 'Оптимальное соотношение ключевых слов к общему объему текста (1-3%).'
          },
          { 
            id: 'c2', 
            title: 'Длина контента', 
            description: Math.random() > 0.5 ? 
              'Контент достаточной длины' : 
              'Рекомендуется увеличить объем контента на страницах', 
            status: Math.random() > 0.5 ? 'good' : 'warning',
            trend: getTrend(Math.random(), Math.random()),
            helpText: 'Оптимальный объем текста на ключевых страницах (от 1000 слов).'
          },
          { 
            id: 'c3', 
            title: 'Читабельность', 
            description: 'Контент имеет хорошую читабельность', 
            status: 'good',
            trend: getTrend(Math.random(), Math.random()),
            helpText: 'Легкость восприятия текста, отсутствие слишком длинных предложений.'
          },
          { 
            id: 'c4', 
            title: 'Внутренние ссылки', 
            description: 'Недостаточно внутренних ссылок', 
            status: 'warning',
            trend: getTrend(Math.random(), Math.random()),
            helpText: 'Наличие ссылок между страницами сайта для улучшения навигации.'
          },
        ],
      },
      technical: {
        score: technicalScore,
        previousScore: previousAudit?.details?.technical?.score,
        items: [
          { 
            id: 't1', 
            title: 'Robots.txt', 
            description: Math.random() > 0.6 ? 
              'Файл robots.txt отсутствует или неправильно настроен' : 
              'Файл robots.txt корректно настроен', 
            status: Math.random() > 0.6 ? 'error' : 'good',
            trend: getTrend(Math.random(), Math.random()),
            helpText: 'Наличие и правильная настройка файла robots.txt для управления индексацией.'
          },
          { 
            id: 't2', 
            title: 'Sitemap.xml', 
            description: Math.random() > 0.3 ? 
              'Файл sitemap.xml присутствует' : 
              'Файл sitemap.xml отсутствует', 
            status: Math.random() > 0.3 ? 'good' : 'error',
            trend: getTrend(Math.random(), Math.random()),
            helpText: 'Наличие и правильная структура файла sitemap.xml для поисковых систем.'
          },
          { 
            id: 't3', 
            title: 'SSL сертификат', 
            description: 'SSL сертификат активен и корректен', 
            status: 'good',
            trend: getTrend(Math.random(), Math.random()),
            helpText: 'Наличие и правильная настройка SSL-сертификата для защищенного соединения.'
          },
          { 
            id: 't4', 
            title: 'Редиректы', 
            description: Math.random() > 0.5 ? 
              'Обнаружены проблемы с редиректами' : 
              'Редиректы настроены корректно', 
            status: Math.random() > 0.5 ? 'warning' : 'good',
            trend: getTrend(Math.random(), Math.random()),
            helpText: 'Правильная настройка редиректов 301/302 и отсутствие цепочек редиректов.'
          },
          { 
            id: 't5', 
            title: 'Ошибки сервера', 
            description: Math.random() > 0.7 ? 
              'Обнаружены ошибки 404' : 
              'Ошибки сервера не обнаружены', 
            status: Math.random() > 0.7 ? 'warning' : 'good',
            trend: getTrend(Math.random(), Math.random()),
            helpText: 'Отсутствие ошибок сервера (404, 500 и др.) на страницах сайта.'
          },
        ],
      },
    },
  };
  
  // Сохраняем данные аудита в историю
  if (!mockHistoryData[domain]) {
    mockHistoryData[domain] = [];
  }
  
  // Добавляем текущий аудит в историю
  mockHistoryData[domain].push({
    id: mockAuditData.id,
    date: mockAuditData.date,
    score: mockAuditData.score,
    pageCount: mockAuditData.pageCount,
    issues: mockAuditData.issues,
    details: {
      seo: { score: mockAuditData.details.seo.score },
      performance: { score: mockAuditData.details.performance.score },
      content: { score: mockAuditData.details.content.score },
      technical: { score: mockAuditData.details.technical.score },
    }
  });
  
  // Оставляем только последние 10 аудитов в истории
  if (mockHistoryData[domain].length > 10) {
    mockHistoryData[domain] = mockHistoryData[domain].slice(-10);
  }
  
  return mockAuditData;
};

// Mock recommendations data with site-specific suggestions
export const fetchRecommendations = async (): Promise<RecommendationData> => {
  // Add small delay to simulate API call
  await simulateApiDelay(500);
  
  return {
    critical: [
      'Добавьте мета-теги title и description на все страницы сайта',
      'Устраните дублирующийся контент с использованием canonical тегов',
      'Создайте и настройте файл robots.txt',
      'Исправьте страницы с ошибкой 404',
    ],
    important: [
      'Оптимизируйте структуру заголовков H1-H6',
      'Добавьте alt-теги ко всем изображениям',
      'Исправьте проблемы с редиректами',
      'Оптимизируйте размер страницы для ускорения загрузки',
      'Сократите время до интерактивности страницы',
      'Исправьте неработающие ссылки',
      'Улучшите мобильную версию сайта',
    ],
    opportunities: [
      'Увеличьте количество внутренних ссылок для улучшения структуры сайта',
      'Оптимизируйте изображения для ускорения загрузки',
      'Добавьте структурированные данные (schema.org)',
      'Используйте более длинные и информативные описания для страниц',
      'Улучшите юзабилити сайта',
      'Оптимизируйте контент для ключевых запросов',
      'Настройте аналитику для отслеживания эффективности сайта',
      'Улучшите визуальную иерархию элементов сайта',
    ],
  };
};

// Получение истории аудитов для домена
export const fetchAuditHistory = async (url: string): Promise<AuditHistoryData> => {
  await simulateApiDelay(500);
  
  let domain = url;
  try {
    const urlObj = new URL(url);
    domain = urlObj.hostname;
  } catch (e) {
    // If URL parsing fails, use as-is
  }
  
  return {
    items: mockHistoryData[domain] || []
  };
};
