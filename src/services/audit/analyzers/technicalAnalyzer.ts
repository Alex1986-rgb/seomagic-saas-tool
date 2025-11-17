import { PageData } from '@/types/audit/crawler';
import { AuditItemData } from '@/types/audit/audit-items';

export interface TechnicalAnalysisResult {
  score: number;
  items: AuditItemData[];
  passed: number;
  warning: number;
  failed: number;
  details: {
    https: { secure: number; insecure: number };
    statusCodes: { success: number; redirect: number; clientError: number; serverError: number };
    redirects: { pages: number; chains: number };
    brokenLinks: number;
    responseTime: { fast: number; medium: number; slow: number };
    indexability: { indexable: number; blocked: number };
    contentTypes: Record<string, number>;
  };
}

export class TechnicalAnalyzer {
  private pages: PageData[] = [];

  addPage(page: PageData): void {
    this.pages.push(page);
  }

  analyze(): TechnicalAnalysisResult {
    const items: AuditItemData[] = [];
    let totalScore = 0;
    let scoreCount = 0;

    // HTTPS Analysis
    const httpsAnalysis = this.analyzeHTTPS();
    items.push(...httpsAnalysis.items);
    totalScore += httpsAnalysis.score;
    scoreCount++;

    // Status Codes Analysis
    const statusAnalysis = this.analyzeStatusCodes();
    items.push(...statusAnalysis.items);
    totalScore += statusAnalysis.score;
    scoreCount++;

    // Redirects Analysis
    const redirectAnalysis = this.analyzeRedirects();
    items.push(...redirectAnalysis.items);
    totalScore += redirectAnalysis.score;
    scoreCount++;

    // Response Time Analysis
    const performanceAnalysis = this.analyzeResponseTime();
    items.push(...performanceAnalysis.items);
    totalScore += performanceAnalysis.score;
    scoreCount++;

    // Indexability Analysis
    const indexAnalysis = this.analyzeIndexability();
    items.push(...indexAnalysis.items);
    totalScore += indexAnalysis.score;
    scoreCount++;

    // Content Type Analysis
    const contentAnalysis = this.analyzeContentTypes();
    items.push(...contentAnalysis.items);
    totalScore += contentAnalysis.score;
    scoreCount++;

    const finalScore = Math.round(totalScore / scoreCount);
    const passed = items.filter(i => i.status === 'good').length;
    const warning = items.filter(i => i.status === 'warning').length;
    const failed = items.filter(i => i.status === 'error').length;

    return {
      score: finalScore,
      items,
      passed,
      warning,
      failed,
      details: this.generateDetails()
    };
  }

  private analyzeHTTPS() {
    const items: AuditItemData[] = [];
    let score = 100;
    
    const httpPages = this.pages.filter(p => p.url.startsWith('http://'));
    const httpsPages = this.pages.filter(p => p.url.startsWith('https://'));

    if (httpPages.length > 0) {
      score -= 40;
      items.push({
        id: 'no-https',
        title: 'Сайт не использует HTTPS',
        description: `${httpPages.length} страниц используют небезопасный HTTP протокол`,
        status: 'error',
        score: 0,
        trend: 'neutral',
        impact: 'high',
        affectedUrls: httpPages.map(p => p.url),
        solution: 'Настройте SSL/TLS сертификат и перенаправляйте HTTP на HTTPS',
        recommendation: 'HTTPS - критический фактор ранжирования и безопасности'
      });
    } else if (httpsPages.length === this.pages.length) {
      items.push({
        id: 'https-enabled',
        title: 'HTTPS включен для всех страниц',
        description: `Все ${this.pages.length} страниц используют безопасный HTTPS протокол`,
        status: 'good',
        score: 100,
        trend: 'neutral',
        impact: 'high'
      });
    }

    return { items, score: Math.max(0, score) };
  }

