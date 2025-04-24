
import { faker } from '@faker-js/faker';
import { AuditData, AuditItemData, CategoryData, AuditCategoryData } from '@/types/audit';

/**
 * Generate random audit data for a URL
 */
export const generateAuditData = (url: string): AuditData => {
  // Generate a random score between 0 and 100
  const score = faker.number.int({ min: 0, max: 100 });
  const previousScore = faker.number.int({ min: Math.max(0, score - 20), max: Math.min(100, score + 20) });
  
  // Generate random counts for different issue types
  const criticalCount = faker.number.int({ min: 0, max: 5 });
  const importantCount = faker.number.int({ min: 0, max: 10 });
  const opportunitiesCount = faker.number.int({ min: 0, max: 15 });
  
  // Generate random page count
  const pageCount = faker.number.int({ min: 10, max: 100 });
  
  // Generate category scores
  const seoScore = faker.number.int({ min: 0, max: 100 });
  const performanceScore = faker.number.int({ min: 0, max: 100 });
  const contentScore = faker.number.int({ min: 0, max: 100 });
  const technicalScore = faker.number.int({ min: 0, max: 100 });
  const mobileScore = faker.number.int({ min: 0, max: 100 });
  const usabilityScore = faker.number.int({ min: 0, max: 100 });
  
  // Generate audit data
  return {
    id: faker.string.uuid(),
    url: url.startsWith('http') ? url : `https://${url}`,
    title: `SEO Audit for ${url}`,
    score,
    previousScore,
    pageCount,
    date: new Date().toISOString(),
    issues: {
      critical: generateIssues('critical', criticalCount),
      important: generateIssues('important', importantCount),
      opportunities: generateIssues('opportunities', opportunitiesCount)
    },
    pageSpeed: {
      desktop: faker.number.int({ min: 30, max: 100 }),
      mobile: faker.number.int({ min: 20, max: 90 })
    },
    mobileFriendliness: faker.number.int({ min: 0, max: 100 }),
    security: faker.number.int({ min: 0, max: 100 }),
    technologies: [
      'WordPress',
      'Google Analytics',
      'Google Tag Manager',
      'jQuery',
      'Bootstrap'
    ],
    structuredData: [
      'Organization',
      'WebPage',
      'BreadcrumbList'
    ],
    contentQuality: faker.number.int({ min: 0, max: 100 }),
    keywords: [
      'best seo tools',
      'seo optimization',
      'seo audit',
      'website optimization'
    ],
    competitors: [
      'competitor1.com',
      'competitor2.com',
      'competitor3.com'
    ],
    backlinks: faker.number.int({ min: 0, max: 1000 }),
    socialShares: faker.number.int({ min: 0, max: 500 }),
    traffic: faker.number.int({ min: 0, max: 10000 }),
    organicTraffic: faker.number.int({ min: 0, max: 8000 }),
    paidTraffic: faker.number.int({ min: 0, max: 2000 }),
    bounceRate: faker.number.float({ min: 20, max: 80, fractionDigits: 1 }),
    timeOnSite: faker.number.float({ min: 30, max: 300, fractionDigits: 1 }),
    demographics: {
      age: '25-34',
      gender: 'Mixed',
      location: 'United States'
    },
    deviceTypes: {
      desktop: faker.number.int({ min: 30, max: 70 }),
      mobile: faker.number.int({ min: 20, max: 60 }),
      tablet: faker.number.int({ min: 5, max: 20 })
    },
    details: {
      seo: generateAuditCategoryData('SEO', seoScore),
      performance: generateAuditCategoryData('Performance', performanceScore),
      content: generateAuditCategoryData('Content', contentScore),
      technical: generateAuditCategoryData('Technical', technicalScore),
      mobile: generateAuditCategoryData('Mobile', mobileScore),
      usability: generateAuditCategoryData('Usability', usabilityScore) // Add the usability category
    },
    status: 'completed'
  };
};

