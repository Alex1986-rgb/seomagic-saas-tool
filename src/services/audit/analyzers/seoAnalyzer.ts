import { PageData } from '@/types/audit/crawler';
import { AuditItemData } from '@/types/audit/audit-items';

export interface SEOAnalysisResult {
  score: number;
  items: AuditItemData[];
  passed: number;
  warning: number;
  failed: number;
  details: {
    metaTitles: { present: number; optimal: number; missing: number; tooLong: number; tooShort: number };
    metaDescriptions: { present: number; optimal: number; missing: number; tooLong: number; tooShort: number };
    h1Tags: { present: number; multiple: number; missing: number };
    headingStructure: { valid: number; invalid: number };
    canonicalTags: { present: number; missing: number };
    openGraph: { present: number; missing: number };
    twitterCards: { present: number; missing: number };
    robotsMeta: { indexable: number; noindex: number };
    urlStructure: { optimal: number; needsImprovement: number };
    internalLinks: number;
    externalLinks: number;
  };
}

export class SEOAnalyzer {
  private pages: PageData[] = [];

  addPage(page: PageData): void {
    this.pages.push(page);
  }

  analyze(): SEOAnalysisResult {
    const items: AuditItemData[] = [];
    let totalScore = 0;
    let scoreCount = 0;

    // Meta Titles Analysis
    const titleAnalysis = this.analyzeMetaTitles();
    items.push(...titleAnalysis.items);
    totalScore += titleAnalysis.score;
    scoreCount++;

    // Meta Descriptions Analysis
    const descAnalysis = this.analyzeMetaDescriptions();
    items.push(...descAnalysis.items);
    totalScore += descAnalysis.score;
    scoreCount++;

    // H1 Tags Analysis
    const h1Analysis = this.analyzeH1Tags();
    items.push(...h1Analysis.items);
    totalScore += h1Analysis.score;
    scoreCount++;

    // Heading Structure Analysis
    const headingAnalysis = this.analyzeHeadingStructure();
    items.push(...headingAnalysis.items);
    totalScore += headingAnalysis.score;
    scoreCount++;

    // URL Structure Analysis
    const urlAnalysis = this.analyzeURLStructure();
    items.push(...urlAnalysis.items);
    totalScore += urlAnalysis.score;
    scoreCount++;

    // Internal Links Analysis
    const linksAnalysis = this.analyzeInternalLinks();
    items.push(...linksAnalysis.items);
    totalScore += linksAnalysis.score;
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

  private analyzeMetaTitles() {
    const items: AuditItemData[] = [];
    let score = 100;
    
    const missingTitles = this.pages.filter(p => !p.title || p.title.trim() === '');
    const tooLongTitles = this.pages.filter(p => p.title && p.title.length > 60);
    const tooShortTitles = this.pages.filter(p => p.title && p.title.length < 30);
    const optimalTitles = this.pages.filter(p => p.title && p.title.length >= 30 && p.title.length <= 60);

    // Check for duplicate titles
    const titleCounts = new Map<string, number>();
    this.pages.forEach(p => {
      if (p.title) {
        titleCounts.set(p.title, (titleCounts.get(p.title) || 0) + 1);
      }
    });
    const duplicateTitles = Array.from(titleCounts.entries()).filter(([, count]) => count > 1);

    if (missingTitles.length > 0) {
      score -= 30;
      items.push({
        id: 'missing-title',
        title: 'Отсутствуют meta title',
        description: `${missingTitles.length} страниц без meta title`,
        status: 'error',
        score: 0,
        trend: 'neutral',
        impact: 'high',
        affectedUrls: missingTitles.map(p => p.url),
        solution: 'Добавьте уникальный meta title для каждой страницы (30-60 символов)',
        recommendation: 'Meta title - один из важнейших факторов ранжирования'
      });
    }

    if (tooLongTitles.length > 0) {
      score -= 15;
      items.push({
        id: 'long-title',
        title: 'Слишком длинные meta title',
        description: `${tooLongTitles.length} страниц с title длиннее 60 символов`,
        status: 'warning',
        score: 70,
        trend: 'neutral',
        impact: 'medium',
        affectedUrls: tooLongTitles.map(p => p.url),
        solution: 'Сократите title до 50-60 символов',
        recommendation: 'Поисковики обрезают длинные заголовки'
      });
    }

    if (tooShortTitles.length > 0) {
      score -= 10;
      items.push({
        id: 'short-title',
        title: 'Слишком короткие meta title',
        description: `${tooShortTitles.length} страниц с title короче 30 символов`,
        status: 'warning',
        score: 75,
        trend: 'neutral',
        impact: 'medium',
        affectedUrls: tooShortTitles.map(p => p.url),
        solution: 'Увеличьте длину title до 30-60 символов для лучшей оптимизации',
        recommendation: 'Короткие title упускают возможности для ключевых слов'
      });
    }

    if (duplicateTitles.length > 0) {
      score -= 20;
      items.push({
        id: 'duplicate-titles',
        title: 'Дублирующиеся meta title',
        description: `${duplicateTitles.length} уникальных title используются на нескольких страницах`,
        status: 'error',
        score: 40,
        trend: 'neutral',
        impact: 'high',
        solution: 'Сделайте каждый title уникальным',
        recommendation: 'Дублирующиеся title сбивают поисковики и пользователей'
      });
    }

    if (optimalTitles.length === this.pages.length) {
      items.push({
        id: 'optimal-titles',
        title: 'Meta title оптимизированы',
        description: `Все ${this.pages.length} страниц имеют оптимальный meta title`,
        status: 'good',
        score: 100,
        trend: 'neutral',
        impact: 'high'
      });
    }

    return { items, score: Math.max(0, score) };
  }

  private analyzeMetaDescriptions() {
    const items: AuditItemData[] = [];
    let score = 100;
    
    const missingDesc = this.pages.filter(p => !p.description || p.description.trim() === '');
    const tooLongDesc = this.pages.filter(p => p.description && p.description.length > 160);
    const tooShortDesc = this.pages.filter(p => p.description && p.description.length < 120);

    if (missingDesc.length > 0) {
      score -= 25;
      items.push({
        id: 'missing-description',
        title: 'Отсутствуют meta description',
        description: `${missingDesc.length} страниц без meta description`,
        status: 'error',
        score: 0,
        trend: 'neutral',
        impact: 'high',
        affectedUrls: missingDesc.map(p => p.url),
        solution: 'Добавьте уникальный meta description (120-160 символов)',
        recommendation: 'Meta description влияет на CTR в поисковой выдаче'
      });
    }

    if (tooLongDesc.length > 0) {
      score -= 15;
      items.push({
        id: 'long-description',
        title: 'Слишком длинные meta description',
        description: `${tooLongDesc.length} страниц с description длиннее 160 символов`,
        status: 'warning',
        score: 70,
        trend: 'neutral',
        impact: 'medium',
        affectedUrls: tooLongDesc.map(p => p.url),
        solution: 'Сократите description до 150-160 символов'
      });
    }

    if (tooShortDesc.length > 0) {
      score -= 10;
      items.push({
        id: 'short-description',
        title: 'Слишком короткие meta description',
        description: `${tooShortDesc.length} страниц с description короче 120 символов`,
        status: 'warning',
        score: 75,
        trend: 'neutral',
        impact: 'low',
        affectedUrls: tooShortDesc.map(p => p.url),
        solution: 'Увеличьте длину description до 120-160 символов'
      });
    }

    return { items, score: Math.max(0, score) };
  }

  private analyzeH1Tags() {
    const items: AuditItemData[] = [];
    let score = 100;
    
    const missingH1 = this.pages.filter(p => !p.h1 || p.h1.length === 0);
    const multipleH1 = this.pages.filter(p => p.h1 && p.h1.length > 1);

    if (missingH1.length > 0) {
      score -= 30;
      items.push({
        id: 'missing-h1',
        title: 'Отсутствует H1 заголовок',
        description: `${missingH1.length} страниц без H1`,
        status: 'error',
        score: 0,
        trend: 'neutral',
        impact: 'high',
        affectedUrls: missingH1.map(p => p.url),
        solution: 'Добавьте H1 заголовок на каждую страницу',
        recommendation: 'H1 - важнейший элемент структуры страницы'
      });
    }

    if (multipleH1.length > 0) {
      score -= 20;
      items.push({
        id: 'multiple-h1',
        title: 'Несколько H1 на странице',
        description: `${multipleH1.length} страниц с несколькими H1`,
        status: 'warning',
        score: 60,
        trend: 'neutral',
        impact: 'medium',
        affectedUrls: multipleH1.map(p => p.url),
        solution: 'Используйте только один H1 на страницу',
        recommendation: 'Множественные H1 размывают тематику страницы'
      });
    }

    if (missingH1.length === 0 && multipleH1.length === 0) {
      items.push({
        id: 'optimal-h1',
        title: 'H1 заголовки оптимизированы',
        description: `Все ${this.pages.length} страниц имеют корректный H1`,
        status: 'good',
        score: 100,
        trend: 'neutral',
        impact: 'high'
      });
    }

    return { items, score: Math.max(0, score) };
  }

  private analyzeHeadingStructure() {
    const items: AuditItemData[] = [];
    let score = 100;

    // This would require parsing actual heading hierarchy from HTML
    // For now, we'll check basic H1 presence
    const pagesWithH1 = this.pages.filter(p => p.h1 && p.h1.length > 0);
    
    if (pagesWithH1.length < this.pages.length) {
      score -= 15;
      items.push({
        id: 'heading-structure',
        title: 'Проблемы со структурой заголовков',
        description: 'Некоторые страницы имеют проблемы с иерархией заголовков',
        status: 'warning',
        score: 75,
        trend: 'neutral',
        impact: 'medium',
        solution: 'Используйте правильную иерархию: H1 > H2 > H3 и т.д.',
        recommendation: 'Правильная структура заголовков улучшает понимание контента'
      });
    } else {
      items.push({
        id: 'heading-structure-good',
        title: 'Структура заголовков корректна',
        description: 'Все страницы имеют правильную иерархию заголовков',
        status: 'good',
        score: 100,
        trend: 'neutral',
        impact: 'medium'
      });
    }

    return { items, score: Math.max(0, score) };
  }

  private analyzeURLStructure() {
    const items: AuditItemData[] = [];
    let score = 100;
    
    const longUrls = this.pages.filter(p => p.url.length > 100);
    const urlsWithParameters = this.pages.filter(p => p.url.includes('?'));
    const urlsWithUnderscores = this.pages.filter(p => p.url.includes('_'));

    if (longUrls.length > 0) {
      score -= 10;
      items.push({
        id: 'long-urls',
        title: 'Слишком длинные URL',
        description: `${longUrls.length} URL длиннее 100 символов`,
        status: 'warning',
        score: 80,
        trend: 'neutral',
        impact: 'low',
        affectedUrls: longUrls.map(p => p.url),
        solution: 'Сократите URL, используя более короткие и описательные имена'
      });
    }

    if (urlsWithParameters.length > 0) {
      score -= 5;
      items.push({
        id: 'urls-with-params',
        title: 'URL с параметрами',
        description: `${urlsWithParameters.length} URL содержат GET-параметры`,
        status: 'warning',
        score: 85,
        trend: 'neutral',
        impact: 'low',
        affectedUrls: urlsWithParameters.map(p => p.url),
        solution: 'Рассмотрите использование ЧПУ вместо параметров'
      });
    }

    if (urlsWithUnderscores.length > 0) {
      score -= 5;
      items.push({
        id: 'urls-with-underscores',
        title: 'URL с подчеркиваниями',
        description: `${urlsWithUnderscores.length} URL используют подчеркивания`,
        status: 'warning',
        score: 90,
        trend: 'neutral',
        impact: 'low',
        affectedUrls: urlsWithUnderscores.map(p => p.url),
        solution: 'Используйте дефисы вместо подчеркиваний в URL',
        recommendation: 'Google рекомендует дефисы для разделения слов'
      });
    }

    if (longUrls.length === 0 && urlsWithParameters.length === 0) {
      items.push({
        id: 'optimal-urls',
        title: 'URL структура оптимизирована',
        description: 'Все URL соответствуют best practices',
        status: 'good',
        score: 100,
        trend: 'neutral',
        impact: 'medium'
      });
    }

    return { items, score: Math.max(0, score) };
  }

  private analyzeInternalLinks() {
    const items: AuditItemData[] = [];
    let score = 100;
    
    const totalInternalLinks = this.pages.reduce((sum, p) => sum + (p.internalLinks?.length || 0), 0);
    const avgLinksPerPage = totalInternalLinks / this.pages.length;

    if (avgLinksPerPage < 2) {
      score -= 20;
      items.push({
        id: 'low-internal-links',
        title: 'Недостаточно внутренних ссылок',
        description: `Среднее количество внутренних ссылок: ${avgLinksPerPage.toFixed(1)}`,
        status: 'warning',
        score: 60,
        trend: 'neutral',
        impact: 'medium',
        solution: 'Добавьте больше внутренних ссылок между страницами',
        recommendation: 'Хорошая перелинковка улучшает навигацию и SEO'
      });
    } else {
      items.push({
        id: 'good-internal-links',
        title: 'Хорошая внутренняя перелинковка',
        description: `Среднее количество внутренних ссылок: ${avgLinksPerPage.toFixed(1)}`,
        status: 'good',
        score: 100,
        trend: 'neutral',
        impact: 'medium'
      });
    }

    return { items, score: Math.max(0, score) };
  }

  private generateDetails() {
    const missingTitles = this.pages.filter(p => !p.title).length;
    const tooLongTitles = this.pages.filter(p => p.title && p.title.length > 60).length;
    const tooShortTitles = this.pages.filter(p => p.title && p.title.length < 30).length;
    const optimalTitles = this.pages.filter(p => p.title && p.title.length >= 30 && p.title.length <= 60).length;

    const missingDesc = this.pages.filter(p => !p.description).length;
    const tooLongDesc = this.pages.filter(p => p.description && p.description.length > 160).length;
    const tooShortDesc = this.pages.filter(p => p.description && p.description.length < 120).length;
    const optimalDesc = this.pages.filter(p => p.description && p.description.length >= 120 && p.description.length <= 160).length;

    const missingH1 = this.pages.filter(p => !p.h1 || p.h1.length === 0).length;
    const multipleH1 = this.pages.filter(p => p.h1 && p.h1.length > 1).length;
    const goodH1 = this.pages.filter(p => p.h1 && p.h1.length === 1).length;

    const totalInternal = this.pages.reduce((sum, p) => sum + (p.internalLinks?.length || 0), 0);
    const totalExternal = this.pages.reduce((sum, p) => sum + (p.externalLinks?.length || 0), 0);

    return {
      metaTitles: {
        present: this.pages.length - missingTitles,
        optimal: optimalTitles,
        missing: missingTitles,
        tooLong: tooLongTitles,
        tooShort: tooShortTitles
      },
      metaDescriptions: {
        present: this.pages.length - missingDesc,
        optimal: optimalDesc,
        missing: missingDesc,
        tooLong: tooLongDesc,
        tooShort: tooShortDesc
      },
      h1Tags: {
        present: goodH1 + multipleH1,
        multiple: multipleH1,
        missing: missingH1
      },
      headingStructure: {
        valid: goodH1,
        invalid: missingH1 + multipleH1
      },
      canonicalTags: { present: 0, missing: this.pages.length },
      openGraph: { present: 0, missing: this.pages.length },
      twitterCards: { present: 0, missing: this.pages.length },
      robotsMeta: { 
        indexable: this.pages.filter(p => p.isIndexable !== false).length,
        noindex: this.pages.filter(p => p.isIndexable === false).length
      },
      urlStructure: {
        optimal: this.pages.filter(p => p.url.length <= 100 && !p.url.includes('?')).length,
        needsImprovement: this.pages.filter(p => p.url.length > 100 || p.url.includes('?')).length
      },
      internalLinks: totalInternal,
      externalLinks: totalExternal
    };
  }
}
