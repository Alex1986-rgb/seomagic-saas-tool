
import { AuditData, RecommendationData } from '@/types/audit';

// Helper function to simulate API delay with progress
const simulateApiDelay = (ms: number) => {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

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
  
  // Mock audit data with dynamic domain reference
  const mockAuditData: AuditData = {
    id: `audit-${Date.now()}`, // Generate a unique ID
    score: Math.floor(Math.random() * 30) + 50, // Random score between 50-80
    date: new Date().toISOString(),
    issues: {
      critical: Math.floor(Math.random() * 4) + 1,
      important: Math.floor(Math.random() * 6) + 4,
      opportunities: Math.floor(Math.random() * 8) + 6,
    },
    details: {
      performance: {
        score: Math.floor(Math.random() * 25) + 60,
        items: [
          { id: 'p1', title: 'Время до интерактивности', value: `${(Math.random() * 4 + 1.5).toFixed(1)}s`, status: Math.random() > 0.5 ? 'warning' : 'good' },
          { id: 'p2', title: 'Скорость загрузки первого контента', value: `${(Math.random() * 2 + 0.8).toFixed(1)}s`, status: Math.random() > 0.7 ? 'warning' : 'good' },
          { id: 'p3', title: 'Общий размер страницы', value: `${(Math.random() * 3 + 1.2).toFixed(1)}MB`, status: Math.random() > 0.4 ? 'warning' : 'good' },
          { id: 'p4', title: 'Количество запросов', value: `${Math.floor(Math.random() * 30 + 25)}`, status: Math.random() > 0.6 ? 'warning' : 'good' },
        ],
      },
      seo: {
        score: Math.floor(Math.random() * 30) + 50,
        items: [
          { 
            id: 's1', 
            title: 'Meta-теги', 
            description: Math.random() > 0.5 ? 
              `На сайте ${domain} отсутствуют важные meta-теги на главной странице` : 
              'Meta-теги присутствуют, но требуют оптимизации', 
            status: Math.random() > 0.5 ? 'error' : 'warning' 
          },
          { 
            id: 's2', 
            title: 'Дублирующийся контент', 
            description: Math.random() > 0.7 ? 
              `Обнаружены страницы с дублирующимся контентом на ${domain}` : 
              'Дублирующийся контент не обнаружен', 
            status: Math.random() > 0.7 ? 'error' : 'good' 
          },
          { 
            id: 's3', 
            title: 'Заголовки H1-H6', 
            description: 'Структура заголовков нуждается в оптимизации', 
            status: 'warning' 
          },
          { 
            id: 's4', 
            title: 'Alt-теги изображений', 
            description: 'Некоторые изображения не имеют alt-тегов', 
            status: 'warning' 
          },
          { 
            id: 's5', 
            title: 'Оптимизация мобильной версии', 
            description: 'Сайт адаптирован для мобильных устройств', 
            status: 'good' 
          },
        ],
      },
      content: {
        score: Math.floor(Math.random() * 20) + 70,
        items: [
          { 
            id: 'c1', 
            title: 'Плотность ключевых слов', 
            description: 'Хорошая плотность ключевых слов', 
            status: 'good' 
          },
          { 
            id: 'c2', 
            title: 'Длина контента', 
            description: Math.random() > 0.5 ? 
              'Контент достаточной длины' : 
              'Рекомендуется увеличить объем контента на страницах', 
            status: Math.random() > 0.5 ? 'good' : 'warning' 
          },
          { 
            id: 'c3', 
            title: 'Читабельность', 
            description: 'Контент имеет хорошую читабельность', 
            status: 'good' 
          },
          { 
            id: 'c4', 
            title: 'Внутренние ссылки', 
            description: 'Недостаточно внутренних ссылок', 
            status: 'warning' 
          },
        ],
      },
      technical: {
        score: Math.floor(Math.random() * 30) + 50,
        items: [
          { 
            id: 't1', 
            title: 'Robots.txt', 
            description: Math.random() > 0.6 ? 
              'Файл robots.txt отсутствует или неправильно настроен' : 
              'Файл robots.txt корректно настроен', 
            status: Math.random() > 0.6 ? 'error' : 'good' 
          },
          { 
            id: 't2', 
            title: 'Sitemap.xml', 
            description: Math.random() > 0.3 ? 
              'Файл sitemap.xml присутствует' : 
              'Файл sitemap.xml отсутствует', 
            status: Math.random() > 0.3 ? 'good' : 'error' 
          },
          { 
            id: 't3', 
            title: 'SSL сертификат', 
            description: 'SSL сертификат активен и корректен', 
            status: 'good' 
          },
          { 
            id: 't4', 
            title: 'Редиректы', 
            description: Math.random() > 0.5 ? 
              'Обнаружены проблемы с редиректами' : 
              'Редиректы настроены корректно', 
            status: Math.random() > 0.5 ? 'warning' : 'good' 
          },
          { 
            id: 't5', 
            title: 'Ошибки сервера', 
            description: Math.random() > 0.7 ? 
              'Обнаружены ошибки 404' : 
              'Ошибки сервера не обнаружены', 
            status: Math.random() > 0.7 ? 'warning' : 'good' 
          },
        ],
      },
    },
  };
  
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