/**
 * Generate random issues
 */
const generateIssues = (type: string, count: number): string[] => {
  const issues: string[] = [];
  
  for (let i = 0; i < count; i++) {
    let issue = '';
    
    if (type === 'critical') {
      issue = faker.helpers.arrayElement([
        'Missing meta title on 3 pages',
        'Duplicate content detected on product pages',
        'Broken links found on 5 pages',
        'Missing SSL certificate',
        'Mobile site is not responsive'
      ]);
    } else if (type === 'important') {
      issue = faker.helpers.arrayElement([
        'Slow page loading time (> 3s)',
        'Missing alt tags on images',
        'Low word count on key pages',
        'Missing schema markup',
        'URL structure needs improvement'
      ]);
    } else {
      issue = faker.helpers.arrayElement([
        'Improve heading structure',
        'Add more internal links',
        'Update content on homepage',
        'Optimize images further',
        'Add FAQ section for better search visibility'
      ]);
    }
    
    // Only add if not already in the array
    if (!issues.includes(issue)) {
      issues.push(issue);
    }
  }
  
  return issues;
};

/**
 * Generate category data for audit details
 */
const generateAuditCategoryData = (category: string, score: number): AuditCategoryData => {
  const previousScore = faker.number.int({ min: Math.max(0, score - 20), max: Math.min(100, score + 20) });
  const itemsCount = faker.number.int({ min: 5, max: 10 });
  
  // Calculate passed, warning, failed counts
  const total = itemsCount;
  const passedPercent = score / 100;
  const passed = Math.round(total * passedPercent);
  const warning = Math.round((total - passed) / 2);
  const failed = total - passed - warning;
  
  return {
    id: faker.string.uuid(), // Set id consistently
    name: category,
    description: `Analysis of ${category.toLowerCase()} aspects of the website`,
    score,
    previousScore,
    items: generateAuditItems(category, itemsCount, { passed, warning, failed }),
    passed,
    warning,
    failed
  };
};

/**
 * Generate audit items for a category
 */
const generateAuditItems = (
  category: string, 
  count: number, 
  statusCounts: {passed: number, warning: number, failed: number}
): AuditItemData[] => {
  const items: AuditItemData[] = [];
  
  // Add failed items
  for (let i = 0; i < statusCounts.failed; i++) {
    items.push(generateAuditItem(category, 'error'));
  }
  
  // Add warning items
  for (let i = 0; i < statusCounts.warning; i++) {
    items.push(generateAuditItem(category, 'warning'));
  }
  
  // Add passed items
  for (let i = 0; i < statusCounts.passed; i++) {
    items.push(generateAuditItem(category, 'good'));
  }
  
  return items;
};

/**
 * Generate a single audit item
 */
