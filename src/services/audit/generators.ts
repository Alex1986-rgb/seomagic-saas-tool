
import { AuditData, AuditItemData } from "@/types/audit";
import { faker } from '@faker-js/faker';

/**
 * Generates a random audit item with random values
 */
export const generateRandomAuditItem = (): AuditItemData => {
  // Explicitly define status options as the exact types needed
  const statusOptions = ['good', 'warning', 'error'] as const;
  const trendOptions = ['up', 'down', 'neutral'] as const;

  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    status: faker.helpers.arrayElement(statusOptions), // This now returns only 'good', 'warning', or 'error'
    details: faker.lorem.sentence(),
    value: faker.number.int({ min: 0, max: 100 }),
    trend: faker.helpers.arrayElement(trendOptions), // This now returns only 'up', 'down', or 'neutral'
    helpText: faker.lorem.sentence(),
  };
};

/**
 * Generates a random audit category with multiple audit items
 */
export const generateAuditCategoryData = () => {
  const items = Array.from({ length: faker.number.int({ min: 3, max: 7 }) }, () => generateRandomAuditItem());
  return {
    score: faker.number.int({ min: 0, max: 100 }),
    previousScore: faker.number.int({ min: 0, max: 100 }),
    items: items,
  };
};

/**
 * Generates complete audit data for a domain
 */
export const generateAuditData = (url: string): AuditData => {
  const score = faker.number.int({ min: 0, max: 100 });
  const previousScore = faker.number.int({ min: 0, max: 100 });
  const critical = faker.number.int({ min: 0, max: 5 });
  const important = faker.number.int({ min: 0, max: 15 });
  const opportunities = faker.number.int({ min: 0, max: 10 });
  const pageCount = faker.number.int({ min: 10, max: 500 });

  return {
    id: crypto.randomUUID(),
    url: url || "example.com",
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