  private analyzeStatusCodes() {
    const items: AuditItemData[] = [];
    let score = 100;
    
    const successPages = this.pages.filter(p => p.statusCode && p.statusCode >= 200 && p.statusCode < 300);
    const redirectPages = this.pages.filter(p => p.statusCode && p.statusCode >= 300 && p.statusCode < 400);
    const clientErrorPages = this.pages.filter(p => p.statusCode && p.statusCode >= 400 && p.statusCode < 500);
    const serverErrorPages = this.pages.filter(p => p.statusCode && p.statusCode >= 500);

    if (clientErrorPages.length > 0) {
      score -= 30;
      items.push({
        id: 'client-errors',
        title: 'Найдены ошибки 4xx',
        description: `${clientErrorPages.length} страниц возвращают ошибки клиента (404, 403 и др.)`,
        status: 'error',
        score: 30,
        trend: 'neutral',
        impact: 'high',
        affectedUrls: clientErrorPages.map(p => `${p.url} (${p.statusCode})`),
        solution: 'Исправьте битые ссылки или настройте корректные редиректы',
        recommendation: 'Ошибки 4xx негативно влияют на индексацию и пользовательский опыт'
      });
    }

    if (serverErrorPages.length > 0) {
      score -= 40;
      items.push({
        id: 'server-errors',
        title: 'Найдены ошибки 5xx',
        description: `${serverErrorPages.length} страниц возвращают ошибки сервера`,
        status: 'error',
        score: 0,
        trend: 'neutral',
        impact: 'high',
        affectedUrls: serverErrorPages.map(p => `${p.url} (${p.statusCode})`),
        solution: 'Срочно исправьте проблемы на сервере',
        recommendation: 'Ошибки 5xx критичны для индексации и доступности сайта'
      });
    }

    if (redirectPages.length > this.pages.length * 0.2) {
      score -= 15;
      items.push({
        id: 'many-redirects',
        title: 'Много редиректов',
        description: `${redirectPages.length} страниц (${Math.round(redirectPages.length / this.pages.length * 100)}%) используют редиректы`,
        status: 'warning',
        score: 70,
        trend: 'neutral',
        impact: 'medium',
        affectedUrls: redirectPages.map(p => `${p.url} (${p.statusCode})`),
        solution: 'Минимизируйте количество редиректов, обновите ссылки',
        recommendation: 'Редиректы замедляют загрузку и расходуют краулинговый бюджет'
      });
    }

    if (clientErrorPages.length === 0 && serverErrorPages.length === 0) {
      items.push({
        id: 'status-codes-good',
        title: 'Все страницы доступны',
        description: `${successPages.length} страниц успешно доступны (код 2xx)`,
        status: 'good',
        score: 100,
        trend: 'neutral',
        impact: 'high'
      });
    }

    return { items, score: Math.max(0, score) };
  }

  private analyzeRedirects() {
    const items: AuditItemData[] = [];
    let score = 100;
    
    const redirectPages = this.pages.filter(p => p.redirectChain && p.redirectChain.length > 1);
    const redirectChains = this.pages.filter(p => p.redirectChain && p.redirectChain.length > 2);

    if (redirectChains.length > 0) {
      score -= 25;
      items.push({
        id: 'redirect-chains',
        title: 'Найдены цепочки редиректов',
        description: `${redirectChains.length} страниц имеют цепочки редиректов (>2 переходов)`,
        status: 'error',
        score: 40,
        trend: 'neutral',
        impact: 'high',
        affectedUrls: redirectChains.map(p => p.url),
        solution: 'Устраните цепочки, делайте редиректы напрямую к финальному URL',
        recommendation: 'Цепочки редиректов значительно замедляют загрузку'
      });
    }

    if (redirectPages.length > 0 && redirectChains.length === 0) {
      score -= 10;
      items.push({
        id: 'has-redirects',
        title: 'Используются редиректы',
        description: `${redirectPages.length} страниц используют редиректы`,
        status: 'warning',
        score: 80,
        trend: 'neutral',
        impact: 'medium',
        affectedUrls: redirectPages.map(p => p.url),
        solution: 'Обновите внутренние ссылки, чтобы избежать редиректов',
        recommendation: 'Минимизация редиректов улучшает производительность'
      });
    }

    if (redirectPages.length === 0) {
      items.push({
        id: 'no-redirects',
        title: 'Редиректы не обнаружены',
        description: 'Все страницы доступны без редиректов',
        status: 'good',
        score: 100,
        trend: 'neutral',
        impact: 'medium'
      });
    }

    return { items, score: Math.max(0, score) };
  }