const generateAuditItem = (category: string, status: 'error' | 'warning' | 'good'): AuditItemData => {
  let title = '';
  let description = '';
  let impact: 'high' | 'medium' | 'low' = 'medium';
  
  if (category === 'SEO') {
    if (status === 'error') {
      title = faker.helpers.arrayElement([
        'Missing meta descriptions',
        'Duplicate title tags',
        'No H1 tags on main pages'
      ]);
      description = 'Critical SEO issue that needs immediate attention.';
      impact = 'high';
    } else if (status === 'warning') {
      title = faker.helpers.arrayElement([
        'Meta descriptions too short',
        'Low keyword density',
        'Weak internal linking'
      ]);
      description = 'SEO issue that should be addressed soon.';
      impact = 'medium';
    } else {
      title = faker.helpers.arrayElement([
        'Good meta titles',
        'Proper heading structure',
        'Good keyword usage'
      ]);
      description = 'Good SEO practice already implemented.';
      impact = 'low';
    }
  } else if (category === 'Performance') {
    if (status === 'error') {
      title = faker.helpers.arrayElement([
        'Slow page loading time (> 3s)',
        'JavaScript errors on 5 pages',
        'Missing images on 3 pages'
      ]);
      description = 'Performance issue that needs immediate attention.';
      impact = 'high';
    } else if (status === 'warning') {
      title = faker.helpers.arrayElement([
        'Page load time is slow',
        'Missing alt tags on images',
        'Low image quality'
      ]);
      description = 'Performance issue that should be addressed soon.';
      impact = 'medium';
    } else {
      title = faker.helpers.arrayElement([
        'Good page load time',
        'All images are optimized',
        'All scripts are loaded in the correct order'
      ]);
      description = 'Good performance practice already implemented.';
      impact = 'low';
    }
  } else if (category === 'Content') {
    if (status === 'error') {
      title = faker.helpers.arrayElement([
        'Missing content on 3 pages',
        'Duplicate content detected on product pages',
        'Broken links found on 5 pages'
      ]);
      description = 'Content issue that needs immediate attention.';
      impact = 'high';
    } else if (status === 'warning') {
      title = faker.helpers.arrayElement([
        'Low word count on key pages',
        'Missing schema markup',
        'URL structure needs improvement'
      ]);
      description = 'Content issue that should be addressed soon.';
      impact = 'medium';
    } else {
      title = faker.helpers.arrayElement([
        'Good content',
        'Proper heading structure',
        'Good keyword usage'
      ]);
      description = 'Good content practice already implemented.';
      impact = 'low';
    }
  } else if (category === 'Technical') {
    if (status === 'error') {
      title = faker.helpers.arrayElement([
        'Missing SSL certificate',
        'Broken links found on 5 pages',
        'No H1 tags on main pages'
      ]);
      description = 'Technical issue that needs immediate attention.';
      impact = 'high';
    } else if (status === 'warning') {
      title = faker.helpers.arrayElement([
        'No alt tags on images',
        'Low image quality',
        'Missing schema markup'
      ]);
      description = 'Technical issue that should be addressed soon.';
      impact = 'medium';
    } else {
      title = faker.helpers.arrayElement([
        'Good SSL certificate',
        'All images are optimized',
        'All scripts are loaded in the correct order'
      ]);
      description = 'Good technical practice already implemented.';
      impact = 'low';
    }
  } else {
    if (status === 'error') {
      title = faker.helpers.arrayElement([
        'Missing SSL certificate',
        'Broken links found on 5 pages',
        'No H1 tags on main pages'
      ]);
      description = 'Technical issue that needs immediate attention.';
      impact = 'high';
    } else if (status === 'warning') {
      title = faker.helpers.arrayElement([
        'No alt tags on images',
        'Low image quality',
        'Missing schema markup'
      ]);
      description = 'Technical issue that should be addressed soon.';
      impact = 'medium';
    } else {
      title = faker.helpers.arrayElement([
        'Good SSL certificate',
        'All images are optimized',
        'All scripts are loaded in the correct order'
      ]);
      description = 'Good technical practice already implemented.';
      impact = 'low';
    }
  }
  
  return {
    id: faker.string.uuid(),
    title,
    description,
    status,
    score: status === 'good' ? 100 : status === 'warning' ? 50 : 0,
    previousScore: faker.number.int({ min: 0, max: 100 }),
    trend: faker.helpers.arrayElement(['up', 'down', 'neutral']),
    impact,
    solution: status !== 'good' ? `Fix the ${title.toLowerCase()} issue by updating your website.` : undefined,
    recommendation: status !== 'good' ? `We recommend addressing this ${impact} priority issue soon.` : undefined,
    affectedUrls: status !== 'good' ? ['/page1', '/page2', '/page3'] : undefined,
    value: status === 'good' ? 100 : status === 'warning' ? 50 : 0,
    helpText: status !== 'good' ? 'Click for more information about this issue' : 'This aspect of your site is well optimized'
  };
};
