import { AuditData } from "@/types/audit";
import { faker } from '@faker-js/faker';

const generateRandomAuditItem = () => {
  // Explicitly define status options as the exact types needed
  const statusOptions = ['good', 'warning', 'error'] as const;
  const trendOptions = ['up', 'down', 'neutral'];

  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    status: faker.helpers.arrayElement(statusOptions), // This now returns only 'good', 'warning', or 'error'
    details: faker.lorem.sentence(),
    value: faker.number.int({ min: 0, max: 100 }),
    trend: faker.helpers.arrayElement(trendOptions),
    helpText: faker.lorem.sentence(),
  };
};

const generateAuditCategoryData = () => {
  const items = Array.from({ length: faker.number.int({ min: 3, max: 7 }) }, () => generateRandomAuditItem());
  return {
    score: faker.number.int({ min: 0, max: 100 }),
    previousScore: faker.number.int({ min: 0, max: 100 }),
    items: items,
  };
};

export const generateAuditData = (): AuditData => {
  const score = faker.number.int({ min: 0, max: 100 });
  const previousScore = faker.number.int({ min: 0, max: 100 });
  const critical = faker.number.int({ min: 0, max: 5 });
  const important = faker.number.int({ min: 0, max: 5 });
  const opportunities = faker.number.int({ min: 0, max: 5 });
  const pageCount = faker.number.int({ min: 10, max: 500 });

  return {
    id: crypto.randomUUID(),
    url: "example.com",
    score,
    date: new Date().toISOString(),
    previousScore,
    pageCount,
    issues: {
      critical,
      important,
      opportunities
    },
    details: {
      seo: {
        score: faker.number.int({ min: 0, max: 100 }),
        previousScore: faker.number.int({ min: 0, max: 100 }),
        items: Array.from({ length: faker.number.int({ min: 3, max: 7 }) }, () => generateRandomAuditItem()),
      },
      performance: {
        score: faker.number.int({ min: 0, max: 100 }),
        previousScore: faker.number.int({ min: 0, max: 100 }),
        items: Array.from({ length: faker.number.int({ min: 3, max: 7 }) }, () => generateRandomAuditItem()),
      },
      content: {
        score: faker.number.int({ min: 0, max: 100 }),
        previousScore: faker.number.int({ min: 0, max: 100 }),
        items: Array.from({ length: faker.number.int({ min: 3, max: 7 }) }, () => generateRandomAuditItem()),
      },
      technical: {
        score: faker.number.int({ min: 0, max: 100 }),
        previousScore: faker.number.int({ min: 0, max: 100 }),
        items: Array.from({ length: faker.number.int({ min: 3, max: 7 }) }, () => generateRandomAuditItem()),
      },
    }
  };
};

export const fetchAuditData = async (): Promise<AuditData> => {
  // Simulate an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateAuditData());
    }, 500);
  });
};

export const fetchRecommendations = async (): Promise<{ critical: string[]; important: string[]; opportunities: string[]; }> => {
  // Simulate fetching recommendations from an API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        critical: [
          "Обновите мета-описание главной страницы",
          "Оптимизируйте изображения для ускорения загрузки",
        ],
        important: [
          "Добавьте alt-теги ко всем изображениям",
          "Улучшите структуру заголовков (H1, H2, H3)",
        ],
        opportunities: [
          "Создайте карту сайта XML",
          "Проверьте сайт на наличие битых ссылок",
        ],
      });
    }, 500);
  });
};

export const fetchAuditHistory = async (): Promise<{ items: any[] }> => {
  // Simulate fetching audit history from an API
  return new Promise((resolve) => {
    setTimeout(() => {
      const historyItems = Array.from({ length: 5 }, (_, i) => ({
        id: faker.string.uuid(),
        date: new Date(new Date().setDate(new Date().getDate() - i * 10)).toISOString(),
        score: faker.number.int({ min: 0, max: 100 }),
        pageCount: faker.number.int({ min: 10, max: 500 }),
        issues: {
          critical: faker.number.int({ min: 0, max: 5 }),
          important: faker.number.int({ min: 0, max: 5 }),
          opportunities: faker.number.int({ min: 0, max: 5 }),
        },
        details: {
          seo: { score: faker.number.int({ min: 0, max: 100 }) },
          performance: { score: faker.number.int({ min: 0, max: 100 }) },
          content: { score: faker.number.int({ min: 0, max: 100 }) },
          technical: { score: faker.number.int({ min: 0, max: 100 }) },
        },
      }));
      resolve({ items: historyItems });
    }, 500);
  });
};
