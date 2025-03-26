
import { faker } from '@faker-js/faker';

/**
 * Gets advanced SEO audit details for a URL
 */
export const getAdvancedSeoDetails = async (url: string): Promise<any> => {
  // Set faker locale to Russian
  faker.locale = 'ru';
  
  // Simulating fetching detailed SEO metrics
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        metaTags: {
          title: {
            exists: true,
            length: faker.number.int({ min: 40, max: 70 }),
            optimal: true
          },
          description: {
            exists: true,
            length: faker.number.int({ min: 120, max: 160 }),
            optimal: true
          },
          keywords: {
            exists: faker.datatype.boolean(),
            count: faker.number.int({ min: 5, max: 15 })
          }
        },
        headings: {
          h1: {
            count: faker.number.int({ min: 0, max: 2 }),
            optimal: faker.datatype.boolean()
          },
          h2: {
            count: faker.number.int({ min: 0, max: 10 }),
            optimal: faker.datatype.boolean()
          },
          h3: {
            count: faker.number.int({ min: 0, max: 15 }),
            optimal: faker.datatype.boolean()
          }
        },
        links: {
          internal: faker.number.int({ min: 5, max: 50 }),
          external: faker.number.int({ min: 0, max: 20 }),
          broken: faker.number.int({ min: 0, max: 5 })
        },
        images: {
          total: faker.number.int({ min: 5, max: 30 }),
          withAlt: faker.number.int({ min: 0, max: 30 }),
          withoutAlt: faker.number.int({ min: 0, max: 10 }),
          largeImages: faker.number.int({ min: 0, max: 5 })
        },
        performance: {
          loadTime: faker.number.float({ min: 1, max: 10, fractionDigits: 1 }),
          firstContentfulPaint: faker.number.float({ min: 0.5, max: 5, fractionDigits: 1 }),
          largestContentfulPaint: faker.number.float({ min: 1, max: 8, fractionDigits: 1 }),
          cumulativeLayoutShift: faker.number.float({ min: 0, max: 0.5, fractionDigits: 2 }),
          totalBlockingTime: faker.number.float({ min: 0, max: 500, fractionDigits: 0 })
        },
        technical: {
          hasRobotsTxt: faker.datatype.boolean(),
          hasSitemap: faker.datatype.boolean(),
          usesHttps: faker.datatype.boolean(),
          hasFavicon: faker.datatype.boolean(),
          hasCanonicalUrl: faker.datatype.boolean(),
          hasSchema: faker.datatype.boolean(),
          mobileOptimized: faker.datatype.boolean()
        }
      });
    }, 1200);
  });
};
