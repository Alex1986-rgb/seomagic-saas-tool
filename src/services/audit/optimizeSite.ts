import { PageContent } from './optimization/types';
import { collectPagesContent } from './content';
import { analyzeContent, calculatePageOptimizationScore } from './optimization/contentAnalyzer';
import { injectSeoBlock, SeoBlock } from './optimization/htmlInjector';
import { OpenAIIntegration } from '../api/openAIIntegration';
import JSZip from 'jszip';

export interface OptimizeSiteOptions {
  /**
   * Сколько страниц обрабатывать. Раньше здесь стояло жёсткое 100,
   * из-за чего крупные сайты оптимизировались частично и молча.
   */
  maxPages?: number;
  /** Заменять <title> и meta description на сгенерированные */
  updateMeta?: boolean;
}

const DEFAULT_MAX_PAGES = 1000;

/**
 * Оптимизирует сайт: собирает страницы, дописывает недостающий SEO-контент
 * и ВСТРАИВАЕТ его в исходную вёрстку каждой страницы.
 *
 * Важно: страницы не пересобираются. Шапка, меню, стили, формы и скрипты
 * сайта остаются нетронутыми — добавляется только блок перед подвалом
 * и правятся мета-теги.
 */
export const optimizeSite = async (
  urls: string[],
  prompt: string,
  openAIApiKey: string,
  onProgress?: (current: number, total: number, currentUrl: string) => void,
  options: OptimizeSiteOptions = {}
): Promise<Blob> => {
  const maxPages = options.maxPages ?? DEFAULT_MAX_PAGES;
  const targets = urls.slice(0, maxPages);
  const skipped = Math.max(0, urls.length - targets.length);

  try {
    // Этап 1 из 2 — сбор страниц (вместе с исходной разметкой)
    const pagesContent = await collectPagesContent(targets, maxPages, (current, total) => {
      onProgress?.(current, total * 2, targets[current - 1] ?? '');
    });

    const analysis = analyzeContent(pagesContent);

    const zip = new JSZip();
    const report: Array<Record<string, unknown>> = [];
    let optimizedCount = 0;
    let untouchedCount = 0;
    let noHtmlCount = 0;

    const openAI = new OpenAIIntegration(openAIApiKey);

    // Этап 2 из 2 — генерация и встраивание
    for (let i = 0; i < pagesContent.length; i++) {
      const page = pagesContent[i];

      const needsOptimization =
        !page.meta?.description ||
        !page.meta?.keywords ||
        (page.wordCount ?? 0) < 300 ||
        (page.headings?.h1?.length ?? 0) === 0;

      let optimized: PageContent = page;
      if (needsOptimization) {
        optimized = await openAI.optimizePage(page, prompt);
      }

      const html = buildPageHtml(page, optimized, needsOptimization, options.updateMeta !== false);

      if (html.injected) optimizedCount++;
      else if (html.reason === 'no-html') noHtmlCount++;
      else untouchedCount++;

      zip.file(urlToFilePath(page.url), html.content);

      report.push({
        url: page.url,
        optimized: html.injected,
        reason: html.reason,
        title: optimized.title,
        metaDescription: optimized.meta?.description ?? null,
        score: calculatePageOptimizationScore(optimized),
      });

      onProgress?.(pagesContent.length + i + 1, pagesContent.length * 2, page.url);
    }

    zip.file(
      'optimization-report.json',
      JSON.stringify(
        {
          mode: 'inject',
          note: 'Блок встроен в исходную вёрстку страниц; разметка сайта не переписывалась.',
          pagesRequested: urls.length,
          pagesProcessed: pagesContent.length,
          pagesOptimized: optimizedCount,
          pagesAlreadyGood: untouchedCount,
          pagesWithoutHtml: noHtmlCount,
          pagesSkippedByLimit: skipped,
          maxPages,
          analysis,
          prompt,
          pages: report,
        },
        null,
        2
      )
    );

    return await zip.generateAsync({ type: 'blob' });
  } catch (error) {
    console.error('Error optimizing site:', error);
    throw error;
  }
};

/** Превращает URL в путь внутри архива */
function urlToFilePath(url: string): string {
  let filePath = url.replace(/^https?:\/\//, '');
  if (filePath.endsWith('/')) filePath += 'index.html';
  else if (!filePath.split('/').pop()?.includes('.')) filePath += '/index.html';
  return filePath;
}

/**
 * Готовит финальный HTML страницы.
 * Если исходной разметки нет — страница не выдумывается, а помечается
 * в отчёте: молча подсовывать пустой скелет вместо сайта нельзя.
 */
function buildPageHtml(
  original: PageContent,
  optimized: PageContent,
  needsOptimization: boolean,
  updateMeta: boolean
): { content: string; injected: boolean; reason: string } {
  const raw = original.rawHtml;

  if (!raw) {
    return {
      content: '',
      injected: false,
      reason: 'no-html',
    };
  }

  if (!needsOptimization) {
    return { content: raw, injected: false, reason: 'already-optimized' };
  }

  const generated = optimized.optimized?.content;
  const heading = optimized.headings?.h1?.[0] || optimized.title || original.title;

  if (!generated) {
    // Контент дописывать не потребовалось — правим только мета-теги.
    let html = raw;
    if (updateMeta && optimized.meta?.description) {
      html = injectSeoBlock(
        html,
        { heading, bodyHtml: '' },
        { description: optimized.meta.description, skipIfPresent: false }
      );
    }
    return { content: html, injected: false, reason: 'meta-only' };
  }

  const block: SeoBlock = {
    heading,
    bodyHtml: generated,
    collapsible: true,
  };

  const html = injectSeoBlock(raw, block, {
    title: updateMeta ? optimized.title : undefined,
    description: updateMeta ? optimized.meta?.description : undefined,
  });

  return { content: html, injected: true, reason: 'injected' };
}
