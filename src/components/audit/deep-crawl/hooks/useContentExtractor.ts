
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ContentExtractor, contentExtractorService } from '@/services/audit/contentExtractor/contentExtractor';
import { ExtractedSite, ExtractionOptions, ContentExtractionProgress } from '@/services/audit/contentExtractor/types';
import { saveAs } from 'file-saver';

export const useContentExtractor = () => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedSite, setExtractedSite] = useState<ExtractedSite | null>(null);
  const [progress, setProgress] = useState<ContentExtractionProgress>({
    completed: 0,
    total: 0,
    isComplete: false
  });
  const { toast } = useToast();

  const extractContent = async (urls: string[], domain: string, options: ExtractionOptions = {}) => {
    setIsExtracting(true);
    setProgress({
      completed: 0,
      total: urls.length,
      isComplete: false
    });
    
    try {
      // Установка параметров аудита с учетом большого количества страниц
      const extractionOptions: ExtractionOptions = {
        includeHtml: true,
        includeText: true,
        includeMetaTags: true,
        includeHeadings: true,
        includeLinks: true,
        includeImages: true,
        maxConcurrent: 5, // Ограничиваем количество одновременных запросов
        timeout: 30000, // Увеличиваем таймаут для больших страниц
        retryCount: 3, // Количество повторных попыток при ошибке
        ...options,
        onProgress: (completed, total) => {
          setProgress({
            completed,
            total,
            currentUrl: urls[completed - 1], // URL, который мы только что завершили
            isComplete: completed === total
          });
          
          // Обновление прогресса с учетом масштаба сайта
          const progressPercent = Math.round((completed / total) * 100);
          const progressMessage = total > 100 
            ? `Обработано ${completed} из ${total} страниц (${progressPercent}%). Обработка больших сайтов может занять некоторое время.` 
            : `Обработано ${completed} из ${total} страниц (${progressPercent}%)`;
            
          toast({
            title: "Извлечение контента",
            description: progressMessage,
            duration: 3000,
          });
          
          // Также вызываем пользовательский onProgress, если он существует
          if (options.onProgress) {
            options.onProgress(completed, total);
          }
        }
      };

      // Разбиваем большие сайты на пакеты для более эффективной обработки
      const batchSize = 50;
      const batches = [];
      for (let i = 0; i < urls.length; i += batchSize) {
        batches.push(urls.slice(i, i + batchSize));
      }
      
      const allExtractedContent = new Map();
      let processedTotal = 0;
      
      // Последовательно обрабатываем пакеты
      for (const batch of batches) {
        const extractedBatch = await contentExtractorService.extractFromUrls(
          batch,
          (processed, total, currentUrl) => {
            const onProgress = extractionOptions.onProgress;
            if (onProgress) {
              onProgress(processedTotal + processed, urls.length);
            }
          }
        );
        
        // Объединяем результаты
        for (const [url, content] of extractedBatch.entries()) {
          allExtractedContent.set(url, content);
        }
        
        processedTotal += batch.length;
      }
      
      // Конвертируем извлеченный контент в формат ExtractedSite
      const site: ExtractedSite = {
        domain,
        extractedAt: new Date().toISOString(),
        pageCount: allExtractedContent.size,
        pages: Array.from(allExtractedContent.values()).map(content => ({
          url: content.url,
          title: content.title,
          content: content.text,
          html: content.html,
          meta: {
            description: content.metaTags.description || null,
            keywords: content.metaTags.keywords || null,
            author: content.metaTags.author || null,
            robots: content.metaTags.robots || null
          },
          headings: {
            h1: content.headings.h1,
            h2: content.headings.h2,
            h3: content.headings.h3
          },
          links: {
            internal: content.links.filter(link => link.includes(domain)),
            external: content.links.filter(link => !link.includes(domain))
          },
          images: content.images.map(img => ({
            url: img.src,
            alt: img.alt || null,
            title: img.title || null
          })),
          // Добавляем анализ качества контента
          contentAnalysis: {
            wordCount: content.text.split(/\s+/).length,
            readabilityScore: calculateReadabilityScore(content.text),
            keywordDensity: analyzeKeywordDensity(content.text),
            duplicateContentRisk: checkDuplicateContentRisk(content.text)
          }
        }))
      };
      
      setExtractedSite(site);
      
      // Общая статистика аудита
      const stats = {
        totalPages: site.pages.length,
        averageWordCount: Math.round(site.pages.reduce((sum, page) => sum + (page.contentAnalysis?.wordCount || 0), 0) / site.pages.length),
        metaTagsQuality: analyzeMetaTagsQuality(site),
        headingsStructure: analyzeHeadingsStructure(site),
        internalLinking: analyzeInternalLinking(site)
      };
      
      toast({
        title: "Извлечение завершено",
        description: `Успешно обработано ${site.pages.length} страниц. Средний объем контента: ${stats.averageWordCount} слов.`,
      });

      return site;
    } catch (error) {
      console.error('Error during content extraction:', error);
      toast({
        title: "Ошибка извлечения",
        description: "Произошла ошибка при извлечении контента. Попробуйте уменьшить количество страниц или увеличить таймаут.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsExtracting(false);
      setProgress(prev => ({ ...prev, isComplete: true }));
    }
  };

  const exportContent = async (format: 'json' | 'html' | 'markdown' | 'sitemap' | 'all') => {
    if (!extractedSite) {
      toast({
        title: "Ошибка",
        description: "Нет данных для экспорта",
        variant: "destructive"
      });
      return;
    }

    try {
      switch (format) {
        case 'json': {
          // Экспорт в JSON с форматированием для лучшей читаемости
          const jsonBlob = new Blob([JSON.stringify(extractedSite, null, 2)], { type: 'application/json' });
          saveAs(jsonBlob, `${extractedSite.domain}-content.json`);
          break;
        }
        case 'html': {
          // Используем метод exportToHtml из contentExtractorService
          const htmlContent = contentExtractorService.exportToHtml();
          const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
          saveAs(htmlBlob, `${extractedSite.domain}-sitemap.html`);
          break;
        }
        case 'markdown': {
          // Используем метод exportToMarkdown из contentExtractorService
          const markdownContent = contentExtractorService.exportToMarkdown();
          const mdBlob = new Blob([markdownContent], { type: 'text/markdown' });
          saveAs(mdBlob, `${extractedSite.domain}-sitemap.md`);
          break;
        }
        case 'sitemap': {
          // Генерируем sitemap XML вручную
          const sitemapXml = generateSitemapXml(extractedSite);
          const xmlBlob = new Blob([sitemapXml], { type: 'text/xml' });
          saveAs(xmlBlob, `sitemap.xml`);
          break;
        }
        case 'all': {
          // Используем метод downloadAll из contentExtractorService
          await contentExtractorService.downloadAll(`${extractedSite.domain}-content.zip`);
          break;
        }
      }

      toast({
        title: "Экспорт завершен",
        description: `Контент успешно экспортирован в формат ${format}`,
      });
    } catch (error) {
      console.error('Error during export:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Произошла ошибка при экспорте контента",
        variant: "destructive"
      });
    }
  };

  // Функция для генерации sitemap XML
  const generateSitemapXml = (site: ExtractedSite): string => {
    const now = new Date().toISOString().split('T')[0];
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<?xml-stylesheet type="text/xsl" href="https://www.sitemaps.org/xsl/sitemap.xsl"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const page of site.pages) {
      // Определяем приоритет страницы на основе глубины URL и наличия контента
      const urlDepth = page.url.split('/').length - 3; // Вычитаем схему и домен
      let priority = 0.8;
      
      if (page.url.endsWith('/') || page.url.endsWith('/index.html')) {
        priority = 1.0; // Домашняя или индексная страница
      } else if (urlDepth <= 1) {
        priority = 0.9; // Страница верхнего уровня
      } else if (urlDepth >= 4) {
        priority = 0.6; // Глубоко вложенная страница
      }
      
      // Определяем частоту изменений на основе типа страницы
      let changefreq = 'monthly';
      
      if (page.url.includes('blog') || page.url.includes('news')) {
        changefreq = 'weekly';
      } else if (page.url.includes('product') || page.url.includes('catalog')) {
        changefreq = 'daily';
      } else if (page.url.includes('about') || page.url.includes('contact')) {
        changefreq = 'yearly';
      }
      
      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(page.url)}</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += `    <changefreq>${changefreq}</changefreq>\n`;
      xml += `    <priority>${priority.toFixed(1)}</priority>\n`;
      xml += '  </url>\n';
    }
    
    xml += '</urlset>';
    
    return xml;
  };
  
  // Функция для проверки читаемости текста (uproshennyy algorythm Flesch-Kincaid)
  const calculateReadabilityScore = (text: string): number => {
    if (!text || text.length === 0) return 0;
    
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.trim().length > 0);
    
    if (sentences.length === 0 || words.length === 0) return 0;
    
    const syllables = words.reduce((count, word) => {
      // Примерный подсчет слогов для русского и английского текста
      return count + (word.length > 3 ? Math.ceil(word.length / 3) : 1);
    }, 0);
    
    // Упрощенная формула читаемости (0-100, где 100 - самый легкий для чтения)
    const averageWordsPerSentence = words.length / sentences.length;
    const averageSyllablesPerWord = syllables / words.length;
    
    const readability = 206.835 - (1.015 * averageWordsPerSentence) - (84.6 * averageSyllablesPerWord);
    
    // Ограничиваем значения в диапазоне 0-100
    return Math.min(100, Math.max(0, readability));
  };
  
  // Функция для анализа плотности ключевых слов
  const analyzeKeywordDensity = (text: string): Record<string, number> => {
    if (!text || text.length === 0) return {};
    
    const words = text.toLowerCase()
      .replace(/[^\p{L}\s]/gu, '') // Удаляем все, кроме букв и пробелов
      .split(/\s+/)
      .filter(w => w.length > 3); // Игнорируем короткие слова
    
    const totalWords = words.length;
    if (totalWords === 0) return {};
    
    // Подсчитываем частоту слов
    const wordFreq: Record<string, number> = {};
    for (const word of words) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
    
    // Преобразуем в процентную плотность и отбираем топ-10 слов
    const density: Record<string, number> = {};
    const sortedWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    for (const [word, count] of sortedWords) {
      density[word] = parseFloat(((count / totalWords) * 100).toFixed(2));
    }
    
    return density;
  };
  
  // Функция для оценки риска дублированного контента
  const checkDuplicateContentRisk = (text: string): 'low' | 'medium' | 'high' => {
    if (!text || text.length < 100) return 'low';
    
    // Оценка уникальности на основе длины и структуры текста
    const normalizedText = text.toLowerCase().replace(/\s+/g, ' ').trim();
    
    // Проверка на общие шаблонные фразы
    const templatePhrases = [
      'свяжитесь с нами', 'наши контакты', 'о компании', 'наши услуги',
      'подробнее', 'читать далее', 'оставить заявку', 'заказать звонок'
    ];
    
    let templateCount = 0;
    for (const phrase of templatePhrases) {
      if (normalizedText.includes(phrase)) {
        templateCount++;
      }
    }
    
    // Проверка на разнообразие текста (отношение уникальных слов к общему количеству)
    const words = normalizedText.split(/\s+/);
    const uniqueWords = new Set(words).size;
    const uniqueRatio = uniqueWords / words.length;
    
    if (uniqueRatio < 0.4 || templateCount > 4) {
      return 'high';
    } else if (uniqueRatio < 0.6 || templateCount > 2) {
      return 'medium';
    } else {
      return 'low';
    }
  };
  
  // Анализ качества мета-тегов
  const analyzeMetaTagsQuality = (site: ExtractedSite): { score: number, issues: string[] } => {
    const issues: string[] = [];
    let totalScore = 0;
    
    for (const page of site.pages) {
      let pageScore = 0;
      
      // Проверка наличия и длины мета-описания
      if (page.meta.description) {
        const descLength = page.meta.description.length;
        if (descLength >= 120 && descLength <= 160) {
          pageScore += 2; // Оптимальная длина
        } else if (descLength < 50 || descLength > 200) {
          if (issues.length < 5) {
            issues.push(`Неоптимальная длина мета-описания на странице ${page.url}`);
          }
        } else {
          pageScore += 1; // Приемлемая длина
        }
      } else {
        if (issues.length < 5) {
          issues.push(`Отсутствует мета-описание на странице ${page.url}`);
        }
      }
      
      // Проверка наличия и качества ключевых слов
      if (page.meta.keywords) {
        const keywords = page.meta.keywords.split(',').map(k => k.trim());
        if (keywords.length >= 3 && keywords.length <= 10) {
          pageScore += 1;
        }
      }
      
      totalScore += pageScore;
    }
    
    // Нормализуем оценку от 0 до 100
    const maxPossibleScore = site.pages.length * 3; // 3 балла на страницу
    const normalizedScore = Math.round((totalScore / maxPossibleScore) * 100);
    
    return { score: normalizedScore, issues };
  };
  
  // Анализ структуры заголовков
  const analyzeHeadingsStructure = (site: ExtractedSite): { score: number, issues: string[] } => {
    const issues: string[] = [];
    let totalScore = 0;
    
    for (const page of site.pages) {
      let pageScore = 0;
      
      // Проверка наличия H1
      if (page.headings.h1 && page.headings.h1.length > 0) {
        if (page.headings.h1.length === 1) {
          pageScore += 2; // Один H1 - оптимально
        } else {
          if (issues.length < 5) {
            issues.push(`Несколько H1 на странице ${page.url}`);
          }
        }
      } else {
        if (issues.length < 5) {
          issues.push(`Отсутствует H1 на странице ${page.url}`);
        }
      }
      
      // Проверка иерархии заголовков
      const hasH2 = page.headings.h2 && page.headings.h2.length > 0;
      const hasH3 = page.headings.h3 && page.headings.h3.length > 0;
      
      if (hasH2) {
        pageScore += 1;
      }
      
      if (hasH3 && !hasH2) {
        if (issues.length < 5) {
          issues.push(`Нарушена иерархия заголовков на странице ${page.url} (H3 без H2)`);
        }
      }
      
      totalScore += pageScore;
    }
    
    // Нормализуем оценку от 0 до 100
    const maxPossibleScore = site.pages.length * 3; // 3 балла на страницу
    const normalizedScore = Math.round((totalScore / maxPossibleScore) * 100);
    
    return { score: normalizedScore, issues };
  };
  
  // Анализ внутренних ссылок
  const analyzeInternalLinking = (site: ExtractedSite): { score: number, issues: string[] } => {
    const issues: string[] = [];
    let totalScore = 0;
    
    // Подсчитываем входящие ссылки для каждой страницы
    const incomingLinks: Record<string, number> = {};
    
    for (const page of site.pages) {
      // Инициализируем счетчик для всех URL
      if (!incomingLinks[page.url]) {
        incomingLinks[page.url] = 0;
      }
      
      // Подсчитываем исходящие ссылки
      const outgoingInternalLinks = page.links.internal.length;
      
      // Засчитываем как входящие для целевых страниц
      for (const link of page.links.internal) {
        incomingLinks[link] = (incomingLinks[link] || 0) + 1;
      }
      
      // Оцениваем страницу по количеству исходящих внутренних ссылок
      if (outgoingInternalLinks >= 3 && outgoingInternalLinks <= 100) {
        totalScore += 1;
      } else if (outgoingInternalLinks > 100) {
        if (issues.length < 5) {
          issues.push(`Слишком много внутренних ссылок (${outgoingInternalLinks}) на странице ${page.url}`);
        }
      } else if (outgoingInternalLinks === 0) {
        if (issues.length < 5) {
          issues.push(`Нет внутренних ссылок на странице ${page.url} (orphaned page)`);
        }
      }
    }
    
    // Проверяем страницы с малым количеством входящих ссылок
    for (const page of site.pages) {
      const incoming = incomingLinks[page.url] || 0;
      
      if (incoming === 0 && page.url !== site.domain) {
        if (issues.length < 10) {
          issues.push(`На страницу ${page.url} нет внутренних ссылок`);
        }
      }
    }
    
    // Нормализуем оценку от 0 до 100
    const maxPossibleScore = site.pages.length;
    const normalizedScore = Math.round((totalScore / maxPossibleScore) * 100);
    
    return { score: normalizedScore, issues };
  };
  
  // Вспомогательная функция для экранирования XML спецсимволов
  const escapeXml = (unsafe: string): string => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  return {
    isExtracting,
    extractedSite,
    progress,
    extractContent,
    exportContent
  };
};