  private analyzeResponseTime() {
    const items: AuditItemData[] = [];
    let score = 100;
    
    const pagesWithLoadTime = this.pages.filter(p => p.loadTime !== undefined);
    
    if (pagesWithLoadTime.length === 0) {
      return { items, score: 100 };
    }

    const avgLoadTime = pagesWithLoadTime.reduce((sum, p) => sum + (p.loadTime || 0), 0) / pagesWithLoadTime.length;
    const slowPages = pagesWithLoadTime.filter(p => (p.loadTime || 0) > 3000);
    const mediumPages = pagesWithLoadTime.filter(p => (p.loadTime || 0) > 1000 && (p.loadTime || 0) <= 3000);

    if (avgLoadTime > 3000) {
      score -= 30;
      items.push({
        id: 'slow-response-time',
        title: 'Медленное время загрузки',
        description: `Среднее время загрузки: ${(avgLoadTime / 1000).toFixed(2)}с`,
        status: 'error',
        score: 40,
        trend: 'neutral',
        impact: 'high',
        value: `${(avgLoadTime / 1000).toFixed(2)}s`,
        solution: 'Оптимизируйте сервер, базу данных и контент',
        recommendation: 'Медленная загрузка критично влияет на SEO и конверсию'
      });
    } else if (avgLoadTime > 1000) {
      score -= 15;
      items.push({
        id: 'medium-response-time',
        title: 'Время загрузки требует оптимизации',
        description: `Среднее время загрузки: ${(avgLoadTime / 1000).toFixed(2)}с`,
        status: 'warning',
        score: 70,
        trend: 'neutral',
        impact: 'medium',
        value: `${(avgLoadTime / 1000).toFixed(2)}s`,
        solution: 'Оптимизируйте кеширование и сжатие контента',
        recommendation: 'Цель - загрузка за 1 секунду или меньше'
      });
    } else {
      items.push({
        id: 'fast-response-time',
        title: 'Быстрое время загрузки',
        description: `Среднее время загрузки: ${(avgLoadTime / 1000).toFixed(2)}с`,
        status: 'good',
        score: 100,
        trend: 'neutral',
        impact: 'high',
        value: `${(avgLoadTime / 1000).toFixed(2)}s`
      });
    }

    if (slowPages.length > 0) {
      items.push({
        id: 'slow-pages',
        title: 'Медленные страницы обнаружены',
        description: `${slowPages.length} страниц загружаются дольше 3 секунд`,
        status: 'warning',
        score: 60,
        trend: 'neutral',
        impact: 'high',
        affectedUrls: slowPages.map(p => `${p.url} (${((p.loadTime || 0) / 1000).toFixed(2)}s)`),
        solution: 'Оптимизируйте эти страницы в первую очередь'
      });
    }

    return { items, score: Math.max(0, score) };
  }

