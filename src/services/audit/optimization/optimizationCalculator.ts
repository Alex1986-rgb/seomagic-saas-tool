
import { 
  OptimizationMetrics, 
  OptimizationCosts, 
  PageContent, 
  OptimizationResults,
  OptimizationItem
} from '@/features/audit/types/optimization-types';

import { calculateDiscount } from './discountCalculator';
import { getPricingConfig } from './pricingConfig';
import { analyzeContent } from './contentAnalyzer';

export const calculateOptimizationMetrics = (
  pagesContent: PageContent[],
  totalUrls: number,
  brokenLinks: number = 0
): OptimizationMetrics => {
  // Default metrics
  const metrics: OptimizationMetrics = {
    beforeScore: 0,
    afterScore: 0,
    improvement: 0,
    pageSpeedImprovement: 0,
    seoScoreImprovement: 0,
    missingMetaDescriptions: 0,
    missingMetaKeywords: 0,
    missingAltTags: 0,
    duplicateMetaTags: 0,
    lowContentPages: 0,
    poorTitleTags: 0,
    poorHeadingStructure: 0,
    slowLoadingPages: Math.floor(totalUrls * 0.15), // Estimate
    poorMobileOptimization: Math.floor(totalUrls * 0.25), // Estimate
    brokenLinks,
    poorUrlStructure: Math.floor(totalUrls * 0.1), // Estimate
    totalScore: 0,
    potentialScoreIncrease: 0,
    estimatedCost: 0,
    optimizationItems: []
  };
  
  // Analyze the content to fill in the metrics
  const contentAnalysis = analyzeContent(pagesContent);
  
  // Copy analysis data to metrics
  if (contentAnalysis.missingMetaDescriptions !== undefined)
    metrics.missingMetaDescriptions = contentAnalysis.missingMetaDescriptions;
  if (contentAnalysis.missingMetaKeywords !== undefined)
    metrics.missingMetaKeywords = contentAnalysis.missingMetaKeywords;
  if (contentAnalysis.missingAltTags !== undefined)
    metrics.missingAltTags = contentAnalysis.missingAltTags;
  if (contentAnalysis.underscoreUrls !== undefined)
    metrics.poorUrlStructure = contentAnalysis.underscoreUrls;
  if (contentAnalysis.duplicateContent !== undefined)
    metrics.duplicateMetaTags = contentAnalysis.duplicateContent;
  if (contentAnalysis.contentToRewrite !== undefined)
    metrics.lowContentPages = contentAnalysis.contentToRewrite;
  
  return metrics;
};

export const calculateOptimizationCosts = (metrics: OptimizationMetrics, totalUrls: number): OptimizationCosts => {
  const pricingConfig = getPricingConfig();
  
  // Calculate individual costs
  const costs: OptimizationCosts = {
    baseCost: 0,
    pagesMultiplier: 0,
    pagesCost: 0,
    tasksCost: 0,
    discounts: 0,
    totalCost: 0,
    total: 0,
    sitemap: pricingConfig.sitemap,
    metaTags: ((metrics.missingMetaDescriptions || 0) + (metrics.missingMetaKeywords || 0) + (metrics.duplicateMetaTags || 0)) * pricingConfig.metaTagsPerItem,
    content: (metrics.lowContentPages || 0) * pricingConfig.contentPerPage,
    images: (metrics.missingAltTags || 0) * pricingConfig.imageAltPerItem,
    performance: (metrics.slowLoadingPages || 0) * pricingConfig.performancePerPage,
    links: (metrics.brokenLinks || 0) * pricingConfig.linksPerItem,
    structure: ((metrics.poorUrlStructure || 0) + (metrics.poorHeadingStructure || 0)) * pricingConfig.structurePerItem
  };
  
  // Calculate total
  costs.total = (costs.sitemap || 0) + (costs.metaTags || 0) + (costs.content || 0) + (costs.images || 0) + 
                (costs.performance || 0) + (costs.links || 0) + (costs.structure || 0);
  costs.totalCost = costs.total; // Sync both total fields
  
  // Apply discount
  const { discountPercentage, discountAmount, finalTotal } = calculateDiscount(costs.total, totalUrls);
  
  costs.discountPercentage = discountPercentage;
  costs.discountAmount = discountAmount;
  costs.finalTotal = finalTotal;
  costs.discounts = discountAmount || 0;
  
  return costs;
};

export const generateOptimizationRecommendations = (metrics: OptimizationMetrics): string[] => {
  const recommendations: string[] = [];
  
  if (metrics.missingMetaDescriptions && metrics.missingMetaDescriptions > 0) {
    recommendations.push(`Add missing meta descriptions to ${metrics.missingMetaDescriptions} pages.`);
  }
  
  if (metrics.missingMetaKeywords && metrics.missingMetaKeywords > 0) {
    recommendations.push(`Add missing meta keywords to ${metrics.missingMetaKeywords} pages.`);
  }
  
  if (metrics.duplicateMetaTags && metrics.duplicateMetaTags > 0) {
    recommendations.push(`Fix duplicate meta tags on ${metrics.duplicateMetaTags} pages.`);
  }
  
  if (metrics.missingAltTags && metrics.missingAltTags > 0) {
    recommendations.push(`Add alt text to ${metrics.missingAltTags} images.`);
  }
  
  if (metrics.lowContentPages && metrics.lowContentPages > 0) {
    recommendations.push(`Improve content quality on ${metrics.lowContentPages} pages with thin content.`);
  }
  
  if (metrics.poorTitleTags && metrics.poorTitleTags > 0) {
    recommendations.push(`Optimize title tags on ${metrics.poorTitleTags} pages.`);
  }
  
  if (metrics.poorHeadingStructure && metrics.poorHeadingStructure > 0) {
    recommendations.push(`Fix heading structure on ${metrics.poorHeadingStructure} pages.`);
  }
  
  if (metrics.slowLoadingPages && metrics.slowLoadingPages > 0) {
    recommendations.push(`Improve page load speed for ${metrics.slowLoadingPages} slow pages.`);
  }
  
  if (metrics.poorMobileOptimization && metrics.poorMobileOptimization > 0) {
    recommendations.push(`Optimize ${metrics.poorMobileOptimization} pages for mobile devices.`);
  }
  
  if (metrics.brokenLinks && metrics.brokenLinks > 0) {
    recommendations.push(`Fix ${metrics.brokenLinks} broken links.`);
  }
  
  if (metrics.poorUrlStructure && metrics.poorUrlStructure > 0) {
    recommendations.push(`Improve URL structure for ${metrics.poorUrlStructure} pages.`);
  }
  
  // Add general recommendations
  recommendations.push('Create and submit a comprehensive XML sitemap.');
  recommendations.push('Implement structured data markup for rich snippets.');
  recommendations.push('Consider implementing AMP for key pages.');
  
  return recommendations;
};

export const generateFullOptimizationResults = (
  pagesContent: PageContent[],
  totalUrls: number,
  brokenLinks: number = 0
): OptimizationResults => {
  const metrics = calculateOptimizationMetrics(pagesContent, totalUrls, brokenLinks);
  const costs = calculateOptimizationCosts(metrics, totalUrls);
  const recommendations = generateOptimizationRecommendations(metrics);
  
  return {
    metrics,
    costs,
    recommendations,
    items: metrics.optimizationItems || []
  };
};
