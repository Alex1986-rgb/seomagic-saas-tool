
import { formatDate } from '@/lib/utils';

export const mockUserAudits = [
  {
    id: "1",
    project_id: "1",
    score: 84,
    page_count: 128,
    created_at: formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    issues: {
      critical: 3,
      major: 7,
      minor: 15
    },
    recommendations: [
      "Optimize meta descriptions",
      "Fix broken links",
      "Improve page loading speed"
    ],
    scan_details: {
      duration: "8 minutes",
      errors: 5,
      warnings: 12
    }
  },
  {
    id: "2",
    project_id: "1",
    score: 78,
    page_count: 132,
    created_at: formatDate(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)),
    issues: {
      critical: 4,
      major: 9,
      minor: 18
    },
    recommendations: [
      "Add alt tags to images",
      "Improve mobile responsiveness",
      "Optimize headings structure"
    ],
    scan_details: {
      duration: "10 minutes",
      errors: 7,
      warnings: 15
    }
  },
  {
    id: "3",
    project_id: "2",
    score: 92,
    page_count: 64,
    created_at: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    issues: {
      critical: 1,
      major: 4,
      minor: 9
    },
    recommendations: [
      "Implement schema markup",
      "Add canonical URLs",
      "Improve content readability"
    ],
    scan_details: {
      duration: "5 minutes",
      errors: 2,
      warnings: 8
    }
  }
];

export function generateHistoricalData(baseScore: number, days: number = 30) {
  const data = [];
  let score = baseScore - 10;
  
  for (let i = days; i >= 0; i--) {
    // Создаем тренд с постепенным улучшением и случайными колебаниями
    const change = Math.random() * 3 - 0.5;
    score = Math.min(Math.max(score + change, 50), 100);
    
    data.push({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      score: Math.round(score),
      issues: Math.round((100 - score) / 2)
    });
  }
  
  return data;
}

export function generatePageTypeData(pageCount: number) {
  return {
    blog: Math.floor(pageCount * 0.3),
    product: Math.floor(pageCount * 0.4),
    category: Math.floor(pageCount * 0.15),
    static: Math.floor(pageCount * 0.15)
  };
}

export function generateMockCrawl(domain: string, pageCount: number = 100) {
  const urls = [`https://${domain}/`];
  const pageTypes = ['about', 'contact', 'blog', 'products', 'category', 'faq', 'terms'];
  
  // Добавление основных страниц
  pageTypes.forEach(type => {
    urls.push(`https://${domain}/${type}`);
  });
  
  // Добавление подстраниц
  let currentCount = urls.length;
  while (currentCount < pageCount) {
    const pageType = pageTypes[Math.floor(Math.random() * pageTypes.length)];
    const id = Math.floor(Math.random() * 1000);
    urls.push(`https://${domain}/${pageType}/${pageType}-${id}`);
    currentCount++;
  }
  
  return {
    urls,
    pageCount,
    brokenLinks: Math.floor(pageCount * 0.05),
    externalLinks: Math.floor(pageCount * 2.5),
    performance: {
      avgLoadTime: (Math.random() * 2 + 1).toFixed(2),
      avgPageSize: Math.floor(Math.random() * 1000 + 500)
    }
  };
}
