
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
  lastModified?: string;
  wordCount?: number;
  headings?: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  uniquenessScore?: number;
  internalLinks?: number;
  externalLinks?: number;
  readabilityScore?: number;
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
  
  // Главная страница
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
    })),
    lastModified: faker.date.recent().toISOString(),
    wordCount: faker.number.int({ min: 300, max: 1200 }),
    headings: {
      h1: [faker.company.name()],
      h2: Array.from({ length: 3 }, () => faker.company.catchPhrase()),
      h3: Array.from({ length: 5 }, () => faker.commerce.productName()),
    },
    uniquenessScore: faker.number.int({ min: 60, max: 100 }),
    internalLinks: faker.number.int({ min: 5, max: 20 }),
    externalLinks: faker.number.int({ min: 0, max: 5 }),
    readabilityScore: faker.number.int({ min: 40, max: 90 }),
  });
  
  // Раздел типов страниц
  for (const pageType of pageTypes) {
    pages.push({
      url: `${baseUrl}/${pageType}`,
      title: `${pageType.charAt(0).toUpperCase() + pageType.slice(1)} - ${domain}`,
      content: faker.lorem.paragraphs(4),
      meta: {
        description: faker.lorem.sentence(10),
        keywords: faker.lorem.words(6)
      },
      images: Array.from({ length: 3 }, (_, i) => ({
        src: `/img/${pageType}-main-${i}.jpg`,
        alt: faker.lorem.words(4)
      })),
      lastModified: faker.date.recent().toISOString(),
      wordCount: faker.number.int({ min: 200, max: 800 }),
      headings: {
        h1: [`${pageType.charAt(0).toUpperCase() + pageType.slice(1)}`],
        h2: Array.from({ length: 2 }, () => faker.company.catchPhrase()),
        h3: Array.from({ length: 3 }, () => faker.commerce.productName()),
      },
      uniquenessScore: faker.number.int({ min: 70, max: 100 }),
      internalLinks: faker.number.int({ min: 3, max: 15 }),
      externalLinks: faker.number.int({ min: 0, max: 3 }),
      readabilityScore: faker.number.int({ min: 50, max: 95 }),
    });
  }
  
  // Индивидуальные страницы
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
    const hasDuplicateContent = Math.random() > 0.9; // 10% страниц имеют дублированный контент
    
    // Добавляем проблемные страницы для демонстрации проблем
    const hasProblems = Math.random() > 0.8; // 20% страниц имеют проблемы
    const missingH1 = hasProblems && Math.random() > 0.7;
    const tooManyH1 = hasProblems && !missingH1 && Math.random() > 0.7;
    const lowWordCount = hasProblems && Math.random() > 0.7;
    const poorReadability = hasProblems && Math.random() > 0.7;
    
    const h1Tags = missingH1 ? [] : (tooManyH1 ? [title, faker.commerce.productName()] : [title]);
    
    const pageContent: PageContent = {
      url: `${baseUrl}/${pageType}/${slug}`,
      title,
      content: hasDuplicateContent 
        ? pages[Math.floor(Math.random() * pages.length)].content 
        : faker.lorem.paragraphs(4),
      meta: {
        description: hasDescription ? faker.lorem.sentences(1) : undefined,
        keywords: hasKeywords ? faker.lorem.words(5) : undefined
      },
      images: Array.from({ length: Math.floor(Math.random() * 8) + 1 }, (_, i) => ({
        src: `/img/${pageType}-${slug}-${i}.jpg`,
        alt: hasAltTags ? faker.lorem.words(3) : undefined
      })),
      lastModified: faker.date.recent().toISOString(),
      wordCount: lowWordCount ? faker.number.int({ min: 50, max: 150 }) : faker.number.int({ min: 200, max: 1000 }),
      headings: {
        h1: h1Tags,
        h2: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, () => faker.company.catchPhrase()),
        h3: Array.from({ length: Math.floor(Math.random() * 6) }, () => faker.commerce.productName()),
      },
      uniquenessScore: hasDuplicateContent ? faker.number.int({ min: 20, max: 40 }) : faker.number.int({ min: 60, max: 100 }),
      internalLinks: faker.number.int({ min: 1, max: 12 }),
      externalLinks: faker.number.int({ min: 0, max: 4 }),
      readabilityScore: poorReadability ? faker.number.int({ min: 20, max: 40 }) : faker.number.int({ min: 50, max: 95 }),
    };
    
    pages.push(pageContent);
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
    
    // Добавляем призыв к действию
    optimized += '\n\n<div class="cta-block">\n';
    optimized += `  <h4>Готовы улучшить ваш сайт?</h4>\n`;
    optimized += `  <p>${faker.company.catchPhrase()}. Свяжитесь с нами сегодня для консультации.</p>\n`;
    optimized += `  <button class="cta-button">Начать сейчас</button>\n`;
    optimized += '</div>';
  } else {
    optimized = content;
  }
  
  return optimized;
}

export function improveSeoDescription(description: string): string {
  // Проверяем длину описания
  if (description.length < 50) {
    return description + ' ' + faker.commerce.productDescription();
  }
  
  if (description.length > 160) {
    // Сокращаем до оптимальной длины для мета-описания
    return description.substring(0, 156) + '...';
  }
  
  // Если в описании нет ключевых слов, добавляем их
  const commonKeywords = ['оптимизация', 'улучшение', 'SEO', 'результаты', 'рейтинг'];
  let hasKeyword = false;
  
  for (const keyword of commonKeywords) {
    if (description.toLowerCase().includes(keyword.toLowerCase())) {
      hasKeyword = true;
      break;
    }
  }
  
  if (!hasKeyword) {
    const randomKeyword = faker.helpers.arrayElement(commonKeywords);
    return `${randomKeyword.charAt(0).toUpperCase() + randomKeyword.slice(1)}: ${description}`;
  }
  
  return description;
}

