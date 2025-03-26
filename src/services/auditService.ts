import { AuditData, RecommendationData } from '@/types/audit';

// Mock data structure for SEO audit
export const fetchAuditData = async (url: string): Promise<AuditData> => {
  // Simulating API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock audit data
      const mockAuditData: AuditData = {
        id: `audit-${Date.now()}`, // Generate a unique ID
        score: 67,
        date: new Date().toISOString(),
        issues: {
          critical: 3,
          important: 8,
          opportunities: 12,
        },
        details: {
          performance: {
            score: 72,
            items: [
              { id: 'p1', title: 'Время до интерактивности', value: '3.2s', status: 'warning' },
              { id: 'p2', title: 'Скорость загрузки первого контента', value: '1.8s', status: 'good' },
              { id: 'p3', title: 'Общий размер страницы', value: '2.4MB', status: 'warning' },
              { id: 'p4', title: 'Количество запросов', value: '45', status: 'warning' },
            ],
          },
          seo: {
            score: 58,
            items: [
              { id: 's1', title: 'Отсутствуют meta-теги', description: 'Отсутствуют важные meta-теги на странице', status: 'error' },
              { id: 's2', title: 'Дублирующийся контент', description: 'Обнаружены страницы с дублирующимся контентом', status: 'error' },
              { id: 's3', title: 'Заголовки H1-H6', description: 'Структура заголовков нуждается в оптимизации', status: 'warning' },
              { id: 's4', title: 'Alt-теги изображений', description: 'Некоторые изображения не имеют alt-тегов', status: 'warning' },
              { id: 's5', title: 'Оптимизация мобильной версии', description: 'Сайт адаптирован для мобильных устройств', status: 'good' },
            ],
          },
          content: {
            score: 75,
            items: [
              { id: 'c1', title: 'Плотность ключевых слов', description: 'Хорошая плотность ключевых слов', status: 'good' },
              { id: 'c2', title: 'Длина контента', description: 'Контент достаточной длины', status: 'good' },
              { id: 'c3', title: 'Читабельность', description: 'Контент имеет хорошую читабельность', status: 'good' },
              { id: 'c4', title: 'Внутренние ссылки', description: 'Недостаточно внутренних ссылок', status: 'warning' },
            ],
          },
          technical: {
            score: 62,
            items: [
              { id: 't1', title: 'Robots.txt', description: 'Файл robots.txt отсутствует или неправильно настроен', status: 'error' },
              { id: 't2', title: 'Sitemap.xml', description: 'Файл sitemap.xml присутствует', status: 'good' },
              { id: 't3', title: 'SSL сертификат', description: 'SSL сертификат активен и корректен', status: 'good' },
              { id: 't4', title: 'Редиректы', description: 'Обнаружены проблемы с редиректами', status: 'warning' },
              { id: 't5', title: 'Ошибки сервера', description: 'Обнаружены ошибки 404', status: 'warning' },
            ],
          },
        },
      };
      
      resolve(mockAuditData);
    }, 3000);
  });
};

// Mock recommendations data
export const fetchRecommendations = async (): Promise<RecommendationData> => {
  return {
    critical: [
      'Добавьте мета-теги title и description на все страницы сайта',
      'Устраните дублирующийся контент с использованием canonical тегов',
      'Создайте и настройте файл robots.txt',
    ],
    important: [
      'Оптимизируйте структуру заголовков H1-H6',
      'Добавьте alt-теги ко всем изображениям',
      'Исправьте проблемы с редиректами',
      'Оптимизируйте размер страницы для ускорения загрузки',
    ],
    opportunities: [
      'Увеличьте количество внутренних ссылок для улучшения структуры сайта',
      'Оптимизируйте изображения для ускорения загрузки',
      'Добавьте структурированные данные (schema.org)',
      'Используйте более длинные и информативные описания для страниц',
    ],
  };
};
