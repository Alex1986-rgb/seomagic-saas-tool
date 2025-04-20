
export interface PricingConfig {
  sitemap: number;
  metaTagsPerItem: number;
  contentPerPage: number;
  imageAltPerItem: number;
  performancePerPage: number;
  linksPerItem: number;
  structurePerItem: number;
  seoAuditBase: number;
  positionTrackingBase: number;
  keywordResearchBase: number;
  competitorAnalysisBase: number;
}

// Default pricing configuration
const defaultPricingConfig: PricingConfig = {
  sitemap: 30,
  metaTagsPerItem: 5,
  contentPerPage: 50,
  imageAltPerItem: 2,
  performancePerPage: 20,
  linksPerItem: 3,
  structurePerItem: 10,
  seoAuditBase: 100,
  positionTrackingBase: 50,
  keywordResearchBase: 80,
  competitorAnalysisBase: 120
};

let currentPricingConfig = { ...defaultPricingConfig };

/**
 * Get the current pricing configuration
 */
export const getPricingConfig = (): PricingConfig => {
  return currentPricingConfig;
};

/**
 * Update the pricing configuration
 */
export const updatePricingConfig = (config: Partial<PricingConfig>): PricingConfig => {
  currentPricingConfig = {
    ...currentPricingConfig,
    ...config
  };
  
  return currentPricingConfig;
};

/**
 * Reset pricing to default values
 */
export const resetPricingConfig = (): PricingConfig => {
  currentPricingConfig = { ...defaultPricingConfig };
  return currentPricingConfig;
};

/**
 * Calculate base price for a service
 */
export const calculateServiceBasePrice = (
  service: 'seoAudit' | 'positionTracking' | 'keywordResearch' | 'competitorAnalysis',
  multiplier: number = 1
): number => {
  switch (service) {
    case 'seoAudit':
      return currentPricingConfig.seoAuditBase * multiplier;
    case 'positionTracking':
      return currentPricingConfig.positionTrackingBase * multiplier;
    case 'keywordResearch':
      return currentPricingConfig.keywordResearchBase * multiplier;
    case 'competitorAnalysis':
      return currentPricingConfig.competitorAnalysisBase * multiplier;
    default:
      return 0;
  }
};
