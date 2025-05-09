
import { OptimizationMetrics, OptimizationCosts, PageContent, OptimizationResults } from '@/features/audit/types/optimization-types';
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
  
  metrics.missingMetaDescriptions = contentAnalysis.missingMetaDescriptions;
  metrics.missingMetaKeywords = contentAnalysis.missingMetaKeywords;
  metrics.missingAltTags = contentAnalysis.missingAltTags;
  metrics.poorUrlStructure = contentAnalysis.underscoreUrls || 0;
  metrics.duplicateMetaTags = contentAnalysis.duplicateContent || 0;
  metrics.lowContentPages = contentAnalysis.contentToRewrite || 0;
  
  return metrics;
};

export const calculateOptimizationCosts = (metrics: OptimizationMetrics, totalUrls: number): OptimizationCosts => {
  const pricingConfig = getPricingConfig();
  
  // Calculate individual costs
  const costs: OptimizationCosts = {
    sitemap: pricingConfig.sitemap,
    metaTags: (metrics.missingMetaDescriptions + metrics.missingMetaKeywords + metrics.duplicateMetaTags) * pricingConfig.metaTagsPerItem,
    content: metrics.lowContentPages * pricingConfig.contentPerPage,
    images: metrics.missingAltTags * pricingConfig.imageAltPerItem,
    performance: metrics.slowLoadingPages * pricingConfig.performancePerPage,
    links: metrics.brokenLinks * pricingConfig.linksPerItem,
    structure: (metrics.poorUrlStructure + metrics.poorHeadingStructure) * pricingConfig.structurePerItem,
    total: 0 // Will be calculated
  };
  
  // Calculate total
  costs.total = costs.sitemap + costs.metaTags + costs.content + costs.images + 
                costs.performance + costs.links + costs.structure;
  
  // Apply discount
  const { discountPercentage, discountAmount, finalTotal } = calculateDiscount(costs.total, totalUrls);
  
  costs.discountPercentage = discountPercentage;
  costs.discountAmount = discountAmount;
  costs.finalTotal = finalTotal;
  
  return costs;
};

export const generateOptimizationRecommendations = (metrics: OptimizationMetrics): string[] => {
  const recommendations: string[] = [];
  
  if (metrics.missingMetaDescriptions > 0) {
    recommendations.push(`Add missing meta descriptions to ${metrics.missingMetaDescriptions} pages.`);
  }
  
  if (metrics.missingMetaKeywords > 0) {
    recommendations.push(`Add missing meta keywords to ${metrics.missingMetaKeywords} pages.`);
  }
  
  if (metrics.duplicateMetaTags > 0) {
    recommendations.push(`Fix duplicate meta tags on ${metrics.duplicateMetaTags} pages.`);
  }
  
  if (metrics.missingAltTags > 0) {
    recommendations.push(`Add alt text to ${metrics.missingAltTags} images.`);
  }
  
  if (metrics.lowContentPages > 0) {
    recommendations.push(`Improve content quality on ${metrics.lowContentPages} pages with thin content.`);
  }
  
  if (metrics.poorTitleTags > 0) {
    recommendations.push(`Optimize title tags on ${metrics.poorTitleTags} pages.`);
  }
  
  if (metrics.poorHeadingStructure > 0) {
    recommendations.push(`Fix heading structure on ${metrics.poorHeadingStructure} pages.`);
  }
  
  if (metrics.slowLoadingPages > 0) {
    recommendations.push(`Improve page load speed for ${metrics.slowLoadingPages} slow pages.`);
  }
  
  if (metrics.poorMobileOptimization > 0) {
    recommendations.push(`Optimize ${metrics.poorMobileOptimization} pages for mobile devices.`);
  }
  
  if (metrics.brokenLinks > 0) {
    recommendations.push(`Fix ${metrics.brokenLinks} broken links.`);
  }
  
  if (metrics.poorUrlStructure > 0) {
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
    recommendations
  };
};
