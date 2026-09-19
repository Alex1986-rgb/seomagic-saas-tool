import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuditData } from '@/types/audit';
import { OptimizationItem } from '@/features/audit/types/optimization-types';
import { PdfCustomizationOptions } from '@/components/audit/share/pdf-customization';
import { addPaginationFooters, addTimestamp, extendJsPDF, addCoverPage, addTableOfContents } from './helpers/index';
import type { TocSection } from './helpers/index';
import { generateQRCodeDataUrl } from './helpers/qrcode';
import { pdfColors, getScoreColorRGB } from './styles/colors';
import { generatePieChart, generateBarChart, generateScoreGauge, generateRadarChart } from './helpers/charts';
import { createCategoryScoresFromAudit, drawAllCategoryScores } from './helpers/detailedScores';
import { addSeoAnalysisSection } from './sections/seoAnalysisSection';
import type { SeoAnalysisData } from './sections/seoAnalysisSection';
import { addTechnicalAnalysisSection } from './sections/technicalAnalysisSection';
import type { TechnicalAnalysisData } from './sections/technicalAnalysisSection';
import { addRecommendationsSection, Recommendation } from './sections/recommendationsSection';
import { addPricingSection } from './sections/pricingSection';
import { addPageAnalysisSection, PageAnalysisItem } from './sections/pageAnalysisSection';
import { addIssuePercentagesSection } from './sections/issuePercentagesSection';
import { addPerformanceMetricsSection } from './sections/performanceMetricsSection';
import { addHistoricalTrendsSection } from './sections/historicalTrendsSection';
import { addComparisonSection } from './sections/comparisonSection';

export interface GenerateAuditPdfOptions {
  auditData: AuditData;
  url: string;
  recommendations?: any;
  pageStats?: any;
  optimizationCost?: number;
  optimizationItems?: OptimizationItem[];
  date?: string;
  customization?: PdfCustomizationOptions;
  historicalData?: any[];
  comparisonData?: any;
  performanceMetrics?: any;
  isPartial?: boolean;
  completionPercentage?: number;
  partialDataNote?: string;
  /**
   * Разобранные страницы сайта из таблицы `page_analysis`. Без них раздел
   * постраничного анализа в отчёт не попадает: раньше на его месте печатались
   * выдуманные страницы (/products, /services) со случайными оценками и
   * временем загрузки — отчёт с такими данными уносили клиенту.
   */
  pageAnalysis?: AuditPageRow[];
}

/** Строка разбора страницы — то, что действительно измерено краулером. */
export interface AuditPageRow {
  url: string;
  status_code?: number | null;
  load_time?: number | null;
  content_length?: number | null;
  title?: string | null;
  description?: string | null;
  h1_count?: number | null;
  issues_critical?: number | null;
  issues_warning?: number | null;
  issues_info?: number | null;
}

interface AuditIssue {
  title: string;
  description: string;
  impact: string;
  recommendation: string;
  url?: string;
  urls?: string[];
  solution?: string;
}