  private analyzeIndexability() {
    const items: AuditItemData[] = [];
    let score = 100;
    
    const blockedPages = this.pages.filter(p => p.isIndexable === false);
    const indexablePages = this.pages.filter(p => p.isIndexable !== false);

    if (blockedPages.length > 0) {
      score -= 20;
      items.push({
        id: 'blocked-indexing',
        title: 'Страницы заблокированы от индексации',
        description: `${blockedPages.length} страниц имеют запрет на индексацию`,
        status: 'warning',
        score: 70,
        trend: 'neutral',
        impact: 'high',
        affectedUrls: blockedPages.map(p => p.url),
        solution: 'Проверьте robots meta теги и robots.txt',
        recommendation: 'Убедитесь, что блокировка индексации намеренная'
      });
    } else {
      items.push({
        id: 'indexable',
        title: 'Все страницы доступны для индексации',
        description: `${indexablePages.length} страниц открыты для индексации`,
        status: 'good',
        score: 100,
        trend: 'neutral',
        impact: 'high'
      });
    }

    return { items, score: Math.max(0, score) };
  }

  private analyzeContentTypes() {
    const items: AuditItemData[] = [];
    let score = 100;
    
    const htmlPages = this.pages.filter(p => !p.contentType || p.contentType.includes('text/html'));
    const nonHtmlPages = this.pages.filter(p => p.contentType && !p.contentType.includes('text/html'));

    if (nonHtmlPages.length > 0) {
      items.push({
        id: 'mixed-content-types',
        title: 'Различные типы контента',
        description: `${htmlPages.length} HTML страниц, ${nonHtmlPages.length} файлов других типов`,
        status: 'good',
        score: 100,
        trend: 'neutral',
        impact: 'low',
        helpText: 'Смешанный контент - это нормально'
      });
    } else {
      items.push({
        id: 'html-content',
        title: 'Все страницы - HTML',
        description: `${htmlPages.length} HTML страниц`,
        status: 'good',
        score: 100,
        trend: 'neutral',
        impact: 'low'
      });
    }

    return { items, score: Math.max(0, score) };
  }

  private generateDetails() {
    const httpPages = this.pages.filter(p => p.url.startsWith('http://')).length;
    const httpsPages = this.pages.filter(p => p.url.startsWith('https://')).length;

    const successPages = this.pages.filter(p => p.statusCode && p.statusCode >= 200 && p.statusCode < 300).length;
    const redirectPages = this.pages.filter(p => p.statusCode && p.statusCode >= 300 && p.statusCode < 400).length;
    const clientErrorPages = this.pages.filter(p => p.statusCode && p.statusCode >= 400 && p.statusCode < 500).length;
    const serverErrorPages = this.pages.filter(p => p.statusCode && p.statusCode >= 500).length;

    const pagesWithRedirects = this.pages.filter(p => p.redirectChain && p.redirectChain.length > 1).length;
    const redirectChains = this.pages.filter(p => p.redirectChain && p.redirectChain.length > 2).length;

    const pagesWithLoadTime = this.pages.filter(p => p.loadTime !== undefined);
    const fastPages = pagesWithLoadTime.filter(p => (p.loadTime || 0) <= 1000).length;
    const mediumPages = pagesWithLoadTime.filter(p => (p.loadTime || 0) > 1000 && (p.loadTime || 0) <= 3000).length;
    const slowPages = pagesWithLoadTime.filter(p => (p.loadTime || 0) > 3000).length;

    const indexablePages = this.pages.filter(p => p.isIndexable !== false).length;
    const blockedPages = this.pages.filter(p => p.isIndexable === false).length;

    const contentTypes: Record<string, number> = {};
    this.pages.forEach(p => {
      const type = p.contentType || 'text/html';
      contentTypes[type] = (contentTypes[type] || 0) + 1;
    });

    return {
      https: {
        secure: httpsPages,
        insecure: httpPages
      },
      statusCodes: {
        success: successPages,
        redirect: redirectPages,
        clientError: clientErrorPages,
        serverError: serverErrorPages
      },
      redirects: {
        pages: pagesWithRedirects,
        chains: redirectChains
      },
      brokenLinks: clientErrorPages,
      responseTime: {
        fast: fastPages,
        medium: mediumPages,
        slow: slowPages
      },
      indexability: {
        indexable: indexablePages,
        blocked: blockedPages
      },
      contentTypes
    };
  }
}
