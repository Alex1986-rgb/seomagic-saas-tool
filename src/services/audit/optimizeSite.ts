
import { PageContent, OptimizationMetrics } from './optimization/types';
import { collectPagesContent } from './content';
import { analyzeContent, calculatePageOptimizationScore } from './optimization/contentAnalyzer';
import { OpenAIIntegration } from '../api/openAIIntegration';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Оптимизирует сайт на основе результатов анализа
 */
export const optimizeSite = async (
  urls: string[],
  prompt: string,
  openAIApiKey: string,
  onProgress?: (current: number, total: number, currentUrl: string) => void
): Promise<Blob> => {
  try {
    // Собираем контент страниц
    const pagesContent = await collectPagesContent(
      urls.slice(0, 100), // Ограничиваем до 100 страниц для производительности
      100,
      (current, total) => {
        if (onProgress) {
          onProgress(current, total, urls[current - 1]);
        }
      }
    );
    
    // Анализируем контент
    const analysis = analyzeContent(pagesContent);
    
    // Создаем интеграцию с OpenAI
    const openAI = new OpenAIIntegration(openAIApiKey);
    
    // Оптимизируем страницы
    const optimizedPages: PageContent[] = [];
    for (let i = 0; i < pagesContent.length; i++) {
      const page = pagesContent[i];
      
      // Определяем, нужно ли оптимизировать страницу
      const needsOptimization = !page.meta.description || 
        !page.meta.keywords || 
        page.wordCount < 300 || 
        page.headings.h1.length === 0;
      
      if (needsOptimization) {
        // Оптимизируем страницу с помощью OpenAI
        const optimizedPage = await openAI.optimizePage(page, prompt);
        optimizedPages.push(optimizedPage);
      } else {
        // Если оптимизация не требуется, добавляем страницу без изменений
        optimizedPages.push(page);
      }
      
      // Обновляем прогресс
      if (onProgress) {
        onProgress(
          Math.floor(pagesContent.length + i + 1), 
          pagesContent.length * 2, 
          page.url
        );
      }
    }
    
    // Создаем ZIP-архив с оптимизированными страницами
    const zip = new JSZip();
    
    // Добавляем оптимизированные страницы в архив
    for (const page of optimizedPages) {
      // Преобразуем URL в путь к файлу
      let filePath = page.url.replace(/^https?:\/\//, '');
      if (filePath.endsWith('/')) {
        filePath += 'index.html';
      } else if (!filePath.includes('.')) {
        filePath += '/index.html';
      }
      
      // Генерируем HTML для страницы
      const html = generateOptimizedHtml(page);
      
      // Добавляем файл в архив
      zip.file(filePath, html);
    }
    
    // Добавляем отчет об оптимизации
    zip.file('optimization-report.json', JSON.stringify({
      pagesOptimized: optimizedPages.length,
      analysis,
      prompt,
      optimizedPages: optimizedPages.map(page => ({
        url: page.url,
        title: page.title,
        metaDescription: page.meta.description,
        metaKeywords: page.meta.keywords,
        headings: page.headings,
        score: calculatePageOptimizationScore(page)
      }))
    }, null, 2));
    
    // Создаем архив
    return await zip.generateAsync({ type: 'blob' });
  } catch (error) {
    console.error('Error optimizing site:', error);
    throw error;
  }
};

/**
 * Генерирует оптимизированный HTML для страницы
 */
const generateOptimizedHtml = (page: PageContent): string => {
  // Используем оптимизированный контент, если он есть
  const content = page.optimized?.content || page.content;
  
  // Используем оптимизированные мета-теги, если они есть
  const metaDescription = page.optimized?.meta?.description || page.meta.description || '';
  const metaKeywords = page.optimized?.meta?.keywords || page.meta.keywords || '';
  
  // Генерируем HTML
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title}</title>
  <meta name="description" content="${metaDescription}">
  <meta name="keywords" content="${metaKeywords}">
</head>
<body>
  <header>
    <h1>${page.headings.h1[0] || page.title}</h1>
  </header>
  <main>
    ${content}
  </main>
  <footer>
    <p>© ${new Date().getFullYear()} Оптимизировано с помощью AI</p>
  </footer>
</body>
</html>`;
};