export function generateSeoDescription(title: string, content: string): string {
  // Извлекаем ключевые слова из заголовка
  const titleWords = title.split(' ').filter(word => word.length > 3);
  
  // Берем первое предложение контента как основу
  const firstSentence = content.split('.')[0];
  
  // Формируем мета-описание
  let description = `${title} - ${firstSentence}.`;
  
  // Если описание слишком короткое, добавляем информацию
  if (description.length < 100) {
    description += ' ' + faker.commerce.productDescription();
  }
  
  // Если описание слишком длинное, сокращаем
  if (description.length > 160) {
    description = description.substring(0, 156) + '...';
  }
  
  return description;
}

export function generateKeywords(title: string, content: string): string {
  // Объединяем текст для анализа
  const combinedText = `${title} ${content.substring(0, 300)}`;
  
  // Разбиваем на слова и отфильтровываем короткие слова и стоп-слова
  const stopWords = ['и', 'в', 'на', 'с', 'по', 'для', 'не', 'от', 'к', 'за', 'из', 'что', 'это'];
  const words = combinedText.toLowerCase()
    .replace(/[^\wа-яё\s]/gi, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word));
  
  // Выбираем только уникальные слова
  const uniqueWords = [...new Set(words)];
  
  // Ограничиваем количество ключевых слов
  const limitedWords = uniqueWords.slice(0, 10);
  
  // Добавляем несколько двухсловных фраз
  const phrases = [];
  for (let i = 0; i < Math.min(3, limitedWords.length - 1); i++) {
    phrases.push(`${limitedWords[i]} ${limitedWords[i + 1]}`);
  }
  
  // Объединяем слова и фразы
  return [...limitedWords, ...phrases].join(', ');
}

/**
 * Анализирует контент на наличие проблем
 */
export function analyzeContentProblems(pages: PageContent[]): {
  duplicateContent: PageContent[];
  missingMeta: PageContent[];
  missingAltTags: PageContent[];
  lowWordCount: PageContent[];
  headingIssues: PageContent[];
  readabilityIssues: PageContent[];
} {
  // Находим страницы с дублированным контентом
  const contentMap = new Map<string, PageContent[]>();
  pages.forEach(page => {
    // Берем первые 200 символов для сравнения
    const contentKey = page.content.substring(0, 200);
    if (!contentMap.has(contentKey)) {
      contentMap.set(contentKey, []);
    }
    contentMap.get(contentKey)!.push(page);
  });
  
  const duplicateContent = Array.from(contentMap.values())
    .filter(pages => pages.length > 1)
    .flat();
  
  // Страницы с отсутствующими мета-тегами
  const missingMeta = pages.filter(page => 
    !page.meta.description || !page.meta.keywords || 
    page.meta.description.length < 10 || page.meta.keywords.length < 3
  );
  
  // Страницы с отсутствующими alt-тегами
  const missingAltTags = pages.filter(page => 
    page.images.some(img => !img.alt || img.alt.length < 3)
  );
  
  // Страницы с низким количеством слов
  const lowWordCount = pages.filter(page => 
    page.wordCount !== undefined && page.wordCount < 200
  );
  
  // Страницы с проблемами в заголовках
  const headingIssues = pages.filter(page => 
    page.headings && (
      page.headings.h1.length === 0 || 
      page.headings.h1.length > 1 ||
      page.headings.h2.length === 0
    )
  );
  
  // Страницы с проблемами читабельности
  const readabilityIssues = pages.filter(page => 
    page.readabilityScore !== undefined && page.readabilityScore < 50
  );
  
  return {
    duplicateContent,
    missingMeta,
    missingAltTags,
    lowWordCount,
    headingIssues,
    readabilityIssues
  };
}

/**
 * Расчет общего SEO-балла на основе контента
 */
export function calculateContentSeoScore(pages: PageContent[]): number {
  if (pages.length === 0) return 0;
  
  const problems = analyzeContentProblems(pages);
  
  const totalPages = pages.length;
  const duplicatePagesPct = (problems.duplicateContent.length / totalPages) * 100;
  const missingMetaPct = (problems.missingMeta.length / totalPages) * 100;
  const missingAltTagsPct = (problems.missingAltTags.length / totalPages) * 100;
  const lowWordCountPct = (problems.lowWordCount.length / totalPages) * 100;
  const headingIssuesPct = (problems.headingIssues.length / totalPages) * 100;
  const readabilityIssuesPct = (problems.readabilityIssues.length / totalPages) * 100;
  
  // Весовые коэффициенты для разных проблем
  const weights = {
    duplicate: 0.25,
    meta: 0.15,
    alt: 0.1,
    wordCount: 0.2,
    headings: 0.2,
    readability: 0.1
  };
  
  // Идеальный показатель - 0% проблем
  const idealScore = 100;
  
  // Вычитаем баллы за каждый тип проблемы
  const score = idealScore - (
    (duplicatePagesPct * weights.duplicate) +
    (missingMetaPct * weights.meta) +
    (missingAltTagsPct * weights.alt) +
    (lowWordCountPct * weights.wordCount) +
    (headingIssuesPct * weights.headings) +
    (readabilityIssuesPct * weights.readability)
  );
  
  return Math.max(0, Math.min(100, Math.round(score)));
}
