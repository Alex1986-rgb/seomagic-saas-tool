import { faker } from '@faker-js/faker';
import { PageContent } from './content';
import { AuditData, OptimizationItem } from '@/types/audit.d';

/**
 * Generates a random score between 0 and 100
 */
export const generateRandomScore = (): number => {
  return Math.floor(Math.random() * 101);
};

/**
 * Generates a random status from 'error', 'warning', and 'good'
 */
export const generateRandomStatus = (): 'error' | 'warning' | 'good' => {
  const statuses: ('error' | 'warning' | 'good')[] = ['error', 'warning', 'good'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

/**
 * Generates a random trend from 'up', 'down', and 'neutral'
 */
export const generateRandomTrend = (): 'up' | 'down' | 'neutral' => {
  const trends: ('up' | 'down' | 'neutral')[] = ['up', 'down', 'neutral'];
  return trends[Math.floor(Math.random() * trends.length)];
};

/**
 * Generates a random impact from 'high', 'medium', and 'low'
 */
export const generateRandomImpact = (): 'high' | 'medium' | 'low' => {
  const impacts: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
  return impacts[Math.floor(Math.random() * impacts.length)];
};

/**
 * Generates a random number of affected URLs
 */
export const generateRandomAffectedUrls = (): string[] => {
  const numUrls = Math.floor(Math.random() * 5); // Random number between 0 and 4
  const urls: string[] = [];
  for (let i = 0; i < numUrls; i++) {
    urls.push(faker.internet.url());
  }
  return urls;
};

/**
 * Generates a random number of issues
 */
export const generateRandomIssues = (): { critical: string[]; important: string[]; opportunities: string[]; minor: string[] } => {
  return {
    critical: Array.from({ length: Math.floor(Math.random() * 3) }, () => faker.lorem.sentence()),
    important: Array.from({ length: Math.floor(Math.random() * 5) }, () => faker.lorem.sentence()),
    opportunities: Array.from({ length: Math.floor(Math.random() * 7) }, () => faker.lorem.sentence()),
    minor: Array.from({ length: Math.floor(Math.random() * 10) }, () => faker.lorem.sentence()),
  };
};


/**
 * Generates a mock page content object
 */
export const generateMockPageContent = (url: string): PageContent => {
  return {
    url: url,
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(3),
    meta: {
      description: faker.lorem.sentence(),
      keywords: faker.lorem.words(5),
    },
    metadata: {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      keywords: faker.lorem.words(5),
      canonicalUrl: `https://${url}/canonical`,
    },
    images: Array.from({ length: Math.floor(Math.random() * 5) }, () => ({
      url: faker.image.url(),
      alt: faker.lorem.sentence(),
    })),
    headings: {
      h1: Array.from({ length: Math.floor(Math.random() * 3) }, () => faker.lorem.sentence()),
      h2: Array.from({ length: Math.floor(Math.random() * 5) }, () => faker.lorem.sentence()),
      h3: Array.from({ length: Math.floor(Math.random() * 7) }, () => faker.lorem.sentence()),
    },
    wordCount: Math.floor(Math.random() * 500),
  };
};


/**
 * Calculates the total cost of optimization items
 */
export const calculateTotalCost = (items: OptimizationItem[]): number => {
  return items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
};
