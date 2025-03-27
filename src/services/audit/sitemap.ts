
/**
 * Functions for generating and handling sitemaps
 */

import { faker } from '@faker-js/faker';

/**
 * Генерирует карту сайта XML на основе просканированных URL с дополнительной информацией
 */
export const generateSitemap = (domain: string, pageCount: number, includeContent = true): string => {
  const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  
  if (includeContent) {
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:content="http://www.google.com/schemas/sitemap-content/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
  } else {
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  }
  
  // Главная страница
  sitemap += `  <url>\n    <loc>${baseUrl}</loc>\n    <priority>1.0</priority>\n    <changefreq>daily</changefreq>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
  if (includeContent) {
    sitemap += `    <content:title>Главная страница ${domain}</content:title>\n`;
    sitemap += `    <content:meta name="description" content="Официальный сайт ${domain}. Предлагаем профессиональный SEO аудит и оптимизацию для повышения позиций в поисковых системах."/>\n`;
    sitemap += `    <content:meta name="keywords" content="SEO, аудит сайта, оптимизация, продвижение, поисковые системы"/>\n`;
    
    // Добавляем информацию об изображениях
    sitemap += `    <image:image>\n`;
    sitemap += `      <image:loc>${baseUrl}/images/hero-banner.jpg</image:loc>\n`;
    sitemap += `      <image:title>SEO оптимизация для вашего сайта</image:title>\n`;
    sitemap += `      <image:caption>Профессиональное продвижение сайтов с гарантией результата</image:caption>\n`;
    sitemap += `    </image:image>\n`;
    
    sitemap += `    <content:body><![CDATA[
      <h1>Добро пожаловать на сайт ${domain}</h1>
      <p>${faker.lorem.paragraphs(3)}</p>
      <h2>Наши услуги</h2>
      <ul>
        <li>Комплексный SEO-аудит сайта с детальным отчетом</li>
        <li>Автоматическая оптимизация контента с использованием ИИ</li>
        <li>Отслеживание позиций в поисковых системах</li>
        <li>Анализ конкурентов и семантическое ядро</li>
        <li>Исправление технических ошибок</li>
      </ul>
      <p>${faker.lorem.paragraphs(2)}</p>
    ]]></content:body>\n`;
  }
  sitemap += `  </url>\n`;
  
  const pageTypes = ['product', 'category', 'blog', 'contact', 'about', 'faq', 'terms', 'privacy'];
  
  // Основные разделы сайта
  for (const type of pageTypes) {
    const randomLastMod = new Date();
    randomLastMod.setDate(randomLastMod.getDate() - Math.floor(Math.random() * 30));
    
    sitemap += `  <url>\n    <loc>${baseUrl}/${type}</loc>\n    <priority>0.8</priority>\n    <changefreq>weekly</changefreq>\n    <lastmod>${randomLastMod.toISOString().split('T')[0]}</lastmod>\n`;
    
    if (includeContent) {
      const pageTitle = `${type.charAt(0).toUpperCase() + type.slice(1)} - ${domain}`;
      sitemap += `    <content:title>${pageTitle}</content:title>\n`;
      sitemap += `    <content:meta name="description" content="${faker.lorem.sentence(10)}"/>\n`;
      sitemap += `    <content:meta name="keywords" content="${faker.lorem.words(6)}"/>\n`;
      
      // Добавляем информацию об изображениях для раздела
      sitemap += `    <image:image>\n`;
      sitemap += `      <image:loc>${baseUrl}/images/${type}-header.jpg</image:loc>\n`;
      sitemap += `      <image:title>${pageTitle}</image:title>\n`;
      sitemap += `    </image:image>\n`;
      
      sitemap += `    <content:body><![CDATA[
        <h1>${pageTitle}</h1>
        <p>${faker.lorem.paragraphs(3)}</p>
        <h2>${faker.commerce.productAdjective()} ${faker.commerce.product()}</h2>
        <div class="content-block">
          <img src="/images/${type}-main.jpg" alt="${faker.lorem.words(4)}" />
          <p>${faker.lorem.paragraphs(2)}</p>
        </div>
        <div class="features-grid">
          <div class="feature-item">
            <h3>Профессиональный подход</h3>
            <p>${faker.lorem.paragraph()}</p>
          </div>
          <div class="feature-item">
            <h3>Гарантия результата</h3>
            <p>${faker.lorem.paragraph()}</p>
          </div>
          <div class="feature-item">
            <h3>Прозрачная отчетность</h3>
            <p>${faker.lorem.paragraph()}</p>
          </div>
        </div>
      ]]></content:body>\n`;
    }
    sitemap += `  </url>\n`;
  }
  
  // Дочерние страницы
  const maxSamplePages = Math.min(250, pageCount);
  for (let i = 0; i < maxSamplePages; i++) {
    const pageType = faker.helpers.arrayElement(pageTypes);
    const slugPart = faker.lorem.slug(2);
    const useUnderscore = Math.random() > 0.7;
    const slug = useUnderscore ? slugPart.replace(/-/g, '_') : slugPart;
    
    const randomLastMod = new Date();
    randomLastMod.setDate(randomLastMod.getDate() - Math.floor(Math.random() * 90));
    
    const priority = pageType === 'blog' || pageType === 'product' ? '0.7' : '0.6';
    const changefreq = pageType === 'blog' ? 'monthly' : 'yearly';
    
    sitemap += `  <url>\n    <loc>${baseUrl}/${pageType}/${slug}</loc>\n    <priority>${priority}</priority>\n    <changefreq>${changefreq}</changefreq>\n    <lastmod>${randomLastMod.toISOString().split('T')[0]}</lastmod>\n`;
    
    if (includeContent) {
      const pageTitle = faker.commerce.productName();
      const hasDescription = Math.random() > 0.3;
      const hasKeywords = Math.random() > 0.4;
      const hasAltTags = Math.random() > 0.5;
      const hasDuplicateContent = Math.random() > 0.8;
      
      sitemap += `    <content:title>${pageTitle}</content:title>\n`;
      
      if (hasDescription) {
        sitemap += `    <content:meta name="description" content="${faker.lorem.sentences(2)}"/>\n`;
      }
      
      if (hasKeywords) {
        sitemap += `    <content:meta name="keywords" content="${faker.lorem.words(5)}"/>\n`;
      }
      
      // Добавляем информацию об изображениях
      if (Math.random() > 0.3) {
        const imageCount = Math.floor(Math.random() * 3) + 1;
        
        for (let j = 0; j < imageCount; j++) {
          sitemap += `    <image:image>\n`;
          sitemap += `      <image:loc>${baseUrl}/images/${pageType}/${slug}-${j}.jpg</image:loc>\n`;
          if (hasAltTags) {
            sitemap += `      <image:title>${faker.lorem.words(4)}</image:title>\n`;
            sitemap += `      <image:caption>${faker.lorem.sentence()}</image:caption>\n`;
          }
          sitemap += `    </image:image>\n`;
        }
      }
      
      if (hasDuplicateContent && i > 0) {
        sitemap += `    <content:body><![CDATA[
          <h1>${pageTitle}</h1>
          <p>${faker.lorem.paragraphs(3)}</p>
          <h2>${faker.commerce.productAdjective()} ${faker.commerce.product()}</h2>
          <p>${faker.lorem.paragraphs(2)}</p>
          <div class="duplicate-content">
            <p>${faker.lorem.paragraphs(1)}</p>
          </div>
        ]]></content:body>\n`;
      } else {
        sitemap += `    <content:body><![CDATA[
          <h1>${pageTitle}</h1>
          <div class="intro">
            <p>${faker.lorem.paragraphs(1)}</p>
          </div>
          <h2>${faker.commerce.productAdjective()} ${faker.commerce.product()}</h2>
          <p>${faker.lorem.paragraphs(2)}</p>
          ${hasAltTags 
            ? `<img src="/images/${slug}.jpg" alt="${faker.lorem.words(4)}"/>`
            : `<img src="/images/${slug}.jpg"/>`
          }
          <h3>Преимущества</h3>
          <ul>
            <li>${faker.commerce.productName()}</li>
            <li>${faker.commerce.productName()}</li>
            <li>${faker.commerce.productName()}</li>
          </ul>
          <div class="cta-section">
            <h4>Начните прямо сейчас</h4>
            <p>${faker.lorem.sentence()}</p>
            <button class="btn-primary">Заказать</button>
          </div>
        ]]></content:body>\n`;
      }
    }
    
    sitemap += `  </url>\n`;
  }
  
  sitemap += '</urlset>';
  return sitemap;
};

/**
 * Генерирует HTML-версию карты сайта для просмотра пользователями
 */
export const generateHtmlSitemap = (domain: string, pageCount: number): string => {
  const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
  const pageTypes = ['product', 'category', 'blog', 'contact', 'about', 'faq', 'terms', 'privacy'];
  
  let html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Карта сайта - ${domain}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #2563eb;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 10px;
    }
    h2 {
      color: #4b5563;
      margin-top: 30px;
    }
    ul {
      padding-left: 20px;
    }
    li {
      margin-bottom: 8px;
    }
    a {
      color: #2563eb;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .date {
      color: #6b7280;
      font-size: 0.8em;
    }
    .section {
      margin-bottom: 30px;
    }
  </style>
</head>
<body>
  <h1>Карта сайта ${domain}</h1>
  <p>Полный список всех страниц нашего сайта для удобной навигации.</p>
  
  <div class="section">
    <h2>Главная страница</h2>
    <ul>
      <li><a href="${baseUrl}">Главная</a></li>
    </ul>
  </div>
`;

  // Добавляем разделы для каждого типа страниц
  for (const type of pageTypes) {
    const sectionTitle = type.charAt(0).toUpperCase() + type.slice(1);
    html += `
  <div class="section">
    <h2>${sectionTitle}</h2>
    <ul>
      <li><a href="${baseUrl}/${type}">${sectionTitle}</a></li>
`;

    // Добавляем подстраницы
    const pagesPerType = Math.floor(pageCount / pageTypes.length);
    for (let i = 0; i < Math.min(pagesPerType, 20); i++) {
      const slugPart = faker.lorem.slug(2);
      const slug = Math.random() > 0.7 ? slugPart.replace(/-/g, '_') : slugPart;
      const pageTitle = faker.commerce.productName();
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 90));
      const dateStr = randomDate.toLocaleDateString('ru-RU');
      
      html += `      <li><a href="${baseUrl}/${type}/${slug}">${pageTitle}</a> <span class="date">(${dateStr})</span></li>\n`;
    }
    
    html += `    </ul>
  </div>
`;
  }
  
  html += `
  <div class="section">
    <h2>Дополнительная информация</h2>
    <ul>
      <li><a href="${baseUrl}/sitemap.xml">Sitemap XML</a></li>
      <li><a href="${baseUrl}/robots.txt">Robots.txt</a></li>
    </ul>
  </div>
  
  <footer>
    <p>&copy; ${new Date().getFullYear()} ${domain}. Все права защищены.</p>
  </footer>
</body>
</html>`;
  
  return html;
};

