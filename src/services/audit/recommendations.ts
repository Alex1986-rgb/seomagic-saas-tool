
import { faker } from '@faker-js/faker';

/**
 * Generates and fetches recommendations for a website based on its URL
 */
export const fetchRecommendations = async (url?: string): Promise<{ critical: string[]; important: string[]; opportunities: string[]; }> => {
  // Simulate fetching recommendations from an API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate more dynamic recommendations based on the URL
      const domain = url ? new URL(url.startsWith('http') ? url : `https://${url}`).hostname : 'example.com';
      
      resolve({
        critical: [
          `Обновите мета-описание главной страницы ${domain}`,
          `Оптимизируйте изображения для ускорения загрузки`,
          `Исправьте проблемы с адаптивностью на мобильных устройствах`,
          `Добавьте HTTPS сертификат для ${domain}`,
          `Исправьте дублирующийся контент на страницах товаров`,
        ],
        important: [
          `Добавьте alt-теги ко всем изображениям на ${domain}`,
          `Улучшите структуру заголовков (H1, H2, H3)`,
          `Оптимизируйте скорость загрузки страниц`,
          `Добавьте микроразметку Schema.org`,
          `Исправьте 404 ошибки и настройте перенаправления`,
          `Улучшите навигацию по сайту`,
          `Оптимизируйте ключевые слова для ${domain}`,
        ],
        opportunities: [
          `Создайте карту сайта XML для ${domain}`,
          `Проверьте сайт на наличие битых ссылок`,
          `Улучшите контент на ключевых страницах`,
          `Добавьте блог для увеличения органического трафика`,
          `Оптимизируйте социальные метатеги для ${domain}`,
          `Улучшите внутреннюю перелинковку сайта`,
        ],
      });
    }, 800);
  });
};
