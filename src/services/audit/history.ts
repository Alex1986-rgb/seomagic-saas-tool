
import { faker } from '@faker-js/faker';

/**
 * Fetches audit history for a domain
 */
export const fetchAuditHistory = async (url?: string): Promise<{ items: any[] }> => {
  // Simulate fetching audit history from an API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create more dynamic history items based on provided URL
      const historyItems = Array.from({ length: 5 }, (_, i) => ({
        id: faker.string.uuid(),
        date: new Date(new Date().setDate(new Date().getDate() - i * 10)).toISOString(),
        score: faker.number.int({ min: 0, max: 100 }),
        pageCount: faker.number.int({ min: 10, max: 500 }),
        url: url || "example.com",
        issues: {
          critical: faker.number.int({ min: 0, max: 5 }),
          important: faker.number.int({ min: 0, max: 10 }),
          opportunities: faker.number.int({ min: 0, max: 8 }),
        },
        details: {
          seo: { score: faker.number.int({ min: 0, max: 100 }) },
          performance: { score: faker.number.int({ min: 0, max: 100 }) },
          content: { score: faker.number.int({ min: 0, max: 100 }) },
          technical: { score: faker.number.int({ min: 0, max: 100 }) },
        },
      }));
      resolve({ items: historyItems });
    }, 800);
  });
};
