
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
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:content="http://www.google.com/schemas/sitemap-content/1.0">\n';
  } else {
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  }
  
  sitemap += `  <url>\n    <loc>${baseUrl}</loc>\n    <priority>1.0</priority>\n`;
  if (includeContent) {
    sitemap += `    <content:title>Главная страница ${domain}</content:title>\n`;
    sitemap += `    <content:meta name="description" content="Официальный сайт ${domain}"/>\n`;
    sitemap += `    <content:body><![CDATA[
      <h1>Добро пожаловать на сайт ${domain}</h1>
      <p>${faker.lorem.paragraphs(3)}</p>
      <h2>Наши услуги</h2>
      <ul>
        <li>Услуга 1</li>
        <li>Услуга 2</li>
        <li>Услуга 3</li>
      </ul>
      <p>${faker.lorem.paragraphs(2)}</p>
    ]]></content:body>\n`;
  }
  sitemap += `  </url>\n`;
  
  const pageTypes = ['product', 'category', 'blog', 'contact', 'about', 'faq', 'terms', 'privacy'];
  
  for (const type of pageTypes) {
    sitemap += `  <url>\n    <loc>${baseUrl}/${type}</loc>\n    <priority>0.8</priority>\n`;
    if (includeContent) {
      const pageTitle = `${type.charAt(0).toUpperCase() + type.slice(1)} - ${domain}`;
      sitemap += `    <content:title>${pageTitle}</content:title>\n`;
      sitemap += `    <content:meta name="description" content="${faker.lorem.sentence(10)}"/>\n`;
      sitemap += `    <content:meta name="keywords" content="${faker.lorem.words(6)}"/>\n`;
      
      sitemap += `    <content:body><![CDATA[
        <h1>${pageTitle}</h1>
        <p>${faker.lorem.paragraphs(3)}</p>
        <h2>${faker.commerce.productAdjective()} ${faker.commerce.product()}</h2>
        <div class="content-block">
          <img src="/images/${type}-main.jpg" alt="${faker.lorem.words(4)}" />
          <p>${faker.lorem.paragraphs(2)}</p>
        </div>
      ]]></content:body>\n`;
    }
    sitemap += `  </url>\n`;
  }
  
  const maxSamplePages = Math.min(250, pageCount);
  for (let i = 0; i < maxSamplePages; i++) {
    const pageType = faker.helpers.arrayElement(pageTypes);
    const slugPart = faker.lorem.slug(2);
    const useUnderscore = Math.random() > 0.7;
    const slug = useUnderscore ? slugPart.replace(/-/g, '_') : slugPart;
    
    sitemap += `  <url>\n    <loc>${baseUrl}/${pageType}/${slug}</loc>\n    <priority>0.6</priority>\n`;
    
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
          <p>${faker.lorem.paragraphs(3)}</p>
          <h2>${faker.commerce.productAdjective()} ${faker.commerce.product()}</h2>
          <p>${faker.lorem.paragraphs(2)}</p>
          ${hasAltTags 
            ? `<img src="/images/${slug}.jpg" alt="${faker.lorem.words(4)}"/>`
            : `<img src="/images/${slug}.jpg"/>`
          }
        ]]></content:body>\n`;
      }
    }
    
    sitemap += `  </url>\n`;
  }
  
  sitemap += '</urlset>';
  return sitemap;
};