export const generateAuditPdf = async (options: GenerateAuditPdfOptions): Promise<Blob> => {
  const { 
    auditData, 
    url, 
    recommendations, 
    pageStats, 
    optimizationCost, 
    optimizationItems, 
    date = auditData.date,
    customization,
    historicalData,
    comparisonData,
    performanceMetrics,
    isPartial = false,
    completionPercentage = 100,
    partialDataNote
  } = options;
  
  // Default customization options
  const opts = customization || {
    includeCoverPage: true,
    includeTableOfContents: true,
    includeSummary: true,
    includeSeoAnalysis: true,
    includeTechnicalAnalysis: true,
    includePageAnalysis: true,
    includeRecommendations: true,
    includeOptimizations: true,
    reportTitle: 'SEO АУДИТ САЙТА',
  };
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  extendJsPDF(doc);
  
  const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Первая страница у jsPDF уже есть. Её занимает обложка; без обложки первый
  // раздел ложится на неё, а не оставляет пустой лист в начале отчёта.
  let firstPageFree = true;
  const nextPage = () => {
    if (firstPageFree) {
      firstPageFree = false;
      return;
    }
    doc.addPage();
  };

  /**
   * Оглавление собирается из разделов, которые действительно попали в отчёт.
   * Раньше печатался заготовленный список с номерами страниц 3–22 — с
   * «Долгосрочной стратегией» и «Вариантами пакетов», которых в документе нет,
   * и номерами, не совпадающими с настоящими страницами.
   */
  const tocSections: TocSection[] = [];
  const startSection = (title: string) => {
    nextPage();
    tocSections.push({ title, pageNumber: doc.getNumberOfPages(), level: 1 });
  };

  // === ОБЛОЖКА ===
  const totalIssues = (auditData.issues.critical?.length || 0) + 
                     (auditData.issues.important?.length || 0) + 
                     (auditData.issues.opportunities?.length || 0);
  
  if (opts.includeCoverPage) {
    firstPageFree = false;

    // Настоящий QR-код с адресом проверенного сайта. Раньше на обложке был
    // случайный узор с подписью «Онлайн-версия» — он не считывался, а
    // онлайн-версии отчёта по такой ссылке и не было. Не удалось построить
    // код — блок просто не печатается.
    const siteHref = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const qrDataUrl = url
      ? await generateQRCodeDataUrl(siteHref).catch(() => null)
      : null;

    addCoverPage(doc, {
      title: opts.reportTitle || 'SEO АУДИТ САЙТА',
      subtitle: opts.companyName ? opts.companyName : 'Полный анализ и рекомендации по оптимизации',
      url: url,
      date: date,
      overallScore: auditData.score,
      statistics: {
        // Число страниц — только известное. Раньше при неизвестном числе на
        // обложке печаталось «Страниц проверено: 1».
        pagesScanned: auditData.pageCount > 0 ? auditData.pageCount : undefined,
        issuesFound: totalIssues,
        criticalIssues: auditData.issues.critical?.length || 0
      },
      qrCode: qrDataUrl ? { dataUrl: qrDataUrl, label: 'Адрес сайта' } : undefined,
      // Здесь печатался сайт seomarket.com — это не адрес сервиса. Пока
      // настоящего адреса нет, не печатаем никакого.
      companyInfo: opts.companyName ? {
        name: opts.companyName,
        website: ''
      } : {
        name: 'SEO Market',
        website: ''
      }
    });
  }

  // === ОГЛАВЛЕНИЕ (страницу резервируем, заполняем в конце) ===
  let tocPage: number | null = null;
  if (opts.includeTableOfContents) {
    nextPage();
    tocPage = doc.getNumberOfPages();
  }

  // === ИСПОЛНИТЕЛЬНОЕ РЕЗЮМЕ ===
  if (opts.includeSummary) {
    startSection('Исполнительное резюме');
  
  doc.setFillColor(...pdfColors.dark);
  doc.rect(0, 0, 210, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('Исполнительное резюме', 105, 14, { align: 'center' });
  
  // Общая оценка с большой шкалой
  doc.setFontSize(12);
  doc.setTextColor(...pdfColors.dark);
  doc.text('Общая оценка SEO', 20, 35);
  generateScoreGauge(doc, auditData.score, 105, 60, 80, 8);
  
  // Распределение проблем
  const issuesByCategory = {
    'Критические': auditData.issues.critical.length,
    'Важные': auditData.issues.important.length,
    'Рекомендации': auditData.issues.opportunities.length
  };
  
  generatePieChart(doc, issuesByCategory, 105, 140, 35, {
    title: 'Распределение проблем по важности',
    showLegend: true,
    showValues: true,
    showPercentages: true,
    colors: [
      pdfColors.danger,
      pdfColors.warning,
      pdfColors.info
    ]
  });

  // === ДЕТАЛЬНЫЕ ШКАЛЫ КАТЕГОРИЙ ===
  startSection('Детальный анализ оценок');
  
  doc.setFillColor(...pdfColors.primary);
  doc.rect(0, 10, 210, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Детальный анализ оценок', 105, 18, { align: 'center' });
  
  const categoryScoresDetailed = createCategoryScoresFromAudit(auditData);
  drawAllCategoryScores(doc, categoryScoresDetailed, 30);
  }

  /**
   * SEO- и технический разделы — только по разобранным страницам.
   *
   * Раньше сюда передавались заготовки: «HTTPS активен», «среднее время
   * отклика 500 мс», все страницы с ответом 200, ноль отсутствующих
   * мета-тегов, битых ссылок и редиректов — одинаково для любого сайта.
   * Теперь цифры считаются по строкам `page_analysis`; чего краулер не
   * измеряет (редиректы, битые ссылки, индексируемость, структура URL), того
   * в отчёте нет. Нет разобранных страниц — нет и этих разделов.
   */
  const pageRows = options.pageAnalysis ?? [];

  // === SEO АНАЛИЗ ===
  if (opts.includeSeoAnalysis && pageRows.length > 0) {
    const seoAnalysisData = prepareSeoAnalysisData(pageRows);
    if (seoAnalysisData.metaTags || seoAnalysisData.headings) {
      startSection('SEO-анализ');
      addSeoAnalysisSection(doc, seoAnalysisData, 20);
    }
  }

  // === ТЕХНИЧЕСКИЙ АНАЛИЗ ===
  if (opts.includeTechnicalAnalysis && pageRows.length > 0) {
    const technicalAnalysisData = prepareTechnicalAnalysisData(pageRows);
    if (technicalAnalysisData.https || technicalAnalysisData.statusCodes || technicalAnalysisData.performance) {
      startSection('Технический анализ');
      addTechnicalAnalysisSection(doc, technicalAnalysisData, 20);
    }
  }

  // === РЕКОМЕНДАЦИИ ===
  if (opts.includeRecommendations) {
    const recommendationsData = {
      critical: prepareCriticalRecommendations(auditData),
      important: prepareImportantRecommendations(auditData),
      opportunities: prepareOpportunitiesRecommendations(auditData)
    };

    const hasRecommendations = recommendationsData.critical.length > 0 ||
      recommendationsData.important.length > 0 ||
      recommendationsData.opportunities.length > 0;

    if (hasRecommendations) {
      startSection('Рекомендации');
      addRecommendationsSection(doc, recommendationsData, 20);
    }
  }

  // === СМЕТА ОПТИМИЗАЦИИ ===
  // Без выдуманных условий: раньше сюда подставлялись скидка 10 %, срок
  // действия «30 дней» и рекомендуемый пакет. Смета — только работы и суммы.
  if (opts.includeOptimizations && optimizationItems && optimizationItems.length > 0) {
    startSection('Смета оптимизации');
    
    addPricingSection(doc, {
      url: url,
      date: date,
      items: optimizationItems
    }, 20);
  }

  // === АНАЛИЗ СТРАНИЦ ===
  // Печатаем, только когда есть разобранные страницы. Пустой раздел честнее
  // раздела с выдуманными адресами.
  if (opts.includePageAnalysis && pageRows.length > 0) {
    startSection('Анализ страниц');

    const pageAnalysisData = preparePageAnalysisData(pageRows);
    addPageAnalysisSection(doc, pageAnalysisData, 20);
  }

  // === ДЕТАЛЬНЫЙ АНАЛИЗ ПРОБЛЕМ (старая версия - оставим для совместимости) ===
  startSection('Детальный анализ проблем');
  
  doc.setFillColor(...pdfColors.dark);
  doc.rect(0, 0, 210, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('Детальный анализ проблем', 105, 14, { align: 'center' });
  
  doc.setTextColor(...pdfColors.dark);
  doc.setFontSize(12);
  doc.text(`Всего обнаружено проблем: ${totalIssues}`, 20, 30);
  
  const getCriticalIssues = (): AuditIssue[] => {
    if (!auditData.issues.critical || auditData.issues.critical.length === 0) return [];
    
    if (typeof auditData.issues.critical[0] === 'string') {
      return auditData.issues.critical.map((issue: string) => ({
        title: issue,
        description: issue,
        impact: 'Высокий',
        recommendation: 'Рекомендуется исправить'
      }));
    }
    
    return auditData.issues.critical as unknown as AuditIssue[];
  };
  
  const criticalIssues = getCriticalIssues();
  
  if (criticalIssues.length > 0) {
    const criticalIssuesData = criticalIssues.map(issue => [
      issue.title,
      issue.impact || 'Высокий',
      issue.recommendation || 'Рекомендуется исправить'
    ]);
    
    autoTable(doc, {
      startY: 50,
      head: [['Проблема', 'Влияние', 'Рекомендация']],
      body: criticalIssuesData,
      theme: 'striped',
      headStyles: { 
        fillColor: [pdfColors.danger[0], pdfColors.danger[1], pdfColors.danger[2]],
        textColor: [255, 255, 255]
      },
      alternateRowStyles: {
        fillColor: [250, 235, 235]
      }
    });
  } else {
    doc.setFontSize(10);
    doc.setTextColor(...pdfColors.dark);
    doc.text('Критических проблем не обнаружено', 20, 55);
  }
  
  let currentY = criticalIssues.length > 0 ? 
    (doc as any).lastAutoTable.finalY + 15 : 60;
  
  if (currentY > 200) {
    doc.addPage();
    currentY = 30;
  }
  
  doc.setFontSize(14);
  doc.setTextColor(...pdfColors.warning);
  doc.text('Важные проблемы', 20, currentY);
  
  const getImportantIssues = (): AuditIssue[] => {
    if (!auditData.issues.important || auditData.issues.important.length === 0) return [];
    
    if (typeof auditData.issues.important[0] === 'string') {
      return auditData.issues.important.map((issue: string) => ({
        title: issue,
        description: issue,
        impact: 'Средний',
        recommendation: 'Рекомендуется исправить'
      }));
    }
    
    return auditData.issues.important as unknown as AuditIssue[];
  };
  
  const importantIssues = getImportantIssues();
  
  if (importantIssues.length > 0) {
    const importantIssuesData = importantIssues.map(issue => [
      issue.title,
      issue.impact || 'Средний',
      issue.recommendation || 'Рекомендуется исправить'
    ]);
    
    autoTable(doc, {
      startY: currentY + 5,
      head: [['Проблема', 'Влияние', 'Рекомендация']],
      body: importantIssuesData,
      theme: 'striped',
      headStyles: { 
        fillColor: [pdfColors.warning[0], pdfColors.warning[1], pdfColors.warning[2]],
        textColor: [255, 255, 255]
      },
      alternateRowStyles: {
        fillColor: [253, 246, 227]
      }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(10);
    doc.setTextColor(...pdfColors.dark);
    doc.text('Важных проблем не обнаружено', 20, currentY + 10);
    currentY += 20;
  }
  
  if (currentY > 200) {
    doc.addPage();
    currentY = 30;
  }
  
  doc.setFontSize(14);
  doc.setTextColor(...pdfColors.info);
  doc.text('Рекомендации по улучшению', 20, currentY);
  
  const getOpportunityIssues = (): AuditIssue[] => {
    if (!auditData.issues.opportunities || auditData.issues.opportunities.length === 0) return [];
    
    if (typeof auditData.issues.opportunities[0] === 'string') {
      return auditData.issues.opportunities.map((issue: string) => ({
        title: issue,
        description: issue,
        impact: 'Низкий',
        recommendation: 'Рекомендуется улучшить'
      }));
    }
    
    return auditData.issues.opportunities as unknown as AuditIssue[];
  };
  
  const opportunityIssues = getOpportunityIssues();
  
  if (opportunityIssues.length > 0) {
    const opportunitiesData = opportunityIssues.map(issue => [
      issue.title,
      issue.impact || 'Низкий',
      issue.recommendation || 'Рекомендуется улучшить'
    ]);
    
    autoTable(doc, {
      startY: currentY + 5,
      head: [['Рекомендация', 'Влияние', 'Описание']],
      body: opportunitiesData,
      theme: 'striped',
      headStyles: { 
        fillColor: [pdfColors.info[0], pdfColors.info[1], pdfColors.info[2]],
        textColor: [255, 255, 255]
      },
      alternateRowStyles: {
        fillColor: [235, 245, 255]
      }
    });
  } else {
    doc.setFontSize(10);
    doc.setTextColor(...pdfColors.dark);
    doc.text('Рекомендаций не обнаружено', 20, currentY + 10);
  }
  
  if (opts.includeOptimizations && optimizationCost && optimizationItems && optimizationItems.length > 0) {
    startSection('Стоимость оптимизации');
    
    doc.setFillColor(...pdfColors.dark);
    doc.rect(0, 0, 210, 20, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('Стоимость оптимизации', 105, 14, { align: 'center' });
    
    doc.setTextColor(...pdfColors.dark);
    doc.setFontSize(12);
    doc.text(`Общая стоимость: ${new Intl.NumberFormat('ru-RU').format(optimizationCost)} ₽`, 20, 30);
    // Число страниц — только известное: раньше здесь печаталось «undefined» или 0.
    if (auditData.pageCount > 0) {
      doc.text(`Количество страниц: ${auditData.pageCount}`, 20, 40);
    }
    
    // Название работы: у строк сметы тип бывает пустым, тогда берём название.
    // Раньше одинаковые типы перезаписывали друг друга, а пустой становился
    // подписью «undefined».
    const workLabel = (item: OptimizationItem) => item.type || item.name;
    const costDistribution: Record<string, number> = {};
    
    optimizationItems.forEach(item => {
      const label = workLabel(item);
      costDistribution[label] = (costDistribution[label] ?? 0) + (Number(item.totalPrice) || 0);
    });
    
    generatePieChart(doc, costDistribution, 105, 80, 40, {
      title: 'Распределение затрат на оптимизацию',
      showLegend: true,
      legendPosition: 'right',
      colors: [
        pdfColors.primary,
        pdfColors.secondary,
        pdfColors.tertiary,
        pdfColors.info,
        pdfColors.success
      ]
    });
    
    doc.setFontSize(14);
    doc.text('Детализация стоимости:', 20, 130);
    
    const costDetailsData = optimizationItems.map(item => [
      workLabel(item),
      String(item.count ?? ''),
      `${new Intl.NumberFormat('ru-RU').format(Number(item.pricePerUnit ?? item.price) || 0)} ₽`,
      `${new Intl.NumberFormat('ru-RU').format(Number(item.totalPrice) || 0)} ₽`
    ]);
    
    autoTable(doc, {
      startY: 135,
      head: [['Тип оптимизации', 'Количество', 'Цена за единицу', 'Итого']],
      body: costDetailsData,
      theme: 'striped',
      styles: { halign: 'left' },
      headStyles: { 
        fillColor: [pdfColors.primary[0], pdfColors.primary[1], pdfColors.primary[2]],
        textColor: [255, 255, 255]
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250]
      }
    });
    
    // Здесь был список «Оптимизация включает»: мета-теги, изображения,
    // скорость загрузки, технические проблемы — одинаковый для любой сметы.
    // Скорость и изображения оптимизация не трогает, а состав работ уже есть в
    // таблице выше, поэтому список убран.
  }

  // === ОГЛАВЛЕНИЕ: заполняем зарезервированную страницу ===
  if (tocPage !== null) {
    doc.setPage(tocPage);
    addTableOfContents(doc, {
      title: 'Оглавление',
      sections: tocSections
    });
  }
  
  doc.setFontSize(8);
  const lastPage = doc.getNumberOfPages();
  doc.setPage(lastPage);
  
  addTimestamp(doc, 20, 285);
  
  addPaginationFooters(doc);
  
  return doc.output('blob');
};

/**
 * Подготовка критических рекомендаций из данных аудита
 */
function prepareCriticalRecommendations(auditData: AuditData): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  if (auditData.issues.critical && auditData.issues.critical.length > 0) {
    auditData.issues.critical.slice(0, 5).forEach((issue: any) => {
      const title = typeof issue === 'string' ? issue : issue.title || issue;
      const description = typeof issue === 'object' && issue.description 
        ? issue.description 
        : 'Критическая проблема, требующая немедленного исправления';
      
      // Попытка найти дополнительную информацию из details
      let affectedUrls: string[] = [];
      let impact = 'Критическое влияние на SEO и ранжирование';
      let solution = 'Требуется немедленное исправление';
      
      if (typeof issue === 'object') {
        affectedUrls = issue.affectedUrls || [];
        impact = issue.impact || impact;
        solution = issue.solution || issue.recommendation || solution;
      }
      
      recommendations.push({
        title: title,
        priority: 'high',
        description: description,
        impact: impact,
        solution: solution,
        expectedResult: 'Значительное улучшение SEO показателей и видимости в поисковых системах',
        urls: affectedUrls.slice(0, 5)
      });
    });
  }
  
  return recommendations;
}

/**
 * Подготовка важных рекомендаций из данных аудита
 */
function prepareImportantRecommendations(auditData: AuditData): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  if (auditData.issues.important && auditData.issues.important.length > 0) {
    auditData.issues.important.slice(0, 3).forEach((issue: any) => {
      const title = typeof issue === 'string' ? issue : issue.title || issue;
      const description = typeof issue === 'object' && issue.description 
        ? issue.description 
        : 'Важная проблема, влияющая на эффективность SEO';
      
      let affectedUrls: string[] = [];
      let impact = 'Среднее влияние на ранжирование и пользовательский опыт';
      // Срок «в течение месяца» не из данных — не обещаем.
      let solution = 'Рекомендуется исправить';
      
      if (typeof issue === 'object') {
        affectedUrls = issue.affectedUrls || [];
        impact = issue.impact || impact;
        solution = issue.solution || issue.recommendation || solution;
      }
      
      recommendations.push({
        title: title,
        priority: 'medium',
        description: description,
        impact: impact,
        solution: solution,
        expectedResult: 'Повышение общего качества сайта и улучшение пользовательских метрик',
        urls: affectedUrls.slice(0, 5)
      });
    });
  }
  
  return recommendations;
}

/**
 * Подготовка рекомендаций по улучшению из данных аудита
 */
function prepareOpportunitiesRecommendations(auditData: AuditData): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  if (auditData.issues.opportunities && auditData.issues.opportunities.length > 0) {
    auditData.issues.opportunities.slice(0, 3).forEach((issue: any) => {
      const title = typeof issue === 'string' ? issue : issue.title || issue;
      const description = typeof issue === 'object' && issue.description 
        ? issue.description 
        : 'Возможность для улучшения и дальнейшей оптимизации';
      
      let affectedUrls: string[] = [];
      let impact = 'Положительное влияние на долгосрочную стратегию SEO';
      let solution = 'Рекомендуется внедрить для достижения максимальной эффективности';
      
      if (typeof issue === 'object') {
        affectedUrls = issue.affectedUrls || [];
        impact = issue.impact || impact;
        solution = issue.solution || issue.recommendation || solution;
      }
      
      recommendations.push({
        title: title,
        priority: 'low',
        description: description,
        impact: impact,
        solution: solution,
        expectedResult: 'Дополнительное увеличение трафика и улучшение конверсии',
        urls: affectedUrls.slice(0, 5)
      });
    });
  }
  
  return recommendations;
}

/**
 * Пороги длины title — те же, что у классификатора замечаний
 * (supabase/functions/issue-classifier: short_title < 30, long_title > 60),
 * чтобы отчёт не расходился с найденными замечаниями.
 */
const TITLE_MIN_LENGTH = 30;
const TITLE_MAX_LENGTH = 60;
/** Медленная страница — дольше 3 с, как slow_page у классификатора. */
const SLOW_PAGE_MS = 3000;
const FAST_PAGE_MS = 500;

/**
 * SEO-показатели по разобранным страницам: title, description и H1.
 * Структуру URL и внутренние ссылки краулер не разбирает — их не печатаем.
 */
function prepareSeoAnalysisData(rows: AuditPageRow[]): SeoAnalysisData {
  const titleUsage = new Map<string, number>();
  for (const row of rows) {
    const title = (row.title ?? '').trim();
    if (title) titleUsage.set(title, (titleUsage.get(title) ?? 0) + 1);
  }

  const metaIssues: Array<{ url: string; issue: string; type: 'title' | 'description' }> = [];
  let missing = 0;
  let duplicate = 0;
  let tooLong = 0;
  let tooShort = 0;

  for (const row of rows) {
    const title = (row.title ?? '').trim();
    const description = (row.description ?? '').trim();

    if (!title || !description) missing += 1;
    if (!title) metaIssues.push({ url: row.url, type: 'title', issue: 'Нет title' });
    if (!description) metaIssues.push({ url: row.url, type: 'description', issue: 'Нет meta description' });

    if (title && (titleUsage.get(title) ?? 0) > 1) {
      duplicate += 1;
      metaIssues.push({ url: row.url, type: 'title', issue: 'Такой же title есть на другой странице' });
    }

    if (title.length > TITLE_MAX_LENGTH) {
      tooLong += 1;
      metaIssues.push({ url: row.url, type: 'title', issue: `Title длиннее ${TITLE_MAX_LENGTH} символов (${title.length})` });
    } else if (title && title.length < TITLE_MIN_LENGTH) {
      tooShort += 1;
    }
  }

  // H1 считаем только там, где краулер его посчитал: пустое поле — не ноль.
  const h1Rows = rows.filter((row) => row.h1_count !== null && row.h1_count !== undefined);
  const headingIssues: Array<{ url: string; issue: string }> = [];
  let missingH1 = 0;
  let multipleH1 = 0;

  for (const row of h1Rows) {
    const h1Count = Number(row.h1_count);
    if (h1Count === 0) {
      missingH1 += 1;
      headingIssues.push({ url: row.url, issue: 'Нет заголовка H1' });
    } else if (h1Count > 1) {
      multipleH1 += 1;
      headingIssues.push({ url: row.url, issue: `Несколько H1 (${h1Count})` });
    }
  }

  return {
    metaTags: {
      checked: rows.length,
      missing,
      duplicate,
      tooLong,
      tooShort,
      issues: metaIssues,
    },
    headings: h1Rows.length > 0
      ? {
          checked: h1Rows.length,
          missingH1,
          duplicateH1: multipleH1,
          issues: headingIssues,
        }
      : undefined,
  };
}

/**
 * Технические показатели по разобранным страницам: схема адресов, коды ответа
 * и время загрузки. Редиректы, битые ссылки и индексируемость краулер здесь не
 * отдаёт — эти подразделы не печатаем вовсе.
 */
function prepareTechnicalAnalysisData(rows: AuditPageRow[]): TechnicalAnalysisData {
  // HTTPS — только если у всех адресов явно указана схема.
  const schemes = rows.map((row) => /^(https?):\/\//i.exec(row.url)?.[1]?.toLowerCase());
  const https = schemes.length > 0 && schemes.every(Boolean)
    ? { enabled: schemes.every((scheme) => scheme === 'https') }
    : undefined;

  // Код 0 или пусто — страница не ответила, такой код не считаем.
  const codes = rows
    .map((row) => Number(row.status_code ?? 0))
    .filter((code) => code > 0);
  const statusCodes = codes.length > 0
    ? {
        total: codes.length,
        success: codes.filter((code) => code >= 200 && code < 300).length,
        redirects: codes.filter((code) => code >= 300 && code < 400).length,
        clientErrors: codes.filter((code) => code >= 400 && code < 500).length,
        serverErrors: codes.filter((code) => code >= 500).length,
      }
    : undefined;

  // В базе время хранится в секундах, в отчёте — миллисекунды.
  const timed = rows
    .filter((row) => row.load_time !== null && row.load_time !== undefined)
    .map((row) => ({ url: row.url, ms: Math.round(Number(row.load_time) * 1000) }));
  const slow = timed
    .filter((page) => page.ms > SLOW_PAGE_MS)
    .sort((a, b) => b.ms - a.ms);
  const performance = timed.length > 0
    ? {
        avgResponseTime: Math.round(timed.reduce((sum, page) => sum + page.ms, 0) / timed.length),
        fastPages: timed.filter((page) => page.ms < FAST_PAGE_MS).length,
        slowPages: slow.length,
        issues: slow.map((page) => ({ url: page.url, responseTime: page.ms })),
      }
    : undefined;

  return { https, statusCodes, performance };
}

/**
 * Подготовка данных для анализа страниц.
 *
 * Раньше эта функция сама придумывала страницы: брала домен, приписывала к нему
 * /products, /services, /about, /contacts, /blog, раздавала им случайные оценки
 * 60–95, случайное время загрузки и иногда — ответ 404. В отчёте, который
 * показывают клиенту, это выглядело как результат обхода сайта.
 *
 * Потом страницы стали настоящими, но замечаний в строках не было, и каждая
 * получала «100 баллов, 0 проблем», а неответившая страница — код 200.
 *
 * Теперь берём то, что измерено: замечания — из таблицы `issues`. Если их
 * узнать не удалось (поля пустые), оценка и сумма проблем не считаются вовсе,
 * пустой код ответа печатается прочерком, а не «200».
 */
function preparePageAnalysisData(rows: AuditPageRow[]): {
  pages: PageAnalysisItem[];
  summary: {
    totalPages: number;
    avgLoadTime: number | null;
    avgSeoScore: number | null;
    totalIssues: number | null;
  };
} {
  const issuesKnown = rows.length > 0 && rows.every((row) =>
    row.issues_critical != null && row.issues_warning != null && row.issues_info != null,
  );

  const pages: PageAnalysisItem[] = rows.map((row) => {
    const issues = issuesKnown
      ? {
          critical: Number(row.issues_critical),
          warning: Number(row.issues_warning),
          info: Number(row.issues_info),
        }
      : null;

    // Оценку страницы не выдумываем: считаем от числа найденных замечаний.
    const seoScore = issues
      ? Math.max(0, 100 - issues.critical * 15 - issues.warning * 5 - issues.info * 2)
      : null;

    const statusCode = Number(row.status_code ?? 0);

    return {
      url: row.url,
      // Код 0 или пусто — страница не ответила, код неизвестен.
      statusCode: statusCode > 0 ? statusCode : null,
      // В базе время хранится в секундах, в отчёте показываем миллисекунды.
      loadTime: row.load_time == null ? null : Math.round(Number(row.load_time) * 1000),
      pageSize: Math.round(Number(row.content_length ?? 0) / 1024),
      seoScore,
      issues,
      metaTitle: row.title ?? '',
      metaDescription: row.description ?? '',
      h1Count: Number(row.h1_count ?? 0),
    };
  });

  const timedPages = pages.filter((p) => p.loadTime !== null);
  const avgLoadTime = timedPages.length > 0
    ? Math.round(timedPages.reduce((sum, p) => sum + (p.loadTime ?? 0), 0) / timedPages.length)
    : null;

  const avgSeoScore = issuesKnown && pages.length > 0
    ? Math.round(pages.reduce((sum, p) => sum + (p.seoScore ?? 0), 0) / pages.length)
    : null;

  const totalIssues = issuesKnown
    ? pages.reduce(
        (sum, p) => sum + (p.issues ? p.issues.critical + p.issues.warning + p.issues.info : 0),
        0,
      )
    : null;

  return {
    pages,
    summary: {
      totalPages: pages.length,
      avgLoadTime,
      avgSeoScore,
      totalIssues,
    },
  };
}
