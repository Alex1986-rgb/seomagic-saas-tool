
/**
 * Functions for content collection and processing
 */

import { faker } from '@faker-js/faker';

export interface PageContent {
  url: string;
  title: string;
  content: string;
  meta: {
    description?: string;
    keywords?: string;
  };
  images: {
    src: string;
    alt?: string;
  }[];
  optimized?: {
    content: string;
    meta?: {
      description?: string;
      keywords?: string;
    };
    score: number;
  };
}

/**
 * Собирает контент всех страниц
 */
export const collectPagesContent = async (
  domain: string,
  pageCount: number
): Promise<PageContent[]> => {
  const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
  const pages: PageContent[] = [];
  const pageTypes = ['product', 'category', 'blog', 'contact', 'about', 'faq', 'terms', 'privacy'];
  
  pages.push({
    url: baseUrl,
    title: `${domain} - Главная страница`,
    content: faker.lorem.paragraphs(5),
    meta: {
      description: faker.lorem.sentences(2),
      keywords: faker.lorem.words(8)
    },
    images: Array.from({ length: 5 }, (_, i) => ({
      src: `/img/home-${i}.jpg`,
      alt: Math.random() > 0.3 ? faker.lorem.words(3) : undefined
    }))
  });
  
  const maxSamplePages = Math.min(250, pageCount);
  for (let i = 0; i < maxSamplePages; i++) {
    const pageType = faker.helpers.arrayElement(pageTypes);
    const slugPart = faker.lorem.slug(2);
    const useUnderscore = Math.random() > 0.7;
    const slug = useUnderscore ? slugPart.replace(/-/g, '_') : slugPart;
    const title = faker.commerce.productName();
    
    const hasDescription = Math.random() > 0.3;
    const hasKeywords = Math.random() > 0.4;
    const hasAltTags = Math.random() > 0.5;
    
    pages.push({
      url: `${baseUrl}/${pageType}/${slug}`,
      title,
      content: faker.lorem.paragraphs(4),
      meta: {
        description: hasDescription ? faker.lorem.sentences(1) : undefined,
        keywords: hasKeywords ? faker.lorem.words(5) : undefined
      },
      images: Array.from({ length: Math.floor(Math.random() * 8) + 1 }, (_, i) => ({
        src: `/img/${pageType}-${slug}-${i}.jpg`,
        alt: hasAltTags ? faker.lorem.words(3) : undefined
      }))
    });
  }
  
  return pages;
};

/**
 * Вспомогательные функции для оптимизации контента
 */
export function optimizePageContent(content: string): string {
  const paragraphs = content.split('\n\n');
  
  let optimized = '';
  if (paragraphs.length > 2) {
    optimized += `<h2>${faker.commerce.productAdjective()} ${faker.commerce.product()}</h2>\n\n`;
    optimized += paragraphs[0] + '\n\n';
    
    optimized += `<h3>${faker.commerce.productName()}</h3>\n\n`;
    optimized += paragraphs.slice(1, 2).join('\n\n') + '\n\n';
    
    optimized += `<h3>${faker.company.catchPhrase()}</h3>\n\n`;
    optimized += paragraphs.slice(2).join('\n\n');
    
    optimized += '\n\n<ul>\n';
    for (let i = 0; i < 4; i++) {
      optimized += `  <li>${faker.commerce.productName()}: ${faker.commerce.productDescription()}</li>\n`;
    }
    optimized += '</ul>';
  } else {
    optimized = content;
  }
  
  return optimized;
}

export function improveSeoDescription(description: string): string {
  return description + ' ' + faker.commerce.productDescription();
}

export function generateSeoDescription(title: string, content: string): string {
  return `${title} - ${faker.commerce.productDescription()}. ${content.substring(0, 100)}...`;
}

export function generateKeywords(title: string, content: string): string {
  const words = [...title.split(' '), ...content.substring(0, 200).split(' ')];
  const uniqueWords = [...new Set(words)].filter(w => w.length > 3).slice(0, 10);
  return uniqueWords.join(', ');
}