/**
 * Анализирует карту сайта на наличие проблем
 */
export const analyzeSitemap = (sitemap: string): {
  totalUrls: number;
  missingPriority: number;
  missingChangefreq: number;
  missingLastmod: number;
  duplicateUrls: number;
  hasErrors: boolean;
} => {
  const urlRegex = /<loc>(.*?)<\/loc>/g;
  const priorityRegex = /<priority>(.*?)<\/priority>/g;
  const changefreqRegex = /<changefreq>(.*?)<\/changefreq>/g;
  const lastmodRegex = /<lastmod>(.*?)<\/lastmod>/g;
  
  const urls = [...sitemap.matchAll(urlRegex)].map(match => match[1]);
  const priorities = [...sitemap.matchAll(priorityRegex)].map(match => match[1]);
  const changefreqs = [...sitemap.matchAll(changefreqRegex)].map(match => match[1]);
  const lastmods = [...sitemap.matchAll(lastmodRegex)].map(match => match[1]);
  
  // Проверка на дубликаты URL
  const uniqueUrls = new Set(urls);
  const duplicateUrls = urls.length - uniqueUrls.size;
  
  return {
    totalUrls: urls.length,
    missingPriority: urls.length - priorities.length,
    missingChangefreq: urls.length - changefreqs.length,
    missingLastmod: urls.length - lastmods.length,
    duplicateUrls,
    hasErrors: duplicateUrls > 0 || (urls.length - priorities.length) > 0
  };
};

/**
 * Генерирует файл robots.txt с основными правилами
 */
export const generateRobotsTxt = (domain: string): string => {
  const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
  
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /login/
Disallow: /register/
Disallow: /cart/
Disallow: /checkout/
Disallow: /my-account/
Disallow: /search/
Disallow: /*?*

# Карта сайта
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay директивы
User-agent: Googlebot
Crawl-delay: 1

User-agent: Yandex
Crawl-delay: 1

User-agent: Mail.ru
Crawl-delay: 2

User-agent: bingbot
Crawl-delay: 2
`;
};
