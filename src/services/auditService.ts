
import { AuditData, ScanOptions } from "@/types/audit";
import { faker } from '@faker-js/faker';

const generateRandomAuditItem = () => {
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

const generateAuditCategoryData = () => {
  const items = Array.from({ length: faker.number.int({ min: 3, max: 7 }) }, () => generateRandomAuditItem());
  return {
    score: faker.number.int({ min: 0, max: 100 }),
    previousScore: faker.number.int({ min: 0, max: 100 }),
    items: items,
  };
};

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

export const fetchAuditData = async (url?: string): Promise<AuditData> => {
  // Simulate an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateAuditData(url || "example.com"));
    }, 1000);
  });
};

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

export const scanWebsite = async (
  url: string, 
  options: ScanOptions
): Promise<boolean> => {
  // Simulating website crawling
  const { maxPages, maxDepth, onProgress } = options;
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  try {
    // Format URL with protocol if missing
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    const domain = new URL(formattedUrl).hostname;
    
    // For demo, simulate scanning 20-50 pages
    const pagesToScan = Math.min(Math.floor(Math.random() * 30) + 20, maxPages);
    
    // Simulate discovering pages
    for (let i = 1; i <= pagesToScan; i++) {
      // Generate a random page URL for the current domain
      const pageTypes = ['product', 'category', 'blog', 'contact', 'about', 'faq', 'terms', 'privacy'];
      const randomPageType = faker.helpers.arrayElement(pageTypes);
      const currentUrl = `${formattedUrl}/${randomPageType}/${faker.lorem.slug(2)}`;
      
      // Call the progress callback
      if (onProgress) {
        onProgress(i, pagesToScan, currentUrl);
      }
      
      // Add random delay to simulate network requests
      await delay(Math.random() * 300 + 100);
    }
    
    return true;
  } catch (error) {
    console.error('Error scanning website:', error);
    return false;
  }
};

// Function to get advanced SEO audit details
export const getAdvancedSeoDetails = async (url: string): Promise<any> => {
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
          loadTime: faker.number.float({ min: 1, max: 10, precision: 0.1 }),
          firstContentfulPaint: faker.number.float({ min: 0.5, max: 5, precision: 0.1 }),
          largestContentfulPaint: faker.number.float({ min: 1, max: 8, precision: 0.1 }),
          cumulativeLayoutShift: faker.number.float({ min: 0, max: 0.5, precision: 0.01 }),
          totalBlockingTime: faker.number.float({ min: 0, max: 500, precision: 1 })
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
